interface ContainerProps {
  children: React.ReactNode;
  as?: "div" | "section" | "article";
  className?: string;
}

export default function Container({
  children,
  as: Tag = "div",
  className = "",
}: ContainerProps) {
  return (
    <Tag className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
