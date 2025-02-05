import { Box, Divider, Typography } from "@mui/material";
import { ReactNode } from "react";

type SheetBottomLayoutProps = {
  visible?: boolean;
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function SheetBottomLayout({
  visible = true,
  children,
  title,
  subtitle,
}: SheetBottomLayoutProps) {
  if (!visible) return <></>;
  return (
    <Box className="mt-4 p-2">
      <Box className="flex">
        <Typography className="font-alegreya">{title}</Typography>
        {subtitle && <Typography className="font-alegreya">{`- ${subtitle}`}</Typography>}
      </Box>
      <Divider className="my-2" />
      {children}
    </Box>
  );
}
