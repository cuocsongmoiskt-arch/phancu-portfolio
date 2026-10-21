# -*- coding: utf-8 -*-
"""CV Phan Cự — mỗi ngôn ngữ một file PDF A4, một trang.

Thiết kế: tinh tế, không phô trương — nền trắng, một màu nhấn (xanh olive của website),
vạch beige chỉ dùng ở dải đầu trang. Chiều sâu đến từ khoảng trắng và cấp bậc chữ,
không từ khung, bóng hay màu nền đậm.

Ràng buộc ATS (đã thử bằng pdftotext):
- Dựng bằng platypus (khối văn bản nối tiếp) → chữ trích ra đúng thứ tự đọc.
- KHÔNG giãn chữ (charSpace) ở tiêu đề: ATS tách sai từ ("K INH NGH IỆM").
- Dải chỉ số là MỘT dòng chữ liền: chia thành nhiều ô thì số và nhãn bị đảo thứ tự.

Chạy:  python3 tools/build_cv.py
Ra:    public/cv/PhanCu_CV_VI.pdf, PhanCu_CV_ZH.pdf, PhanCu_CV_EN.pdf
       public/cv/PhanCu_CV.pdf = bản tiếng Việt (giữ đường dẫn cũ cho các link đã gửi đi)
"""
import os
import shutil
import tempfile

from PIL import Image as PILImage, ImageDraw
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)
from reportlab.platypus.flowables import Flowable

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

# Cùng bảng màu với website (src/styles/globals.css)
INK = HexColor('#1E2A33')
INK7 = HexColor('#34424D')
MUT = HexColor('#66737D')
LINE = HexColor('#E2E1DC')
ACC = HexColor('#3F6A5B')
ACC_TINT = HexColor('#F1F5F2')
HL = HexColor('#B08A55')

MARGIN = 17 * mm
BAND_H = 3.2  # dải màu đầu trang (pt)


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
    walk('•·|')  # ký tự vẽ trong story(), không nằm trong DATA
    missing = sorted(c for c in chars if not c.isspace() and ord(c) not in cmap)
    if missing:
        raise SystemExit('DỪNG (%s): font thiếu ký tự: %s' % (lang, ''.join(missing)))


def rounded_photo():
    """Ảnh chân dung bo góc nhẹ trên nền trắng — reportlab không tự cắt bo góc được."""
    im = PILImage.open(PHOTO).convert('RGB')
    w, h = im.size
    if w / h > 3 / 4:  # cắt về đúng tỉ lệ 3:4
        nw = int(h * 3 / 4)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    im = im.resize((600, 800), PILImage.LANCZOS)
    mask = PILImage.new('L', im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 599, 799), radius=44, fill=255)
    out = PILImage.new('RGB', im.size, (255, 255, 255))
    out.paste(im, (0, 0), mask)
    path = os.path.join(tempfile.gettempdir(), '_cv_photo.png')
    out.save(path)
    return path


def styles(lang):
    R, M, B = register(lang)
    cjk = lang == 'zh'
    lead = 1.5 if cjk else 1.42

    def st(size, font=None, color=None, before=0, after=0, left=0, first=0, align=TA_LEFT):
        return ParagraphStyle(
            'p', fontName=font or R, fontSize=size, leading=size * lead,
            textColor=color or INK7, alignment=align, wordWrap='CJK' if cjk else None,
            spaceBefore=before, spaceAfter=after, leftIndent=left, firstLineIndent=first)

    return {
        'fonts': (R, M, B),
        'name': ParagraphStyle('name', fontName=B, fontSize=25, leading=29, textColor=INK),
        'title': st(11.5, M, ACC, before=2),
        'contact': st(8.8, R, MUT, before=7),
        'body': st(9.4),
        'facts': ParagraphStyle('facts', fontName=R, fontSize=8.8, leading=15, textColor=MUT),
        'company': st(10.6, B, INK),
        'period': st(9, M, MUT, align=TA_RIGHT),
        'role': st(9.6, M, ACC),
        'meta': st(8.6, R, MUT, after=1),
        'group': st(9.2, B, INK, before=5, after=1.5),
        'bullet': st(9.2, left=11, first=-9, after=1.2),
        'label': st(9, M, INK),
        'cell': st(9.1),
    }


