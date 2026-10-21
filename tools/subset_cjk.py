# -*- coding: utf-8 -*-
"""Cắt gọn Noto Sans SC chỉ giữ các chữ CV đang dùng (font đầy đủ ~10MB/độ đậm, bản cắt ~200KB).

Chạy lại mỗi khi build_cv.py báo "font thiếu ký tự" ở bản zh:
    npm pack @expo-google-fonts/noto-sans-sc && tar -xzf expo-google-fonts-noto-sans-sc-*.tgz
    python3 tools/subset_cjk.py package
(thư mục `package` chứa 400Regular/, 500Medium/, 700Bold/ của gói npm trên — font OFL-1.1)
"""
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

from cv_data import CONTACT, DATA

ROOT = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(ROOT, 'fonts')
WEIGHTS = [('400Regular', 'noto-regular.ttf'), ('500Medium', 'noto-medium.ttf'), ('700Bold', 'noto-bold.ttf')]


def used_codepoints():
    cps = set(range(0x20, 0x7F)) | {ord(c) for c in '•·|，。、；：？！“”‘’（）《》—…→～%'}
    current = os.path.join(FONT_DIR, WEIGHTS[0][1])
    if os.path.exists(current):  # giữ mọi chữ đã có, chỉ thêm
        cps |= set(TTFont(current).getBestCmap())

    def walk(o):
        if isinstance(o, str):
            cps.update(map(ord, o))
        elif isinstance(o, dict):
            for v in o.values():
                walk(v)
        elif isinstance(o, (list, tuple)):
            for v in o:
                walk(v)

    walk(DATA)
    walk(CONTACT)
    return cps


def main(src_dir):
    cps = used_codepoints()
    for folder, out in WEIGHTS:
        src = os.path.join(src_dir, folder, 'NotoSansSC_%s.ttf' % folder)
        font = TTFont(src)
        cmap = font.getBestCmap()
        opts = subset.Options()
        opts.layout_features = ['*']
        opts.name_IDs = ['*']
        opts.notdef_outline = True
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=[u for u in cps if u in cmap])
        sub.subset(font)
        font.save(os.path.join(FONT_DIR, out))
        print('%s: %d ký tự' % (out, len(font.getBestCmap())))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
