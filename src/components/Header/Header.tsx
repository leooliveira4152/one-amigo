"use client";

import { Button, Grid } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps } from "react";

import { useLogout, useSignInWithGooglePopup } from "@/features/firebase/auth";
import { useUserStore } from "@/features/store/user";

import { LogoIcon, LogoText } from "../Logo";

export enum HeaderIds {
  ROOT = "header-root",
  HOME = "header-home",
  CHARACTER = "header-character",
  LOGIN = "header-login",
  LOGOUT = "header-logout",
}

export function Header() {
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
    <Grid
      container
      data-testid={HeaderIds.ROOT}
      alignItems="center"
      justifyContent="space-between"
      className="flex h-16 px-2 border-gray-100 border-b-2">
      <Grid item display="flex">
        <Button
          data-testid={HeaderIds.HOME}
          disableRipple
          className="!bg-transparent"
          onClick={() => router.push("/")}>
          <LogoIcon className="pl-1 h-12" />
          <LogoText className="pl-2 h-8" />
        </Button>
      </Grid>
      <Grid item>
        <Button
          data-testid={HeaderIds.CHARACTER}
          onClick={() => router.push("/character")}
          {...commonButtonProps}>
          Personagem
        </Button>
        {currentUser ? (
          <Button
            data-testid={HeaderIds.LOGOUT}
            onClick={logout}
            {...commonButtonProps}>
            Logout
          </Button>
        ) : (
          <Button
            data-testid={HeaderIds.LOGIN}
            onClick={signInWithGooglePopup}
            {...commonButtonProps}>
            Login
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
