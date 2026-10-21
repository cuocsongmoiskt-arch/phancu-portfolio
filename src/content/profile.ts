/**
 * Dữ liệu tách khỏi UI. Nội dung đa ngôn ngữ nằm ở /messages/*.json.
 * File này chỉ giữ dữ liệu không phụ thuộc ngôn ngữ + placeholder cần bổ sung.
 */
export const profile = {
  name: "PHAN ĐÌNH CỰ",
  // Để trống = UI tự ẩn hoặc hiện trạng thái chưa có, không tự bịa
  email: "Phancu.edu@gmail.com",
  phone: "0888523894",
  linkedin: "https://www.linkedin.com/in/phandinhcu",
  github: "",
  cvUrl: "/cv/PhanCu_CV.pdf", // bản tiếng Việt — giữ đường dẫn cũ cho các hồ sơ đã gửi
  zalo: "0888523894", // Zalo dùng chung số điện thoại
  workSince: "04/2024 – nay",
  siteUrl: "https://phandinh.site",
  googleSiteVerification: "-EDviO5XMCcUu54Azqy80GhiQVjSAYzwepN6XrlkNBQ",
} as const;

// Tên hiển thị theo ngôn ngữ — riêng bản Trung dùng đúng tên phiên âm chữ Hán (潘廷巨),
// không phải phiên âm máy dịch. vi/en giữ cùng nội dung (có/không dấu là khác biệt duy nhất).
// CV đúng ngôn ngữ đang xem — mỗi bản 1 trang, tạo bằng tools/build_cv.py
export const cvByLocale = {
  vi: "/cv/PhanCu_CV_VI.pdf",
  en: "/cv/PhanCu_CV_EN.pdf",
  zh: "/cv/PhanCu_CV_ZH.pdf",
} as const;

export const nameByLocale = {
  vi: profile.name,
  en: "PHAN DINH CU",
  zh: "潘廷巨",
} as const;
