/**
 * Trạng thái phát triển — phân biệt rõ, không trình bày ý tưởng như thành tích đã xong.
 * - completed: đã triển khai và đang dùng thực tế
 * - inProgress: đang phát triển / nghiên cứu, kết quả chưa phải bản cuối
 * - planned: mới ở mức nghiên cứu, định hướng — chưa triển khai
 */
export const PROJECT_STATUSES = ["completed", "inProgress", "planned"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Project = {
  slug: string;
  no: string;
  status: ProjectStatus;
  /** Dự án nổi bật: card rộng toàn hàng, đứng đầu danh sách */
  featured?: boolean;
  tech: string[];
  scope: string[];
  /** Sơ đồ quy trình / kiến trúc — dùng làm hình minh hoạ khi chưa có ảnh thực tế */
  flow: string[];
  /** Ảnh chụp thực tế. Để trống = không tự bịa ảnh, UI hiện sơ đồ kèm ghi chú. */
  images: { src: string; width: number; height: number }[];
};

/** Dữ liệu không phụ thuộc ngôn ngữ. Chữ hiển thị ở messages/*.json → projects.items.<slug> */
export const projects: Project[] = [
  {
    slug: "mes",
    no: "01",
    status: "completed",
    featured: true,
    tech: ["Node.js", "SQL / SQLite", "Windows Server", "Nginx", "LAN"],
    scope: [
      "Production Planning",
      "Order Management",
      "Production Monitoring",
      "Live Monitor",
      "Warehouse",
      "Attendance",
      "Document Management",
      "User Permissions",
      "System Log",
    ],
    flow: ["Order", "Plan", "Production", "Warehouse", "Shipping"],
    images: [
      { src: "/projects/mes-dashboard.webp", width: 1600, height: 885 },
      { src: "/projects/warehouse-inventory.webp", width: 1600, height: 836 },
      { src: "/projects/document-management.webp", width: 1600, height: 763 },
    ],
  },
  {
    slug: "digital",
    no: "02",
    status: "completed",
    tech: ["Python", "Flask", "Pandas", "Excel", "Windows Service"],
    scope: [
      "Excel Intake",
      "Shift & Exception Rules",
      "Attendance Check",
      "Output by Team",
      "Report Export",
    ],
    flow: ["Excel", "Rules", "Check", "Report"],
    images: [
      { src: "/projects/production-data.webp", width: 1489, height: 917 },
      { src: "/projects/attendance-check.webp", width: 1600, height: 785 },
    ],
  },
  {
    slug: "itsys",
    no: "03",
    status: "completed",
    tech: ["Windows Server", "LAN / IP", "Nginx", "SMB", "Batch"],
    scope: [
      "Server Administration",
      "Internal Network",
      "PCs · Printers · Cameras",
      "Shared Systems",
      "Internal Web Systems",
      "Troubleshooting Toolkit",
    ],
    flow: ["Server", "LAN", "Shared Systems", "Toolkit"],
    images: [
      { src: "/projects/it-toolkit.webp", width: 1600, height: 858 },
      { src: "/projects/company-website.webp", width: 1600, height: 832 },
    ],
  },
  {
    slug: "sketchup-mcp",
    no: "04",
    status: "inProgress",
    tech: ["AI Agent", "MCP Server", "SketchUp Extension", "SketchUp Ruby API"],
    scope: [
      "Agent-to-MCP Bridge",
      "Reusable Design Rules",
      "Automated Modeling",
      "Design Data Processing",
      "3D View Capture",
    ],
    flow: ["AI Agent", "MCP Server", "SketchUp Extension", "SketchUp Ruby API"],
    images: [],
  },
  {
    slug: "software-qa",
    no: "05",
    status: "inProgress",
    tech: [
      "Module Architecture",
      "Code Audit",
      "Reusable Rules",
      "Functional Testing",
    ],
    scope: [
      "Module & Terminology Standards",
      "Pre-change Code Audit",
      "Reusable Rules",
      "Functional Testing",
      "Deployment Reports",
    ],
    flow: ["Audit", "Standardize", "Build", "Test", "Report"],
    images: [],
  },
  {
    slug: "ai-architecture",
    no: "06",
    status: "inProgress",
    tech: ["SketchUp", "AI Rendering", "AI Video", "3D View Management"],
    scope: [
      "Japanese-roof Single-storey House",
      "Material & Color Standards",
      "Lighting",
      "Interior / Exterior Views",
      "Render & Video Workflow",
    ],
    flow: ["Design Rules", "Materials · Light", "Render", "Video"],
    images: [],
  },
  {
    slug: "web-3d",
    no: "07",
    status: "planned",
    tech: ["GLB (glTF 2.0)", "Web Browser"],
    scope: [
      "Orbit & Rotate",
      "Interior Walkthrough",
      "Material Preview",
      "View-only Access",
      "Low-cost Hosting",
    ],
    flow: ["SketchUp Model", "GLB", "Web Link", "View-only"],
    images: [],
  },
];
