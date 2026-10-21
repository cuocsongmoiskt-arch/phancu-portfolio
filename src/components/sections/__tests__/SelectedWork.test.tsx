import { render, screen, fireEvent, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, it, expect, vi, beforeAll } from "vitest";
import messages from "../../../../messages/vi.json";
import SelectedWork from "../SelectedWork";
import { projects } from "@/content/projects";

vi.mock("@/i18n/routing", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

beforeAll(() => {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IO,
  });
});

function renderWork() {
  return render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      <SelectedWork />
    </NextIntlClientProvider>,
  );
}

const cards = () => screen.getAllByRole("article");
const filterButton = (name: RegExp) =>
  within(screen.getByRole("group", { name: /lọc theo trạng thái/i })).getByRole(
    "button",
    { name },
  );

describe("SelectedWork", () => {
  it("hiển thị tất cả dự án, dự án nổi bật đứng đầu", () => {
    renderWork();
    expect(cards()).toHaveLength(projects.length);
    expect(
      within(cards()[0]).getByRole("heading", {
        name: "Manufacturing MES Platform",
      }),
    ).toBeInTheDocument();
    expect(within(cards()[0]).getByText("Dự án nổi bật")).toBeInTheDocument();
  });

  it("lọc theo trạng thái chỉ còn dự án đúng trạng thái", () => {
    renderWork();
    fireEvent.click(filterButton(/^Kế hoạch/));
    expect(cards()).toHaveLength(
      projects.filter((p) => p.status === "planned").length,
    );
    expect(
      screen.getByRole("heading", { name: "Browser-Based 3D Model Sharing" }),
    ).toBeInTheDocument();
    expect(filterButton(/^Kế hoạch/)).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(filterButton(/^Hoàn thành/));
    const done = cards();
    expect(done).toHaveLength(
      projects.filter((p) => p.status === "completed").length,
    );
    for (const card of done) {
      expect(card.querySelector('[data-status="completed"]')).not.toBeNull();
    }

    fireEvent.click(filterButton(/^Tất cả/));
    expect(cards()).toHaveLength(projects.length);
  });

  it("dự án Kế hoạch ghi 'Kết quả kỳ vọng', không ghi 'Kết quả'", () => {
    renderWork();
    fireEvent.click(filterButton(/^Kế hoạch/));
    const card = cards()[0];
    expect(within(card).getByText("Kết quả kỳ vọng")).toBeInTheDocument();
    expect(within(card).queryByText("Kết quả")).toBeNull();
  });

  it("card liên kết tới trang chi tiết dự án", () => {
    renderWork();
    const link = within(cards()[0]).getByRole("link", {
      name: /xem chi tiết/i,
    });
    expect(link).toHaveAttribute("href", "/projects/mes");
  });
});
