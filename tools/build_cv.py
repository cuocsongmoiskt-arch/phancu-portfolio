# -*- coding: utf-8 -*-
"""CV Phan Cự — mỗi ngôn ngữ một file PDF A4, một cột, nền trắng.

Vì sao bố cục như vậy:
- Hệ thống lọc CV (ATS) và người tuyển dụng đọc từ trên xuống: dựng bằng platypus
  (các khối văn bản nối tiếp nhau) nên thứ tự chữ trích ra đúng thứ tự đọc — bản cũ vẽ
  từng ô bằng toạ độ, trích ra bị đảo (số liệu tách khỏi nhãn).
- Một file một ngôn ngữ: nộp đúng ngôn ngữ của tin tuyển dụng, không bắt người đọc lật
  qua 2 trang tiếng khác.
- Nền trắng, chữ đen, cỡ chữ 9.5–10pt: in đen trắng vẫn rõ, đọc trên điện thoại không phải phóng to.

Chạy:  python3 tools/build_cv.py
Ra:    public/cv/PhanCu_CV_VI.pdf, PhanCu_CV_ZH.pdf, PhanCu_CV_EN.pdf
       public/cv/PhanCu_CV.pdf = bản tiếng Việt (giữ đường dẫn cũ cho các link đã gửi đi)
"""
import os
import shutil

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)
from reportlab.platypus.flowables import HRFlowable

from cv_data import CONTACT, DATA

ROOT = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(ROOT, 'fonts')
CV_DIR = os.path.join(ROOT, '..', 'public', 'cv')
PHOTO = os.path.join(ROOT, '..', 'public', 'portrait.webp')

# vi/en dùng IBM Plex Sans (khớp web); zh cần chữ Hán nên dùng Noto Sans SC.
FONTS = {
    'vi': ('plex', 'plex-regular.ttf', 'plex-medium.ttf', 'plex-bold.ttf'),
    'en': ('plex', 'plex-regular.ttf', 'plex-medium.ttf', 'plex-bold.ttf'),
    'zh': ('noto', 'noto-regular.ttf', 'noto-medium.ttf', 'noto-bold.ttf'),
}

INK = HexColor('#1E2A33')
INK7 = HexColor('#2C3A45')
MUT = HexColor('#5E6B75')
LINE = HexColor('#D9D8D2')
ACC = HexColor('#3F6A5B')

MARGIN = 16 * mm


def register(lang):
    key, reg, med, bold = FONTS[lang]
    names = ('R-' + key, 'M-' + key, 'B-' + key)
    for name, f in zip(names, (reg, med, bold)):
        if name not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, f)))
    return names


def check_font(lang):
    """Chặn lỗi mất chữ: mọi ký tự của ngôn ngữ đó phải có trong font sẽ dùng."""
    from fontTools.ttLib import TTFont as FTFont
    _, reg, _, _ = FONTS[lang]
    cmap = FTFont(os.path.join(FONT_DIR, reg)).getBestCmap()
    chars = set()

    def walk(o):
        if isinstance(o, str):
            chars.update(o)
            chars.update(o.upper())
        elif isinstance(o, dict):
            for v in o.values():
                walk(v)
        elif isinstance(o, (list, tuple)):
            for v in o:
                walk(v)

    walk(DATA[lang])
    walk(CONTACT)
    walk('•')  # ký tự đầu dòng vẽ trong story(), không nằm trong DATA
    missing = sorted(c for c in chars if not c.isspace() and ord(c) not in cmap)
    if missing:
        raise SystemExit('DỪNG (%s): font thiếu ký tự: %s' % (lang, ''.join(missing)))


def styles(lang):
    R, M, B = register(lang)
    cjk = lang == 'zh'
    base = dict(fontName=R, textColor=INK7, alignment=TA_LEFT,
                wordWrap='CJK' if cjk else None)
    lead = 1.5 if cjk else 1.4

    def st(name, size, font=None, color=None, space_before=0, space_after=0, left=0, first=0):
        return ParagraphStyle(name, fontSize=size, leading=size * lead,
                              spaceBefore=space_before, spaceAfter=space_after,
                              leftIndent=left, firstLineIndent=first,
                              **{**base, 'fontName': font or R, 'textColor': color or INK7})

    return {
        'name': st('name', 21, B, INK),
        'title': st('title', 11.5, M, ACC, space_before=2),
        'contact': st('contact', 9, R, MUT, space_before=6),
        'h': st('h', 10, B, INK, space_before=8, space_after=2),
        'body': st('body', 9.6),
        'company': st('company', 10.5, B, INK),
        'role': st('role', 9.6, M, ACC),
        'meta': st('meta', 8.8, R, MUT, space_after=3),
        'group': st('group', 9.4, M, INK, space_before=4, space_after=1),
        'bullet': st('bullet', 9.3, left=10, first=-8, space_after=1),
        'label': st('label', 9.4, M, INK),
        'cell': st('cell', 9.4),
    }


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def heading(S, text):
    # keepWithNext: tiêu đề không bao giờ nằm trơ ở cuối trang, tách khỏi nội dung của nó
    rule = HRFlowable(width='100%', thickness=0.6, color=LINE, spaceBefore=0, spaceAfter=4)
    rule.keepWithNext = True
    p = Paragraph(esc(text), S['h'])
    p.keepWithNext = True
    return [p, rule]


