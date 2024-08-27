import { Button } from "@mui/material";
import { ComponentProps } from "react";

export function LoginButton(props: ComponentProps<typeof Button>) {
  return (
    <Button variant="contained" className="w-60 h-9 !rounded-full" {...props} />
  );
}