class Heading(Flowable):
    """Tiêu đề mục: ô vuông nhỏ màu nhấn · chữ đậm · đường kẻ mảnh kéo hết dòng.
    keepWithNext: không bao giờ nằm trơ ở cuối trang, tách khỏi nội dung của nó."""

    def __init__(self, text, font):
        super().__init__()
        self.text, self.font, self.size = text, font, 9.6
        self.keepWithNext = True

    def wrap(self, aw, ah):
        self.aw = aw
        return aw, 22

    def draw(self):
        c, y = self.canv, 6
        c.setFillColor(ACC)
        c.rect(0, y + 1.3, 4.2, 4.2, stroke=0, fill=1)
        c.setFont(self.font, self.size)
        c.setFillColor(INK)
        c.drawString(11, y, self.text)
        tw = pdfmetrics.stringWidth(self.text, self.font, self.size)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.line(11 + tw + 10, y + 3.4, self.aw, y + 3.4)


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def plain_table(rows, widths, extra=()):
    t = Table(rows, colWidths=widths, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        *extra,
    ]))
    return t


def two_col(rows, S, label_w, width):
    """Nhãn | nội dung — mỗi hàng đọc trái sang phải nên ATS vẫn ghép đúng cặp."""
    return plain_table(
        [[Paragraph(esc(a), S['label']), Paragraph(esc(b), S['cell'])] for a, b in rows],
        [label_w, width - label_w],
        [('BOTTOMPADDING', (0, 0), (-1, -1), 2.5)])


