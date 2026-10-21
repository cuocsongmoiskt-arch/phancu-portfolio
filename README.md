# Phan Cự — Personal Portfolio

Next.js 15 (App Router) · TypeScript · Tailwind · next-intl (vi / zh / en)

## Chạy thử

```bash
npm install
npm run dev      # http://localhost:3000  → tự chuyển sang /vi
npm run build && npm start
```

## Cấu trúc

```
src/
├── app/[locale]/     layout (SEO, hreflang, font) + page
├── app/robots.ts     robots.txt
├── app/sitemap.ts    sitemap.xml cho 3 ngôn ngữ
├── components/
│   ├── layout/       SiteHeader, TitleBlockBar (signature)
│   ├── ui/           Button, FlowLine
│   └── sections/     Hero  (SEC 02–07 bổ sung ở bước sau)
├── content/          dữ liệu KHÔNG phụ thuộc ngôn ngữ + placeholder
├── i18n/             routing + request config
└── styles/           globals.css chứa toàn bộ design token
messages/             vi.json · zh.json · en.json  ← toàn bộ chữ hiển thị
```

Quy tắc: **không viết chữ cứng trong component**. Chữ hiển thị nằm ở `messages/*.json`, dữ liệu nằm ở `src/content/`.

## Cần bổ sung (đang để trống, UI tự hiện trạng thái "chưa có")

Mở `src/content/profile.ts`:

| Trường               | Ghi chú                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `email`, `phone`     | hiển thị ở section Contact                                                                                                                             |
| `linkedin`, `github` | bỏ trống thì ẩn dòng đó                                                                                                                                |
| `cvByLocale`         | CV riêng từng ngôn ngữ — tạo bằng `python3 tools/build_cv.py` (sửa nội dung ở `tools/cv_data.py`); bản zh báo thiếu chữ thì chạy `tools/subset_cjk.py` |
| `siteUrl`            | domain thật, dùng cho metadata + sitemap                                                                                                               |

## Ghi chú kỹ thuật

- Font nạp qua `<link>` Google Fonts. Khi deploy có mạng ổn định, có thể đổi sang `next/font/google` để self-host, nhanh hơn.
- Pin `next@15.5.23` (bản đã vá CVE-2025-66478) và `next-intl@4`.
- Prisma + Supabase + Admin CMS sẽ nối vào ở bước sau; hiện nội dung đọc từ file nên chưa cần database để chạy.

---

## Chạy trên máy Windows (cổng 3200)

Cổng 3000 / 3001 / 3100 / 8088 đã bị các hệ thống khác chiếm, nên website này dùng **3200**.
Đổi cổng: sửa `scripts/*.bat` (dòng `set "PORT=3200"`) và `package.json`.

### Cách 1 — chạy ngay, 1 click

Nháy đúp `scripts\START_PORTFOLIO.bat`.

Lần đầu script tự cài thư viện và build (vài phút), các lần sau lên trong khoảng 5 giây.
Chạy xong nó tự mở trình duyệt, in ra địa chỉ LAN rồi tự đóng cửa sổ — tiến trình chạy ngầm, **không để lại cửa sổ CMD đen**.

- Dừng: `scripts\STOP_PORTFOLIO.bat`
- Log: `logs\portfolio.log`
- Bấm lại khi đang chạy sẵn: script nhận ra và chỉ mở trình duyệt, không bật thêm tiến trình thứ hai.

### Cách 2 — tự khởi động cùng máy

Chuột phải `scripts\INSTALL_SERVICE.bat` → **Run as administrator**.

- Máy đã cài **NSSM** → cài thành Windows Service thật (`WEBOX_Portfolio`, auto start), quản lý bằng `services.msc` như MES.
- Máy chưa có NSSM → dùng **Task Scheduler**, tác vụ `WEBOX_Portfolio` chạy lúc bật máy dưới tài khoản SYSTEM.

Cuối script có hỏi mở cổng 3200 trên Windows Firewall để máy khác trong LAN vào được. Gõ `Y` nếu đồng ý, phím khác để bỏ qua — bỏ qua thì chỉ vào được từ chính máy đó.

Gỡ: chuột phải `scripts\UNINSTALL_SERVICE.bat` → Run as administrator (gỡ service, tác vụ, rule tường lửa và dừng tiến trình; mã nguồn giữ nguyên).

### Cần cài sẵn

Node.js 20 trở lên. Script tự kiểm tra, thiếu thì báo và dừng chứ không chạy tiếp.

---

## Định vị & bảng màu (bản 2026.08)

**Manufacturing Operations · Digitalization · IT & AI** — _Connecting People, Process and Technology._

Bảng màu Warm Industrial Minimal, khai báo ở `src/styles/globals.css`:

| Token          | Mã        | Vai trò                                   | Tỷ lệ |
| -------------- | --------- | ----------------------------------------- | ----- |
| `--bg`         | `#F7F7F5` | Nền toàn trang                            | ~70%  |
| `--surface`    | `#FFFFFF` | Card, bề mặt nổi                          | ~20%  |
| `--ink-900`    | `#252525` | Chữ chính, dải tối                        | ~8%   |
| `--ink-500`    | `#6B6B67` | Chữ phụ                                   |       |
| `--line`       | `#E4E3DE` | Đường viền mảnh                           |       |
| `--accent-600` | `#65756B` | Accent olive: số thứ tự, nhãn, trạng thái | ~2%   |
| `--accent-050` | `#E7ECE8` | Nền nhạt cho khối Business Value          |       |
| `--highlight`  | `#B19A78` | Vạch nhấn beige, dùng ở 3 chỗ duy nhất    |       |

`--highlight` chỉ xuất hiện ở: vạch dưới tagline, vạch dọc cột "Cách xử lý", viền trái câu kết Career Direction. Không dùng cho chữ dài.

## Cấu trúc trang chủ

| Mã     | Section          | Ghi chú                                                                    |
| ------ | ---------------- | -------------------------------------------------------------------------- |
| SEC 01 | Hero             | Tên, 3 định vị, tagline, CTA View my work / Download CV                    |
| SEC 02 | About            | Production × Process × Technology × Data                                   |
| SEC 03 | Experience       | WEBOX Việt Nam — Operations / Digitalization / IT & System                 |
| SEC 04 | What I Improve   | 5 mảng, trình bày Vấn đề → Cách xử lý                                      |
| SEC 05 | Selected Work    | 5 dự án, công tắc Business / Technical                                     |
| SEC 06 | How I Think      | Understand → Standardize → Make Data Visible → Use Technology/AI → Improve |
| SEC 07 | AI in Work       | 5 cách dùng AI thực tế                                                     |
| SEC 08 | Capabilities     | Operations · Digitalization · IT & System · Data · AI · Cross-functional   |
| SEC 09 | Career Direction | 5 hướng phát triển                                                         |
| SEC 10 | Education        | Một dải mỏng                                                               |
| SEC 11 | Contact          | Nền tối, email + điện thoại                                                |

## Dự án & trạng thái (bản 2026.10)

Dữ liệu ở `src/content/projects.ts`, chữ hiển thị ở `messages/*.json → projects.items.<slug>`.
Mỗi dự án có đúng một trong ba trạng thái:

| `status`     | VI             | EN          | ZH     | Nghĩa                                            |
| ------------ | -------------- | ----------- | ------ | ------------------------------------------------ |
| `completed`  | Hoàn thành     | Completed   | 已完成 | Đã triển khai, đang dùng thực tế                 |
| `inProgress` | Đang thực hiện | In Progress | 进行中 | Đang phát triển / nghiên cứu, chưa phải bản cuối |
| `planned`    | Kế hoạch       | Planned     | 规划中 | Mới nghiên cứu, định hướng — chưa triển khai     |

Nhãn của khối kết quả đổi theo trạng thái (Kết quả / Hiện trạng / Kết quả kỳ vọng) để ý tưởng
không bị đọc thành thành tích. Dự án `featured: true` (MES — hệ thống đang vận hành thật) đứng đầu, card rộng toàn hàng.
Trang chủ có bộ lọc theo trạng thái thay cho công tắc Quản lý / Kỹ thuật cũ.

Chưa có ảnh thực tế (`images: []`) thì card vẽ sơ đồ quy trình từ `flow` và ghi rõ
"ảnh thực tế sẽ bổ sung" — không dùng ảnh minh hoạ giả. Thêm ảnh: đặt `.webp` vào
`public/projects/` rồi khai báo trong `images`.

Thêm dự án mới: thêm phần tử vào `projects` **và** mục `items.<slug>` ở cả 3 file ngôn ngữ.
`npm test` sẽ báo lỗi nếu thiếu khoá, lệch số phần tử giữa các ngôn ngữ hoặc sai trạng thái.

## Trang chi tiết dự án

`/projects/[slug]` — Mục tiêu → Nội dung thực hiện → Công nghệ · Phương pháp → Kết quả, kèm nhãn
trạng thái, ảnh thực tế (hoặc sơ đồ), JSON-LD `CreativeWork` có `creativeWorkStatus`. Trang được
index và có trong `sitemap.xml`; slug không tồn tại trả 404.

## Hiệu ứng & bóng đổ

Reveal khi cuộn (lệch 60–90ms), card nâng 3px + bóng cấp 2 khi hover, ảnh phóng 3%, gạch chân chạy ở menu kèm scroll-spy, dải khung tên đáy đổi mã theo section. Tất cả tắt khi máy bật `prefers-reduced-motion`.

Bóng đổ 3 cấp ở `:root`: `--shadow-1` header/nút · `--shadow-2` card hover · `--shadow-3` dự phòng.

## Chỗ còn trống — hiển thị rõ, không bịa

- Ảnh thực tế cho 4 dự án: AI + MCP + SketchUp, Software Architecture & QA, AI-Assisted Architectural Design, Browser-Based 3D Model Sharing (đang hiện sơ đồ quy trình)
- Số liệu đo được cho các dự án Đang thực hiện (ví dụ thời gian tiết kiệm khi dựng mô hình)
- GitHub: tự ẩn khi trống
