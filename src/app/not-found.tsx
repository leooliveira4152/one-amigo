import { Box, Typography } from "@mui/material";
import Link from "next/link";

import { LogoIcon } from "@/components/Logo";

/* eslint-disable @next/next/no-img-element */
export default function NotFound() {
  return (
    <Box className="flex flex-col justify-center text-center h-full">
      <LogoIcon width={400} height={400} className="mb-10" />
      <Typography variant="h6">Como você veio parar aqui?</Typography>
      <Link className="mt-3" href="/">
        <Typography variant="h5" className="font-bold text-secondary-light">
          Tela inicial
        </Typography>
      </Link>
    </Box>
  );
}
