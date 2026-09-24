import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "../Button";

// Mock matchMedia for Button component
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Button component", () => {
  it("renders a link when enabled", () => {
    render(<Button href="/test">Click me</Button>);
    const linkElement = screen.getByRole("link", { name: /click me/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/test");
  });

  it("renders a disabled button when disabled prop is true", () => {
    render(
      <Button href="/test" disabled>
        Disabled
      </Button>,
    );
    const buttonElement = screen.getByRole("button", { name: /disabled/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveAttribute("aria-disabled", "true");
  });

  it("renders a disabled button when href is missing", () => {
    // @ts-ignore
    render(<Button>No href</Button>);
    const buttonElement = screen.getByRole("button", { name: /no href/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
  });
});
