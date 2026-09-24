import Link from "next/link";
import "@/styles/globals.css";
import { profile } from "@/content/profile";

/** Fallback 404 ngoài phạm vi middleware [locale] — không có context ngôn ngữ nên giữ tối giản, 3 thứ tiếng tĩnh. */
export default function RootNotFound() {
  return (
    <html lang="vi">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 640, margin: "18vh auto", padding: "0 24px" }}>
          <p
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#3F6A5B",
              margin: 0,
            }}
          >
            404
          </p>
          <p style={{ fontSize: 18, color: "#5E6B75" }}>
            Không tìm thấy trang / 未找到页面 / Page not found
          </p>
          <Link href="/vi" style={{ color: "#1E2A33" }}>
            → {profile.siteUrl.replace(/^https?:\/\//, "")}
          </Link>
        </div>
      </body>
    </html>
  );
}