def story(lang, photo_path):
    d = DATA[lang]
    S = styles(lang)
    R, M, B = S['fonts']
    width = A4[0] - 2 * MARGIN - 12  # khung trang của platypus có lề trong 6pt mỗi bên
    dot = '<font color="#B08A55">  ·  </font>'
    out = []

    # ---- Đầu trang: tên · vị trí ứng tuyển · liên hệ | ảnh bo góc ----
    # Liên hệ chia 2 dòng chủ động, tránh để trình dàn chữ tự ngắt giữa cụm từ
    line1 = dot.join(esc(v) for v in (CONTACT['phone'], CONTACT['email']) if v)
    line2 = dot.join(esc(v) for v in (CONTACT['linkedin'], CONTACT['site'], d['location']) if v)
    left = [Paragraph(esc(d['name']), S['name']),
            Paragraph(esc(d['title']), S['title']),
            Paragraph(line1 + '<br/>' + line2, S['contact'])]
    photo_w = 23 * mm
    out.append(plain_table(
        [[left, Image(photo_path, width=photo_w, height=photo_w * 4 / 3)]],
        [width - photo_w, photo_w],
        [('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), ('RIGHTPADDING', (0, 0), (0, 0), 14)]))
    out.append(Spacer(1, 10))

    # ---- Dải chỉ số: MỘT dòng chữ liền trong khung nền nhạt ----
    sep = '<font color="#C9CFCA">&nbsp;&nbsp;|&nbsp;&nbsp;</font>'
    facts = sep.join('<font name="%s" size="12.5" color="#3F6A5B">%s</font>&nbsp;&nbsp;%s'
                     % (B, esc(v).replace(' ', '&nbsp;'), esc(lab).replace(' ', '&nbsp;'))
                     for v, lab in d['facts'])
    out.append(plain_table(
        [[Paragraph(facts, S['facts'])]], [width],
        [('BACKGROUND', (0, 0), (-1, -1), ACC_TINT),
         ('ROUNDEDCORNERS', [6, 6, 6, 6]),
         ('LEFTPADDING', (0, 0), (-1, -1), 12),
         ('RIGHTPADDING', (0, 0), (-1, -1), 12),
         ('TOPPADDING', (0, 0), (-1, -1), 6),
         ('BOTTOMPADDING', (0, 0), (-1, -1), 7)]))
    out.append(Spacer(1, 4))

    # ---- Tóm tắt ----
    out += [Heading(d['h_summary'], B), Paragraph(esc(d['summary']), S['body'])]

    # ---- Kinh nghiệm ----
    out.append(Heading(d['h_exp'], B))
    for job in d['jobs']:
        out.append(plain_table(
            [[Paragraph(esc(job['company']), S['company']), Paragraph(esc(job['period']), S['period'])]],
            [width * 0.7, width * 0.3], [('VALIGN', (0, 0), (-1, -1), 'BOTTOM')]))
        out += [Paragraph(esc(job['role']), S['role']), Paragraph(esc(job['meta']), S['meta'])]
        for group, bullets in job['groups']:
            block = [Paragraph(esc(group), S['group'])]
            block += [Paragraph('<font color="#3F6A5B">•</font>&nbsp;&nbsp;' + esc(b), S['bullet'])
                      for b in bullets]
            out.append(KeepTogether(block))

    # ---- Kỹ năng · ngoại ngữ · học vấn · dự án cá nhân ----
    label_w = 38 * mm if lang != 'zh' else 26 * mm
    out += [Heading(d['h_skills'], B), two_col(d['skills'], S, label_w, width)]
    out += [Heading(d['h_lang'], B), two_col(d['langs'], S, label_w, width)]
    out += [Heading(d['h_edu'], B),
            Paragraph('<font name="%s" color="#1E2A33">%s</font>%s%s'
                      % (M, esc(d['edu'][0]), dot, esc(d['edu'][1])), S['body'])]
    out += [Heading(d['h_other'], B), Paragraph(esc(d['other']), S['body'])]
    return out


def decorate(lang):
    R = register(lang)[0]

    def draw(c, doc):
        c.saveState()
        w, h = A4
        # Dải màu đầu trang: olive kéo hết chiều ngang, một đoạn beige ngắn ở mép trái
        c.setFillColor(ACC)
        c.rect(0, h - BAND_H, w, BAND_H, stroke=0, fill=1)
        c.setFillColor(HL)
        c.rect(0, h - BAND_H, MARGIN + 18 * mm, BAND_H, stroke=0, fill=1)
        # Chân trang
        c.setStrokeColor(LINE)
        c.setLineWidth(0.5)
        c.line(MARGIN, 12.5 * mm, w - MARGIN, 12.5 * mm)
        c.setFont(R, 7.4)
        c.setFillColor(MUT)
        c.drawString(MARGIN, 8.5 * mm, '%s  ·  %s  ·  %s'
                     % (DATA[lang]['name'], CONTACT['phone'], CONTACT['email']))
        c.drawRightString(w - MARGIN, 8.5 * mm, CONTACT['site'])
        c.restoreState()

    return draw


def build(lang, photo_path):
    check_font(lang)
    path = os.path.join(CV_DIR, DATA[lang]['file'])
    doc = SimpleDocTemplate(
        path, pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=13 * mm, bottomMargin=16 * mm,
        title='CV — %s — %s' % (DATA[lang]['name'], DATA[lang]['title']),
        author='Phan Dinh Cu', subject='Curriculum Vitae', lang=lang,
    )
    doc.build(story(lang, photo_path), onFirstPage=decorate(lang), onLaterPages=decorate(lang))
    print('đã tạo %s (%d trang)' % (os.path.relpath(path, os.path.join(ROOT, '..')), doc.page))
    return path


if __name__ == '__main__':
    photo = rounded_photo()
    paths = {lang: build(lang, photo) for lang in ('vi', 'zh', 'en')}
    # Giữ đường dẫn cũ /cv/PhanCu_CV.pdf (đã gửi trong các hồ sơ trước) — trỏ tới bản tiếng Việt
    shutil.copyfile(paths['vi'], os.path.join(CV_DIR, 'PhanCu_CV.pdf'))
    print('đã cập nhật public/cv/PhanCu_CV.pdf = bản tiếng Việt')
