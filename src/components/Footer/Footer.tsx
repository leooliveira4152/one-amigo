"use client";

import { Box, Button } from "@mui/material";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

import { useLogout, useSignInWithGooglePopup } from "@/features/firebase/auth";
import { useUserStore } from "@/features/store/user";

export enum FooterIds {
  ROOT = "footer-root",
  LOGIN = "footer-login",
  LOGOUT = "footer-logout",
}

export function Footer() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const { signInWithGooglePopup } = useSignInWithGooglePopup();
  const {
    currentUser,
    spectator: { isSpectator },
  } = useUserStore();

  if (pathname === "/login" || (!currentUser && !isSpectator)) return null;

  return (
    <Box
      data-testid={FooterIds.ROOT}
      className="flex h-16 px-6 border-gray-100 border-t-2 items-center justify-end">
      {currentUser ? (
        <Button
          data-testid={FooterIds.LOGOUT}
          onClick={logout}
          {...getCommonButtonProps()}>
          Logout
        </Button>
      ) : (
        <Button
          data-testid={FooterIds.LOGIN}
          onClick={signInWithGooglePopup}
          {...getCommonButtonProps()}>
          Login
        </Button>
      )}
    </Box>
  );

  function getCommonButtonProps() {
    return {
      variant: "contained",
      className: "w-32 h-9 !rounded-full",
    } as Partial<ComponentProps<typeof Button>>;
  }
}
