import { describe, it, expect } from "vitest";
import vi from "../../../messages/vi.json";
import en from "../../../messages/en.json";
import zh from "../../../messages/zh.json";
import { existsSync } from "node:fs";
import path from "node:path";
import { projects, PROJECT_STATUSES } from "../projects";
import { cvByLocale, profile } from "../profile";

const locales = { vi, en, zh } as const;

/** Liệt kê mọi khoá lá dạng "a.b.c"; mảng tính là một lá kèm độ dài. */
function shape(obj: unknown, prefix = ""): string[] {
  if (Array.isArray(obj)) return [`${prefix}[${obj.length}]`];
  if (obj && typeof obj === "object") {
    return Object.entries(obj).flatMap(([k, v]) =>
      shape(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

describe("messages", () => {
  it("vi / en / zh có cùng khoá và cùng số phần tử mảng", () => {
    const base = shape(vi).sort();
    expect(shape(en).sort()).toEqual(base);
    expect(shape(zh).sort()).toEqual(base);
  });
});

describe("projects", () => {
  it("slug và số thứ tự không trùng, đánh số liên tục", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    projects.forEach((p, i) =>
      expect(p.no).toBe(String(i + 1).padStart(2, "0")),
    );
  });

  it("chỉ dùng ba trạng thái Completed / In Progress / Planned", () => {
    for (const p of projects) expect(PROJECT_STATUSES).toContain(p.status);
  });

  it("dự án nổi bật duy nhất là AI + MCP + SketchUp và đứng đầu", () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured.map((p) => p.slug)).toEqual(["sketchup-mcp"]);
    expect(projects[0].slug).toBe("sketchup-mcp");
  });

  it("dự án chưa có ảnh thực tế phải có sơ đồ quy trình để hiển thị", () => {
    for (const p of projects) {
      if (p.images.length === 0) expect(p.flow.length).toBeGreaterThan(1);
    }
  });

  it.each(Object.entries(locales))(
    "%s: mỗi dự án có đủ nội dung và nhãn cho mọi trạng thái",
    (_, m) => {
      const { items, labels, status, statusNote } = m.projects;
      for (const p of projects) {
        const item = items[p.slug as keyof typeof items] as {
          title: string;
          goal: string;
          highlights: string[];
          result: string;
          role: string;
        };
        expect(item, p.slug).toBeDefined();
        expect(item.title).toBeTruthy();
        expect(item.goal).toBeTruthy();
        expect(item.result).toBeTruthy();
        expect(item.role).toBeTruthy();
        expect(item.highlights.length).toBeGreaterThan(0);
      }
      expect(Object.keys(items).sort()).toEqual(
        projects.map((p) => p.slug).sort(),
      );
      for (const s of PROJECT_STATUSES) {
        expect(status[s]).toBeTruthy();
        expect(statusNote[s]).toBeTruthy();
        expect(labels.highlights[s]).toBeTruthy();
        expect(labels.result[s]).toBeTruthy();
      }
    },
  );
});

describe("cv", () => {
  it("mỗi ngôn ngữ có file CV riêng trong public/cv", () => {
    const pub = path.resolve(__dirname, "../../../public");
    expect(Object.keys(cvByLocale).sort()).toEqual(Object.keys(locales).sort());
    const merged = [
      "/cv/PhanDinhCu_CV_ProductionSupervisor_VI-ZH-EN.pdf",
      "/cv/PhanDinhCu_CV_ProductionSupervisor_ZH-VI.pdf",
    ];
    for (const url of [
      ...Object.values(cvByLocale),
      profile.cvUrl,
      ...merged,
    ]) {
      expect(existsSync(path.join(pub, url)), url).toBe(true);
    }
  });
});
