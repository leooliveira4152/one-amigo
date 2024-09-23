"use client";

import { Button, Grid2 } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps } from "react";

import { useLogout, useSignInWithGooglePopup } from "@/features/firebase/auth";
import { useUserStore } from "@/features/store/user";

import { LogoIcon, LogoText } from "../Logo";

export enum PageHeaderIds {
  ROOT = "header-root",
  HOME = "header-home",
  CHARACTER = "header-character",
  LOGIN = "header-login",
  LOGOUT = "header-logout",
}

export function PageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogout();
  const { signInWithGooglePopup } = useSignInWithGooglePopup();
  const {
    currentUser,
    spectator: { isSpectator },
  } = useUserStore();

  if (pathname === "/login" || (!currentUser && !isSpectator)) return null;

  const commonButtonProps: Partial<ComponentProps<typeof Button>> = {
    variant: "contained",
    className: "w-32 h-9 mx-1 !rounded-full",
  };

  return (
    <Grid2
      container
      data-testid={PageHeaderIds.ROOT}
      alignItems="center"
      justifyContent="space-between"
      className="flex h-16 px-2 border-gray-100 border-b-2"
    >
      <Grid2 display="flex">
        <Button
          data-testid={PageHeaderIds.HOME}
          disableRipple
          className="!bg-transparent"
          onClick={() => router.push("/")}
        >
          <LogoIcon className="pl-1 h-12" />
          <LogoText className="pl-2 h-8" />
        </Button>
      </Grid2>
      <Grid2>
        <Button
          data-testid={PageHeaderIds.CHARACTER}
          onClick={() => router.push("/character")}
          {...commonButtonProps}
        >
          Personagem
        </Button>
        {currentUser ? (
          <Button
            data-testid={PageHeaderIds.LOGOUT}
            onClick={logout}
            {...commonButtonProps}
          >
            Logout
          </Button>
        ) : (
          <Button
            data-testid={PageHeaderIds.LOGIN}
            onClick={signInWithGooglePopup}
            {...commonButtonProps}
          >
            Login
          </Button>
        )}
      </Grid2>
    </Grid2>
  );
}
