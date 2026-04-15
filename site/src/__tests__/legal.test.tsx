import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("motion/react", () => ({
  motion: {
    span: (props: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => <span {...props} />,
    div: (props: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import ImpressumPage from "@/app/impressum/page";
import DatenschutzPage from "@/app/datenschutz/page";

describe("Impressum", () => {
  it("renders Kevin Littawe", () => {
    render(<ImpressumPage />);
    expect(screen.getByText(/Kevin Littawe/)).toBeInTheDocument();
  });

  it("renders company name", () => {
    render(<ImpressumPage />);
    expect(screen.getByText(/Rundum's Haus Littawe/)).toBeInTheDocument();
  });

  it("renders EU ODR link", () => {
    render(<ImpressumPage />);
    expect(
      screen.getByText("https://ec.europa.eu/consumers/odr/")
    ).toBeInTheDocument();
  });

  it("renders § 5 TMG", () => {
    render(<ImpressumPage />);
    expect(screen.getByText(/§ 5 TMG/)).toBeInTheDocument();
  });
});

describe("Datenschutz", () => {
  it("renders Art. 15 Auskunftsrecht", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/Art\. 15 — Auskunftsrecht/)).toBeInTheDocument();
  });

  it("renders Art. 16 Berichtigung", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/Art\. 16 — Recht auf Berichtigung/)).toBeInTheDocument();
  });

  it("renders Art. 17 Löschung", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/Art\. 17 — Recht auf Löschung/)).toBeInTheDocument();
  });

  it("renders Art. 18 Einschränkung", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/Art\. 18/)).toBeInTheDocument();
  });

  it("renders Art. 20 Datenübertragbarkeit", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/Art\. 20/)).toBeInTheDocument();
  });

  it("renders Art. 21 Widerspruch", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/Art\. 21/)).toBeInTheDocument();
  });

  it("renders Art. 77 Beschwerderecht", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/Art\. 77 DSGVO/)).toBeInTheDocument();
  });

  it("renders LDI NRW as supervisory authority", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/LDI NRW/)).toBeInTheDocument();
  });

  it("renders Google Fonts local notice", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/lokal.*gehostet/i)).toBeInTheDocument();
  });

  it("renders FormSubmit.co as processor", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/FormSubmit/)).toBeInTheDocument();
  });

  it("renders SSL encryption notice", () => {
    render(<DatenschutzPage />);
    const matches = screen.getAllByText(/SSL-Verschlüsselung/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders storage duration info", () => {
    render(<DatenschutzPage />);
    expect(screen.getByText(/Speicherdauer/)).toBeInTheDocument();
  });
});
