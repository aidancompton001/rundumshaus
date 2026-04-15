interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export default function Card({
  children,
  hover = true,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        backdrop-blur-2xl bg-white/5 border border-white/[0.08] rounded-2xl p-6
        ${hover ? "transition-shadow duration-300 hover:shadow-xl" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
