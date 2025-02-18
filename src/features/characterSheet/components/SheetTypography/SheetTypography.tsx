import { Typography } from "@mui/material";
import { ComponentProps } from "react";

type SheetTypographyProps = { variant?: "primary" | "secondary" } & Omit<
  ComponentProps<typeof Typography>,
  "variant"
>;

export function SheetTypography({
  className,
  children,
  variant = "primary",
  ...props
}: SheetTypographyProps) {
  const fontColor = variant === "primary" ? "text-primary-50" : "text-primary-900";

  return (
    <Typography className={`font-alegreya ${fontColor} ${className}`} {...props}>
      {children}
    </Typography>
  );
}
