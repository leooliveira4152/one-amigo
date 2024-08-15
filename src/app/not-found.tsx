import { Box } from "@mui/material";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export default function NotFound() {
  return (
    <Box className="flex flex-col justify-center text-center h-full">
      <img
        alt="logo-icon"
        src={"/logo-icon.png"}
        width={500}
        height={500}
        className="w-8/12 max-w-md self-center"
      />
      Como você veio parar aqui?
      <Link className="mt-3 font-bold text-secondary-light" href="/">
        Tela inicial
      </Link>
    </Box>
  );
}
