import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import CookieBanner from "@/components/layout/CookieBanner";

const STORAGE_KEY = "rh-cookie-consent";

describe("CookieBanner", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows banner after delay when no consent in localStorage", async () => {
    render(<CookieBanner />);
    // Banner not visible immediately
    expect(screen.queryByText(/Diese Website verwendet/)).not.toBeInTheDocument();

    // Advance past delay
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/Diese Website verwendet/)).toBeInTheDocument();
    expect(screen.getByText("Verstanden")).toBeInTheDocument();
    expect(screen.getByText("Datenschutzerklärung")).toHaveAttribute("href", "/datenschutz");
  });

  it("does not show banner when consent already given", async () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    render(<CookieBanner />);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText(/Diese Website verwendet/)).not.toBeInTheDocument();
  });

  it("hides banner and saves to localStorage on click", async () => {
    render(<CookieBanner />);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Verstanden")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Verstanden"));

    expect(localStorage.getItem(STORAGE_KEY)).toBe("accepted");
    expect(screen.queryByText("Verstanden")).not.toBeInTheDocument();
  });
});
