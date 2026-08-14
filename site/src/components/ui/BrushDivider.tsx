import { getHref } from "@/lib/getImageUrl";

/**
 * Волна-разделитель макета (docs/design/v1-desktop/css/style.css, `.brush-divider`):
 * белый мазок кистью на стыке тёмной секции и светлой. Ставится ВНУТРИ
 * тёмной секции, у её нижнего края; родителю нужен `relative`.
 *
 * Файл взят из макета как есть: `assets/img/brush-divider.svg`.
 */
export default function BrushDivider() {
  return (
    <div
      className="brush-divider absolute -bottom-px left-0 w-full z-[3] pointer-events-none leading-[0]"
      aria-hidden="true"
    >
      <img
        src={getHref("/images/brush-divider.svg")}
        alt=""
        width={1440}
        height={64}
        className="block w-full max-w-full h-[34px] md:h-[52px] xl:h-16 object-fill"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
