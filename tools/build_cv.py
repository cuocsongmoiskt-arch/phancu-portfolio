# -*- coding: utf-8 -*-
"""CV Phan Cự — bố cục MỘT CỘT chuẩn, A4, 3 trang (VI / 中文 / EN)."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from cv_data import DATA, CONTACT

ROOT = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(ROOT, 'fonts')

# vi/en dùng IBM Plex Sans (khớp font thân chữ của web) — không có chữ Hán nên trang zh
# nạp riêng Noto Sans SC.
FONTS = {
    'vi': ('plex-regular.ttf', 'plex-medium.ttf', 'plex-bold.ttf'),
    'en': ('plex-regular.ttf', 'plex-medium.ttf', 'plex-bold.ttf'),
    'zh': ('noto-regular.ttf', 'noto-medium.ttf', 'noto-bold.ttf'),
}

# Tên đăng ký font (FN/FM/FB, gán động trong load_fonts) gắn với BỘ font (plex/noto),
# không gắn với ngôn ngữ. QUAN TRỌNG: ReportLab cache font theo tên cho suốt vòng đời
# canvas — nếu 3 ngôn ngữ cùng đăng ký lại một tên cố định bằng 3 file khác nhau
# (Plex/Noto/Plex) trong CÙNG canvas, lúc c.save() chỉ có 1 font được nhúng cho cả tài
# liệu, các trang trước đó bị nhúng sai font (đây chính là nguyên nhân trang tiếng Trung
# ra toàn ô vuông ở bản build trước). Vì vậy mỗi bộ font vật lý giữ một tên cố định riêng,
# không bao giờ tái dùng cho file khác trong cùng lần build.
FN = FM = FB = None
_registered_keys = set()


def load_fonts(lang):
    global FN, FM, FB
    reg, med, bold = FONTS[lang]
    key = os.path.splitext(reg)[0].rsplit('-', 1)[0]  # 'plex' hoặc 'noto'
    FN, FM, FB = 'N-%s' % key, 'NM-%s' % key, 'NB-%s' % key
    if key in _registered_keys:
        return
    pdfmetrics.registerFont(TTFont(FN, os.path.join(FONT_DIR, reg)))
    pdfmetrics.registerFont(TTFont(FM, os.path.join(FONT_DIR, med)))
    pdfmetrics.registerFont(TTFont(FB, os.path.join(FONT_DIR, bold)))
    _registered_keys.add(key)

INK = HexColor('#1E2A33')
INK7 = HexColor('#2C3A45')
MUT = HexColor('#63707A')
BG = HexColor('#F7F7F5')
WHITE = HexColor('#FFFFFF')
LINE = HexColor('#E4E3DE')
ACC = HexColor('#3F6A5B')
ACCL = HexColor('#E3EDE7')
HL = HexColor('#B08A55')
BAND = HexColor('#2C4150')
BAND2 = HexColor('#22333F')

W, H = A4
PRINT = False        # True = bản in: lề 15mm, nền trắng, không tràn mép
EXTRA = 0.0  # khoảng giãn thêm cho mỗi tiêu đề, tính ở lượt dựng thử
M = 34
CW = W - 2 * M
PHOTO = os.path.join(ROOT, '..', 'public', 'portrait.webp')


def set_mode(print_mode):
    """Bản gửi file: lề 12mm, nền kem, dải đầu trang tràn mép.
       Bản in: lề 15mm, nền trắng, dải đầu trang thụt vào trong lề."""
    global PRINT, M, CW, PAGE_BG, FOOT_RULE, FOOT_TEXT, TARGET_BOTTOM
    PRINT = print_mode
    M = 36 if print_mode else 34
    CW = W - 2 * M
    PAGE_BG = HexColor('#FFFFFF') if print_mode else BG
    FOOT_RULE = 52 if print_mode else 46
    FOOT_TEXT = 40 if print_mode else 34
    TARGET_BOTTOM = 62.0 if print_mode else 60.0


PAGE_BG = BG
FOOT_RULE = 46
FOOT_TEXT = 34


def wrap(text, font, size, max_w):
    if not text:
        return []
    cjk = any('\u4e00' <= ch <= '\u9fff' for ch in text)
    units = list(text) if cjk else text.split(' ')
    joiner = '' if cjk else ' '
    lines, cur = [], ''
    for u in units:
        test = (cur + joiner + u) if cur else u
        if pdfmetrics.stringWidth(test, font, size) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = u
    if cur:
        lines.append(cur)
    return lines


def draw_lines(c, text, x, y, w, font, size, leading, color):
    c.setFont(font, size)
    c.setFillColor(color)
    for ln in wrap(text, font, size, w):
        c.drawString(x, y, ln)
        y -= leading
    return y


def heading(c, text, y):
    y -= 3 + EXTRA
    c.setFont(FB, 9.6)
    c.setFillColor(INK)
    c.drawString(M, y, text)
    tw = pdfmetrics.stringWidth(text, FB, 9.6)
    c.setFillColor(HL)
    c.rect(M + tw + 8, y + 2.8, 18, 1.8, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(M + tw + 32, y + 3.6, M + CW, y + 3.6)
    return y - 13


def page(c, lang):
    d = DATA[lang]
    L = d['labels']

    c.setFillColor(PAGE_BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # ================= ĐẦU TRANG =================
    # Đo trước độ cao khối "mục tiêu" (badge có thể xuống dòng tuỳ độ dài nội dung/ngôn ngữ)
    # để band_h đủ chỗ — nếu không, chữ liên hệ + dải chỉ số bên dưới sẽ bị đè lên.
    ph_w0, ph_h0 = (60, 80) if PRINT else (62, 83)
    inset0 = 12 if PRINT else 0
    bx0_probe, bw_probe = (M, CW) if PRINT else (0, W)
    tw_max_probe = (bx0_probe + bw_probe - M - ph_w0 + inset0) - (M + inset0) - 22
    obj_extra_lines = 0
    if d.get('objective'):
        obj_extra_lines = max(0, len(wrap(d['objective'], FM, 8.2, tw_max_probe - 16)) - 1)

    band_h = (102 if PRINT else 114) + obj_extra_lines * 10.2
    if PRINT:
        # Bản in: khối đầu trang nằm gọn trong lề, máy in văn phòng nào cũng ra đủ
        bx0, bw = M, CW
        by = H - M - band_h
    else:
        bx0, bw = 0, W
        by = H - band_h

    steps = 80
    for i in range(steps):
        t = i / (steps - 1)
        col = HexColor('#%02x%02x%02x' % (
            round(0x2C + (0x22 - 0x2C) * t),
            round(0x41 + (0x33 - 0x41) * t),
            round(0x50 + (0x3F - 0x50) * t)))
        c.setFillColor(col)
        c.rect(bx0, by + band_h * (1 - (i + 1) / steps), bw, band_h / steps + 0.6, stroke=0, fill=1)
    c.setStrokeColor(HexColor('#3A5063'))
    c.setLineWidth(0.4)
    for gy in range(int(by), int(by + band_h), 24):
        c.line(bx0, gy, bx0 + bw, gy)
    for gx in range(int(bx0), int(bx0 + bw), 24):
        c.line(gx, by, gx, by + band_h)
    c.setFillColor(HL)
    c.rect(bx0, by, bw, 2.4, stroke=0, fill=1)

    ph_w, ph_h = (60, 80) if PRINT else (62, 83)
    inset = 12 if PRINT else 0
    px, py = bx0 + bw - M - ph_w + inset, by + (band_h - ph_h) / 2
    c.drawImage(ImageReader(PHOTO), px, py, ph_w, ph_h, mask=None)
    c.setStrokeColor(HL)
    c.setLineWidth(1.4)
    c.line(px, py + ph_h, px + 9, py + ph_h)
    c.line(px, py + ph_h, px, py + ph_h - 9)
    c.line(px + ph_w, py, px + ph_w - 9, py)
    c.line(px + ph_w, py, px + ph_w, py + 9)

    tx = M + inset
    tw_max = px - tx - 22
    ty = by + band_h - 22
    c.setFont(FB, 22)
    c.setFillColor(WHITE)
    c.drawString(tx, ty, d['name'])
    ty -= 12
    c.setFillColor(HL)
    c.rect(tx, ty, 30, 2, stroke=0, fill=1)
    ty -= 13
    c.setFont(FN, 8.6)
    c.setFillColor(HexColor('#B8C6D0'))
    for ln in wrap(d['role'], FN, 8.6, tw_max):
        c.drawString(tx, ty, ln)
        ty -= 11
    ty -= 4
    c.setFont(FM, 9.8)
    c.setFillColor(WHITE)
    for ln in wrap(d['tagline'], FM, 9.8, tw_max):
        c.drawString(tx, ty, ln)
        ty -= 12
    ty -= 3
    # dòng mục tiêu ứng tuyển — thứ nhà tuyển dụng cần thấy đầu tiên.
    # Wrap thay vì 1 dòng cố định: nội dung 4 vị trí dài hơn bản cũ, không còn chắc vừa 1 dòng.
    obj = d.get('objective')
    if obj:
        of = 8.2
        ol = wrap(obj, FM, of, tw_max - 16)
        ow = max((pdfmetrics.stringWidth(ln, FM, of) for ln in ol), default=0)
        bh_obj = len(ol) * 10.2 + 4.5
        c.setFillColor(HL)
        c.rect(tx, ty - bh_obj + 11.5, ow + 16, bh_obj, stroke=0, fill=1)
        c.setFont(FM, of)
        c.setFillColor(HexColor('#22333F'))
        ty2 = ty
        for ln in ol:
            c.drawString(tx + 8, ty2, ln)
            ty2 -= 10.2
        ty -= bh_obj + 2
    c.setFont(FN, 8)
    c.setFillColor(HexColor('#A6B6C2'))
    bits = [CONTACT['email'], CONTACT['phone']] + [v for v in (CONTACT['site'], CONTACT['linkedin']) if v]
    c.drawString(tx, ty, '   ·   '.join(bits))

    y = by - 15

    # ================= DẢI CHỈ SỐ =================
    box_h = 32
    y -= box_h
    bw = CW / 4
    c.setFillColor(WHITE)
    c.rect(M, y, CW, box_h, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.rect(M, y, CW, box_h, stroke=1, fill=0)
    for i, (val, lab) in enumerate(d['facts']):
        bx = M + i * bw
        if i:
            c.line(bx, y, bx, y + box_h)
        c.setFont(FB, 13)
        c.setFillColor(ACC)
        c.drawString(bx + 10, y + 18, val)
        c.setFont(FN, 6.5)
        c.setFillColor(MUT)
        for ln in wrap(lab, FN, 6.5, bw - 18)[:1]:
            c.drawString(bx + 10, y + 8, ln)
    y -= 15

    # ================= TÓM TẮT =================
    y = heading(c, d['h_summary'], y)
    y = draw_lines(c, d['summary'], M, y, CW, FN, 7.9, 10.4, INK7)
    y -= 4

    # ================= TRƯỚC → SAU =================
    y = heading(c, d['h_impact'], y)
    c1 = 104
    arrow = 16
    rest = CW - c1 - 14 - arrow
    cA = rest * 0.47
    cB = rest - cA
    xB = M + c1 + 14
    xArrow = xB + cA
    xC = xArrow + arrow

    c.setFont(FM, 6.3)
    c.setFillColor(MUT)
    c.drawString(xB, y, L['before'].upper())
    c.drawString(xC, y, L['after'].upper())
    y -= 9
    for name, before, after in d['impact']:
        la = wrap(before, FN, 7.4, cA - 8)
        lb = wrap(after, FM, 7.4, cB)
        ln_name = wrap(name, FM, 7.8, c1 - 10)
        rows = max(len(la), len(lb), len(ln_name))
        bh = rows * (8.2 if PRINT else 8.6) + (3 if PRINT else 4)
        c.setFillColor(WHITE)
        c.rect(M, y - bh + 8, CW, bh, stroke=0, fill=1)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.rect(M, y - bh + 8, CW, bh, stroke=1, fill=0)
        c.setFillColor(HL)
        c.rect(M, y - bh + 8, 2.4, bh, stroke=0, fill=1)

        ty2 = y
        c.setFont(FM, 7.8)
        c.setFillColor(INK)
        for ln in ln_name:
            c.drawString(M + 10, ty2, ln)
            ty2 -= 9.6
        ty2 = y
        c.setFont(FN, 7.4)
        c.setFillColor(MUT)
        for ln in la:
            c.drawString(xB, ty2, ln)
            ty2 -= 9.6
        c.setFont(FN, 8.4)
        c.setFillColor(ACC)
        c.drawString(xArrow, y, '\u2192')
        ty2 = y
        c.setFont(FM, 7.4)
        c.setFillColor(INK)
        for ln in lb:
            c.drawString(xC, ty2, ln)
            ty2 -= 9.6
        y -= bh + 1.5
    y -= 1

    # ================= KINH NGHIỆM =================
    y = heading(c, d['h_exp'], y)
    e = d['exp']
    c.setFont(FB, 9.6)
    c.setFillColor(INK)
    c.drawString(M, y, e['company'])
    c.setFont(FN, 8)
    c.setFillColor(ACC)
    c.drawRightString(M + CW, y, e['role'])
    y -= 10
    c.setFont(FN, 7)
    c.setFillColor(MUT)
    c.drawString(M, y, e['meta'])
    y -= 11
    for name, desc in e['groups']:
        c.setFillColor(ACC)
        c.circle(M + 2.4, y + 2.6, 2, stroke=0, fill=1)
        c.setFont(FM, 7.6)
        c.setFillColor(INK)
        c.drawString(M + 10, y, name)
        gw = pdfmetrics.stringWidth(name, FM, 7.6)
        first_w = CW - 10 - gw - 9
        parts = wrap(desc, FN, 7.4, first_w)
        c.setFont(FN, 7.4)
        c.setFillColor(INK7)
        if parts:
            c.drawString(M + 10 + gw + 9, y, parts[0])
            y -= 9.6
            remain = desc[len(parts[0]):].strip()
            for ln in wrap(remain, FN, 7.4, CW - 10):
                c.drawString(M + 10, y, ln)
                y -= 9.6
        y -= 1
    y -= 3

    # ================= NĂNG LỰC =================
    y = heading(c, d['h_cap'], y)
    lab_w = 116
    for name, items in d['caps']:
        lines = wrap(items, FN, 7.0, CW - lab_w - 6)
        c.setFont(FM, 7.6)
        c.setFillColor(INK)
        c.drawString(M, y, name)
        c.setFont(FN, 7.1)
        c.setFillColor(INK7)
        ty2 = y
        for ln in lines:
            c.drawString(M + lab_w, ty2, ln)
            ty2 -= 8.8
        c.setStrokeColor(LINE)
        c.setLineWidth(0.5)
        c.line(M, ty2 + 5, M + CW, ty2 + 5)
        y = ty2 - 2
    y -= 0

    # ================= HỆ THỐNG ĐÃ XÂY DỰNG =================
    y = heading(c, d['h_work'], y)
    for i, (name, sub, value, tech) in enumerate(d['works']):
        vl = wrap(value, FN, 7.4, CW - 36)
        bh = (7 if PRINT else 8) + len(vl) * (8.2 if PRINT else 8.6) + (5 if PRINT else 7)
        c.setFillColor(WHITE)
        c.rect(M, y - bh + 8, CW, bh, stroke=0, fill=1)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.rect(M, y - bh + 8, CW, bh, stroke=1, fill=0)

        c.setFont(FM, 6.6)
        c.setFillColor(ACC)
        c.drawString(M + 10, y, '0%d' % (i + 1))
        c.setFont(FB, 8.2)
        c.setFillColor(INK)
        c.drawString(M + 28, y, name)
        nw = pdfmetrics.stringWidth(name, FB, 8.2)
        c.setFont(FN, 7)
        c.setFillColor(MUT)
        c.drawString(M + 28 + nw + 8, y, sub)
        c.setFont(FN, 6.5)
        c.setFillColor(MUT)
        c.drawRightString(M + CW - 10, y, tech)
        ty2 = y - 11
        c.setFont(FN, 7.4)
        c.setFillColor(INK7)
        for ln in vl:
            c.drawString(M + 28, ty2, ln)
            ty2 -= 8.8
        y -= bh + 2
    y -= 3

    # ================= HỌC VẤN · NGÔN NGỮ =================
    y = heading(c, '%s   ·   %s' % (d['h_edu'], d['h_lang']), y)
    c.setFont(FM, 7.8)
    c.setFillColor(INK)
    c.drawString(M, y, d['edu'][0])
    ew = pdfmetrics.stringWidth(d['edu'][0], FM, 7.8)
    c.setFont(FN, 7.4)
    c.setFillColor(MUT)
    c.drawString(M + ew + 9, y, d['edu'][1])
    y -= 9.8
    c.setFont(FN, 7.4)
    c.setFillColor(INK7)
    c.drawString(M, y, '   ·   '.join('%s — %s' % (n, note) for n, note in d['langs']))
    y -= 18

    # ================= CÁCH LÀM VIỆC (gọn một dòng) =================
    y = heading(c, d['h_think'], y)
    sw5 = CW / 5
    for i, (en, note) in enumerate(d['think']):
        bx = M + i * sw5
        c.setFillColor(HL if i == 0 else ACC)
        c.circle(bx + 3, y + 2.4, 2.6, stroke=0, fill=1)
        c.setFont(FM, 7.4)
        c.setFillColor(INK)
        c.drawString(bx + 10, y, en)
        if not PRINT:
            c.setFont(FN, 6.4)
            c.setFillColor(MUT)
            for ln in wrap(note, FN, 6.4, sw5 - 12)[:1]:
                c.drawString(bx + 10, y - 8.6, ln)
    y -= 14 if PRINT else 24

    # ================= ĐỊNH HƯỚNG =================
    y = heading(c, d['h_dir'], y)
    dl = wrap(d['dir'], FM, 7.8, CW - 22)
    nl = wrap(d['dir_note'], FN, 7.4, CW - 22)
    bh = len(dl) * 9.4 + len(nl) * 8.6 + 9
    c.setFillColor(ACCL)
    c.rect(M, y - bh + 8, CW, bh, stroke=0, fill=1)
    c.setFillColor(HL)
    c.rect(M, y - bh + 8, 2.4, bh, stroke=0, fill=1)
    ty2 = y
    c.setFont(FM, 7.8)
    c.setFillColor(INK)
    for ln in dl:
        c.drawString(M + 11, ty2, ln)
        ty2 -= 10.4
    c.setFont(FN, 7.4)
    c.setFillColor(INK7)
    for ln in nl:
        c.drawString(M + 11, ty2, ln)
        ty2 -= 9.4

    # ================= CHÂN TRANG =================
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(M, FOOT_RULE, M + CW, FOOT_RULE)
    c.setFont(FN, 6.4)
    c.setFillColor(MUT)
    c.drawString(M, FOOT_TEXT, '%s   ·   %s' % (CONTACT['email'], CONTACT['phone']))
    c.setFillColor(ACC)
    c.drawCentredString(W / 2, FOOT_TEXT, d['lang_tag'])
    c.setFillColor(MUT)
    c.drawRightString(M + CW, FOOT_TEXT, '%d / 3' % (['vi', 'zh', 'en'].index(lang) + 1))

    return y - bh + 8


N_HEADINGS = 8


def check_font(lang):
    """Chặn lỗi mất chữ: kiểm tra đúng font sẽ dùng cho ngôn ngữ đó (xem FONTS ở trên)."""
    from fontTools.ttLib import TTFont as FTFont
    reg, _, _ = FONTS[lang]
    cm = FTFont(os.path.join(FONT_DIR, reg)).getBestCmap()
    chars = set()

    def walk(o):
        if isinstance(o, str):
            chars.update(o)
            chars.update(o.upper())
        elif isinstance(o, dict):
            for k, v in o.items():
                walk(k); walk(v)
        elif isinstance(o, (list, tuple)):
            for v in o:
                walk(v)

    walk(DATA[lang]); walk(CONTACT)
    missing = sorted(c for c in chars if ord(c) not in cm)
    if missing:
        raise SystemExit(
            'DỪNG (%s): font thiếu %d ký tự: %s'
            % (lang, len(missing), ''.join(missing))
        )
    print('  [kiểm tra font %s] đủ ký tự' % lang)


def build(path, print_mode=False):
    global EXTRA
    import tempfile
    set_mode(print_mode)
    print('== %s ==' % ('BẢN IN (lề 15mm, nền trắng)' if print_mode else 'BẢN GỬI FILE (lề 12mm)'))
    c = canvas.Canvas(path, pagesize=A4)
    c.setTitle('Phan Cu — CV — Production Management / Manufacturing Operations / Digital Transformation')
    c.setAuthor('Phan Cu')
    c.setSubject('Curriculum Vitae — Vietnamese / Chinese / English')
    probe_path = os.path.join(tempfile.gettempdir(), '_cv_probe.pdf')
    lows = {}
    for lang in ['vi', 'zh', 'en']:
        check_font(lang)
        load_fonts(lang)
        # lượt 1: dựng thử vào canvas bỏ đi để biết nội dung kết thúc ở đâu
        EXTRA = 0.0
        probe = canvas.Canvas(probe_path, pagesize=A4)
        low0 = page(probe, lang)
        # lượt 2: giãn (hoặc siết nhẹ) đều các tiêu đề cho trang cân
        EXTRA = max(-3.0 if PRINT else -2.0, min(9.0, (low0 - TARGET_BOTTOM) / N_HEADINGS))
        lows[lang] = page(c, lang)
        c.showPage()
        print('  %s: dựng thử đáy y=%.0f → giãn %.1fpt/tiêu đề → đáy y=%.0f' % (lang, low0, EXTRA, lows[lang]))
    EXTRA = 0.0
    c.save()
    for k, v in lows.items():
        print('%s: đáy nội dung y=%.0f  %s' % (k, v, 'TRÀN CHÂN TRANG' if v < 34 else 'ok'))
    print('đã tạo', path)


if __name__ == '__main__':
    CV_DIR = os.path.join(ROOT, '..', 'public', 'cv')
    build(os.path.join(CV_DIR, 'PhanCu_CV.pdf'), print_mode=False)
    build(os.path.join(CV_DIR, 'PhanCu_CV_print.pdf'), print_mode=True)
