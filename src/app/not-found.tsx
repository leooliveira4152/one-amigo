import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { LogoIcon } from "@/components/Logo";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Box className="flex flex-col justify-center text-center h-full">
      <LogoIcon width={400} height={400} className="mb-10" />
      <Typography variant="h6">{t("message")}</Typography>
      <Link className="mt-3" href="/">
        <Typography variant="h5" className="font-bold text-secondary-light">
          {t("home")}
        </Typography>
      </Link>
    </Box>
  );
}
