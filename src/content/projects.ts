export type Project = {
  slug: string;
  no: string;
  size: "lead" | "half";
  tech: string[];
  scope: string[];
  images: { src: string; width: number; height: number }[];
};

/** Dữ liệu không phụ thuộc ngôn ngữ. Chữ hiển thị ở messages/*.json → projects.items.<slug> */
export const projects: Project[] = [
  {
    slug: "mes",
    no: "01",
    size: "lead",
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
    images: [
      { src: "/projects/mes-dashboard.webp", width: 1600, height: 885 },
      { src: "/projects/warehouse-inventory.webp", width: 1600, height: 836 },
      { src: "/projects/document-management.webp", width: 1600, height: 763 },
    ],
  },
  {
    slug: "digital",
    no: "02",
    size: "half",
    tech: ["Python", "Flask", "Pandas", "Excel", "Windows Service"],
    scope: [
      "Excel Intake",
      "Shift & Exception Rules",
      "Attendance Check",
      "Output by Team",
      "Report Export",
    ],
    images: [
      { src: "/projects/production-data.webp", width: 1489, height: 917 },
      { src: "/projects/attendance-check.webp", width: 1600, height: 785 },
    ],
  },
  {
    slug: "itsys",
    no: "03",
    size: "half",
    tech: ["Windows Server", "LAN / IP", "Nginx", "SMB", "Batch"],
    scope: [
      "Server Administration",
      "Internal Network",
      "Internal Web Systems",
      "Troubleshooting Toolkit",
    ],
    images: [
      { src: "/projects/it-toolkit.webp", width: 1600, height: 858 },
      { src: "/projects/company-website.webp", width: 1600, height: 832 },
    ],
  },
];
