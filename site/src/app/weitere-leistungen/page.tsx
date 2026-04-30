import type { Metadata } from "next";
import RedirectClient from "./RedirectClient";

export const metadata: Metadata = {
  title: "Weitergeleitet",
  robots: { index: false, follow: false },
};

export default function WeitereLeistungenPage() {
  return <RedirectClient />;
}
