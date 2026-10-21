# -*- coding: utf-8 -*-
"""Nội dung CV 3 ngôn ngữ — mỗi ngôn ngữ xuất ra MỘT file riêng.

Viết cho người tuyển dụng vị trí quản lý sản xuất và cho hệ thống lọc CV (ATS):
- Phần sản xuất đứng trước, công nghệ là công cụ hỗ trợ, gói gọn.
- Mỗi gạch đầu dòng bắt đầu bằng động từ + phạm vi/con số thật.
- Chỉ dùng thông tin Phan Cự đã cung cấp — không thêm số liệu chưa có.
"""

CONTACT = {
    "email": "Phancu.edu@gmail.com",
    "phone": "0888523894",
    "site": "phandinh.site",
    "linkedin": "linkedin.com/in/phandinhcu",
}

DATA = {
    "vi": {
        "file": "PhanCu_CV_VI.pdf",
        "name": "PHAN ĐÌNH CỰ",
        "title": "Giám sát Sản xuất · Phó Quản lý Sản xuất",
        "location": "Làm việc mọi khu vực",
        "facts": [("2,5 năm", "quản lý sản xuất"), ("~1.500", "tủ / tháng"), ("3 xưởng", "~250 nhân sự"), ("HSK 4+", "tiếng Trung")],
        "h_summary": "TÓM TẮT",
        "summary": "Phụ trách quản lý sản xuất tại nhà máy tủ khoá thông minh có Ban Giám đốc người Trung Quốc: lập kế hoạch theo "
                   "đơn hàng, kiểm soát tiến độ 3 xưởng Kim loại – Sơn – Lắp ráp, báo cáo trực tiếp Giám đốc Nhà máy. Dùng tiếng Trung "
                   "hằng ngày với quản lý Trung Quốc. Tự xây dựng MES và hệ thống kho bán thành phẩm để số liệu sản xuất minh bạch "
                   "theo thời gian thực.",
        "h_exp": "KINH NGHIỆM LÀM VIỆC",
        "jobs": [
            {
                "company": "WEBOX VIỆT NAM",
                "role": "Trợ lý Giám đốc Nhà máy — phụ trách Quản lý Sản xuất",
                "period": "04/2024 – nay",
                "meta": "Sản xuất tủ khoá thông minh và gia công linh kiện tủ cao cấp · ~250 nhân sự · 3 xưởng · môi trường Việt – Trung",
                "groups": [
                    ("Kế hoạch & tiến độ", [
                        "Lập kế hoạch sản xuất theo đơn hàng, kiểm soát tiến độ qua 4 công đoạn Kim loại → Sơn → Lắp ráp → Xuất hàng "
                        "cho ~10 đơn hàng, ~1.500 tủ thông minh mỗi tháng, song song các đơn gia công linh kiện.",
                        "Điều phối công việc hằng ngày qua cán bộ quản lý của 3 xưởng; xử lý vướng mắc, báo cáo khi vượt thẩm quyền.",
                        "Theo dõi đơn hàng tới khi giao; lập báo cáo sản xuất cho Giám đốc Nhà máy và Ban Giám đốc.",
                    ]),
                    ("Quy trình & con người", [
                        "Chuẩn hoá biểu mẫu, SOP và cách ghi số liệu sản xuất; áp dụng 5S, Kaizen trong hệ thống ISO 9001 của nhà máy.",
                        "Đào tạo công nhân mới; huấn luyện cán bộ cấp trung cách lập kế hoạch, theo dõi tiến độ, xử lý vướng mắc và báo cáo.",
                        "Phối hợp Kho, Nhân sự, Chất lượng, IT giải quyết vấn đề liên bộ phận; chuyển tải yêu cầu công việc Việt – Trung.",
                    ]),
                    ("Số hoá quản lý sản xuất", [
                        "Xây dựng MES nội bộ: BGĐ xem kế hoạch, tiến độ 3 xưởng trên một màn hình thay vì chờ báo cáo tay 1 ngày.",
                        "Thiết kế hệ thống kho bán thành phẩm hơn 1.100 mã (trong 5.000+ mã vật tư): tra tồn kho, vị trí theo thời gian thực.",
                        "Số hoá đối chiếu chấm công và sản lượng theo tổ — không còn phụ thuộc thao tác Excel thủ công của một người.",
                        "Vận hành hạ tầng IT nhà máy: máy tính, mạng LAN, máy in, camera, máy chủ.",
                    ]),
                ],
            },
            {
                "company": "TỰ KINH DOANH",
                "role": "Chủ cửa hàng mua bán, sửa chữa máy tính – laptop",
                "period": "2019 – 2024",
                "meta": "Khởi nghiệp sau khi tốt nghiệp: tự mở và vận hành cửa hàng — nhập, bán máy tính, laptop và nhận sửa chữa.",
                "groups": [],
            },
        ],
        "h_skills": "KỸ NĂNG",
        "skills": [
            ("Quản lý sản xuất", "Kế hoạch sản xuất · Kiểm soát tiến độ · Quản lý đơn hàng · Điều phối xưởng · Đào tạo"),
            ("Cải tiến & chất lượng", "5S · Kaizen · SOP · ISO 9001 · Phân tích nguyên nhân gốc"),
            ("Dữ liệu & công cụ", "Excel · SQL · MES · Quản lý kho · Python"),
        ],
        "h_lang": "NGOẠI NGỮ",
        "langs": [
            ("Tiếng Trung — HSK 4+", "họp, xử lý tài liệu, chuyển tải yêu cầu công việc hai chiều với quản lý Trung Quốc"),
            ("Tiếng Anh", "đọc hiểu tài liệu công việc, kỹ thuật"),
        ],
        "h_edu": "HỌC VẤN",
        "edu": ("Đại học Sư phạm Kỹ thuật TP. Hồ Chí Minh", "Kỹ thuật Điện tử Công nghiệp", "Tốt nghiệp 09/2019"),
        "h_other": "DỰ ÁN CÁ NHÂN",
        "other": "Đang phát triển: tự động hoá thiết kế 3D bằng AI (AI Agent kết nối SketchUp qua MCP) — phandinh.site",
    },

    "zh": {
        "file": "PhanCu_CV_ZH.pdf",
        "name": "潘廷巨  PHAN DINH CU",
        "title": "生产主管 · 生产副经理",
        "location": "工作地点不限",
        "facts": [("2.5 年", "生产管理"), ("~1,500", "台 / 月"), ("3 个车间", "约 250 人"), ("HSK 4+", "中文")],
        "h_summary": "个人简介",
        "summary": "在中方管理的智能柜工厂负责生产管理：按订单编制生产计划，管控钣金、喷涂、装配三个车间的进度，直接向厂长汇报。"
                   "日常用中文与中方管理层沟通。自主搭建 MES 与半成品仓库系统，让生产数据实时透明。",
        "h_exp": "工作经历",
        "jobs": [
            {
                "company": "WEBOX 越南有限公司",
                "role": "厂长助理 — 主管生产管理",
                "period": "2024.04 – 至今",
                "meta": "智能储物柜生产及高端柜体零部件代工 · 约 250 人 · 三个车间 · 中越协作环境",
                "groups": [
                    ("计划与进度", [
                        "按订单编制生产计划，管控钣金 → 喷涂 → 装配 → 出货四道工序进度，每月约 10 张订单、约 1,500 台智能柜，同时兼顾零部件代工订单。",
                        "通过三个车间的干部安排每日工作；处理现场问题，超出权限时及时上报。",
                        "跟踪订单直至交付；向厂长及管理层提交生产报表。",
                    ]),
                    ("流程与团队", [
                        "规范表单、SOP 与生产数据记录方式；在工厂 ISO 9001 体系内推行 5S、改善（Kaizen）。",
                        "为新入职工人做上岗培训；向车间中层干部传授计划、进度跟踪、问题处理与汇报方法。",
                        "与仓库、人事、品质、IT 协作解决跨部门问题；在中越两种语言之间传达工作要求。",
                    ]),
                    ("生产管理数字化", [
                        "搭建内部 MES 系统：管理层在同一界面查看三个车间的计划与进度，不必再等次日的人工汇总报表。",
                        "设计半成品仓库系统，覆盖 1,100 多个编号（全厂 5,000 多个物料编号）：实时查询库存与库位。",
                        "考勤与班组产量核对数字化 —— 不再依赖某一个人手工处理 Excel。",
                        "负责工厂 IT 基础设施：电脑、局域网、打印机、监控摄像头、服务器。",
                    ]),
                ],
            },
            {
                "company": "自主创业",
                "role": "电脑、笔记本销售与维修门店店主",
                "period": "2019 – 2024",
                "meta": "毕业后自主创业：开设并经营门店 —— 电脑、笔记本的采购、销售及维修服务。",
                "groups": [],
            },
        ],
        "h_skills": "专业技能",
        "skills": [
            ("生产管理", "生产计划 · 进度管控 · 订单管理 · 车间协调 · 生产报表 · 培训"),
            ("改善与质量", "5S · 改善（Kaizen）· SOP · ISO 9001 · 根因分析"),
            ("数据与工具", "Excel · SQL · MES · 仓库管理 · Python"),
        ],
        "h_lang": "语言能力",
        "langs": [
            ("越南语", "母语"),
            ("中文 — HSK 4+", "可参加会议、处理文件，与中方管理层双向传达工作要求"),
            ("英语", "阅读工作及技术资料"),
        ],
        "h_edu": "教育背景",
        "edu": ("胡志明市师范技术大学", "工业电子技术", "2019 年 9 月毕业"),
        "h_other": "个人项目",
        "other": "正在开发 AI 驱动的 3D 设计自动化工具（AI Agent 通过 MCP 连接 SketchUp）。详情：phandinh.site",
    },

    "en": {
        "file": "PhanCu_CV_EN.pdf",
        "name": "PHAN DINH CU",
        "title": "Production Supervisor · Deputy Production Manager",
        "location": "Open to relocation",
        "facts": [("2.5 yrs", "in production"), ("~1,500", "units / month"), ("3 workshops", "~250 staff"), ("HSK 4+", "Chinese")],
        "h_summary": "SUMMARY",
        "summary": "Runs production planning and control at a Chinese-managed smart-locker plant: order-based plans, progress "
                   "across metal, paint and assembly workshops, reporting directly to the Factory Manager. Works in Chinese daily "
                   "with Chinese management. Built the plant's MES and warehouse system for real-time production data.",
        "h_exp": "EXPERIENCE",
        "jobs": [
            {
                "company": "WEBOX VIETNAM",
                "role": "Assistant to the Factory Manager — Production Management",
                "period": "04/2024 – present",
                "meta": "Smart lockers and OEM cabinet components · ~250 people · 3 workshops · Vietnamese–Chinese plant",
                "groups": [
                    ("Planning & progress", [
                        "Build order-based production plans and control progress across metal → paint → assembly → shipping for ~10 orders "
                        "and ~1,500 smart lockers a month, alongside OEM component orders.",
                        "Coordinate daily work through three workshop supervisors; resolve issues on the spot and escalate when needed.",
                        "Follow orders through to delivery; report production status to the Factory Manager and management.",
                    ]),
                    ("Process & people", [
                        "Standardised forms, SOPs and production data recording; apply 5S and Kaizen within the plant's ISO 9001 system.",
                        "Train new operators; coach mid-level supervisors on planning, progress tracking, issue handling and reporting.",
                        "Resolve cross-functional issues with Warehouse, HR, Quality and IT; relay requirements in Vietnamese and Chinese.",
                    ]),
                    ("Digitalising production management", [
                        "Built the internal MES: plan and progress of all three workshops on one screen, not a day-late manual report.",
                        "Designed the semi-finished warehouse system for 1,100+ codes (of 5,000+): real-time stock and location.",
                        "Digitalised attendance and output reconciliation by team — no more one-person manual Excel work.",
                        "Run the plant's IT infrastructure: PCs, LAN, printers, cameras, server.",
                    ]),
                ],
            },
            {
                "company": "SELF-EMPLOYED",
                "role": "Owner — computer & laptop sales and repair shop",
                "period": "2019 – 2024",
                "meta": "Started my own business after graduating: sourcing and selling computers and laptops, plus repair service.",
                "groups": [],
            },
        ],
        "h_skills": "SKILLS",
        "skills": [
            ("Production management", "Production planning · Progress control · Order management · Workshop coordination · Reporting · Training"),
            ("Improvement & quality", "5S · Kaizen · SOP · ISO 9001 · Root-cause analysis"),
            ("Data & tools", "Excel · SQL · MES · Warehouse control · Python"),
        ],
        "h_lang": "LANGUAGES",
        "langs": [
            ("Vietnamese", "native"),
            ("Chinese — HSK 4+", "meetings, documents and two-way interpreting with Chinese management"),
            ("English", "work and technical reading"),
        ],
        "h_edu": "EDUCATION",
        "edu": ("Ho Chi Minh City University of Technology and Education", "Industrial Electronics Engineering", "Graduated 09/2019"),
        "h_other": "PERSONAL PROJECT",
        "other": "In progress: AI-driven 3D design automation (AI agent ↔ SketchUp via MCP). Details: phandinh.site",
    },
}
