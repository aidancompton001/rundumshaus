"use client";

import { useEffect } from "react";
import { getHref } from "@/lib/getImageUrl";

export default function RedirectClient() {
  useEffect(() => {
    window.location.replace(getHref("/leistungen/"));
  }, []);

  return (
    <section className="py-32 px-4 text-center min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md">
        <h1 className="font-heading text-3xl text-charcoal mb-4">
          Diese Seite wurde verschoben
        </h1>
        <p className="text-charcoal-light mb-8">
          Unsere Leistungen finden Sie jetzt unter &bdquo;Leistungen&ldquo;.
        </p>
        <a
          href={getHref("/leistungen/")}
          className="inline-block bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg font-body font-semibold transition-colors"
        >
          Zu unseren Leistungen
        </a>
      </div>
    </section>
  );
}
