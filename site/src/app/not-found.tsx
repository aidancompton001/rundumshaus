import { getHref } from "@/lib/getImageUrl";

export default function NotFound() {
  return (
    <section className="flex-1 flex items-center justify-center py-24 px-4">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-charcoal mb-4">
          404
        </h1>
        <p className="text-charcoal-light text-lg mb-8">
          Seite nicht gefunden
        </p>
        <a
          href={getHref("/")}
          className="bg-copper hover:bg-copper-light text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Zur Startseite
        </a>
      </div>
    </section>
  );
}