def two_col(rows, S, label_w):
    """Bảng nhãn | nội dung — mỗi hàng đọc trái sang phải nên ATS vẫn ghép đúng cặp."""
    t = Table([[Paragraph(esc(a), S['label']), Paragraph(esc(b), S['cell'])] for a, b in rows],
              colWidths=[label_w, None], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 1.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
    ]))
    return t


def story(lang):
    d = DATA[lang]
    S = styles(lang)
    width = A4[0] - 2 * MARGIN
    out = []

    # ---- Đầu trang: tên, vị trí ứng tuyển, liên hệ | ảnh ----
    contact = '  ·  '.join(v for v in (
        CONTACT['phone'], CONTACT['email'], CONTACT['linkedin'], CONTACT['site'], d['location']) if v)
    left = [Paragraph(esc(d['name']), S['name']),
            Paragraph(esc(d['title']), S['title']),
            Paragraph(esc(contact), S['contact'])]
    photo = Image(PHOTO, width=22 * mm, height=29.3 * mm)
    head = Table([[left, photo]], colWidths=[width - 26 * mm, 26 * mm], hAlign='LEFT')
    head.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    out += [head, Spacer(1, 4)]

    # ---- Tóm tắt ----
    out += heading(S, d['h_summary'])
    out.append(Paragraph(esc(d['summary']), S['body']))

    # ---- Kinh nghiệm ----
    out += heading(S, d['h_exp'])
    for job in d['jobs']:
        top = Table([[Paragraph(esc(job['company']), S['company']),
                      Paragraph('<para alignment="right">%s</para>' % esc(job['period']), S['role'])]],
                    colWidths=[width * 0.7, width * 0.3], hAlign='LEFT')
        top.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0),
                                 ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                                 ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
                                 ('VALIGN', (0, 0), (-1, -1), 'BOTTOM')]))
        out += [top, Paragraph(esc(job['role']), S['role']), Paragraph(esc(job['meta']), S['meta'])]
        for group, bullets in job['groups']:
            block = [Paragraph(esc(group), S['group'])]
            block += [Paragraph('•&nbsp;&nbsp;' + esc(b), S['bullet']) for b in bullets]
            out.append(KeepTogether(block))

    # ---- Kỹ năng, ngoại ngữ, học vấn, dự án cá nhân ----
    label_w = 38 * mm if lang != 'zh' else 26 * mm
    out += heading(S, d['h_skills'])
    out.append(two_col(d['skills'], S, label_w))
    out += heading(S, d['h_lang'])
    out.append(two_col(d['langs'], S, label_w))
    out += heading(S, d['h_edu'])
    out.append(Paragraph('<font name="%s" color="#1E2A33">%s</font>  —  %s'
                         % (S['label'].fontName, esc(d['edu'][0]), esc(d['edu'][1])), S['body']))
    out += heading(S, d['h_other'])
    out.append(Paragraph(esc(d['other']), S['body']))
    return out


def footer(lang):
    R = register(lang)[0]

    def draw(c, doc):
        c.saveState()
        c.setFont(R, 7.5)
        c.setFillColor(MUT)
        c.drawString(MARGIN, 9 * mm, '%s  ·  %s  ·  %s' % (DATA[lang]['name'], CONTACT['phone'], CONTACT['email']))
        c.drawRightString(A4[0] - MARGIN, 9 * mm, '%d' % doc.page)
        c.restoreState()

    return draw


def build(lang):
    check_font(lang)
    path = os.path.join(CV_DIR, DATA[lang]['file'])
    doc = SimpleDocTemplate(
        path, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=12 * mm, bottomMargin=15 * mm,
        title='CV — %s — %s' % (DATA[lang]['name'], DATA[lang]['title']),
        author='Phan Dinh Cu', subject='Curriculum Vitae', lang=lang,
    )
    doc.build(story(lang), onFirstPage=footer(lang), onLaterPages=footer(lang))
    print('đã tạo %s (%d trang)' % (os.path.relpath(path, os.path.join(ROOT, '..')), doc.page))
    return path


if __name__ == '__main__':
    paths = {lang: build(lang) for lang in ('vi', 'zh', 'en')}
    # Giữ đường dẫn cũ /cv/PhanCu_CV.pdf (đã gửi trong các hồ sơ trước) — trỏ tới bản tiếng Việt
    shutil.copyfile(paths['vi'], os.path.join(CV_DIR, 'PhanCu_CV.pdf'))
    print('đã cập nhật public/cv/PhanCu_CV.pdf = bản tiếng Việt')
