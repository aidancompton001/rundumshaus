import type { FC } from "react";

export interface IconProps {
  className?: string;
  variant?: "default" | "light" | "mono";
}

export type IconComponent = FC<IconProps>;
