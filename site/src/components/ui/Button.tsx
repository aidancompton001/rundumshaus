import { getHref } from "@/lib/getImageUrl";

type Variant = "primary" | "ghost" | "primary-dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-charcoal text-cream hover:bg-copper hover:text-white",
  ghost:
    "bg-transparent border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream",
  "primary-dark":
    "bg-copper text-white hover:bg-copper-light",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  className = "",
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-body font-semibold transition-colors duration-200";
  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <a href={getHref(href)} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
