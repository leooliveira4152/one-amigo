import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

type LabelValueProps = { label: ReactNode; value: ReactNode };
export function LabelValue({ label, value }: LabelValueProps) {
  return (
    <Box className="mt-3" style={{ textTransform: "none" }}>
      <Typography style={{ fontSize: 14, fontWeight: 600 }}>{label}</Typography>
      <Typography style={{ fontSize: 14 }}>{value}</Typography>
    </Box>
  );
}
