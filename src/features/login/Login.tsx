"use client";

import { Box } from "@mui/material";
import { useLogout, useSignInWithGooglePopup } from "../firebase/auth";
import { useUserStore } from "../store/user";
import { useRouter } from "next/navigation";
import { LoginButton } from "./LoginButton";
import { useDialogStore } from "../store/dialog";
import { Logo } from "@/components/Logo";

export enum LoginTestIds {
  ROOT = "login-root",
  LOGO = "login-logo",
  BUTTON_CONTAINER = "login-button-container",
  LOGIN_BUTTON = "login-login-button",
  SPECTATOR_BUTTON = "login-spectator-button",
}

export function Login() {
  const router = useRouter();
  const { openDialog } = useDialogStore();
  const { setIsSpectator } = useUserStore();
  const { signInWithGooglePopup } = useSignInWithGooglePopup();
  const { logout } = useLogout();

  return (
    <Box
      data-testid={LoginTestIds.ROOT}
      className="flex flex-col h-full justify-evenly w-7/12">
      <Logo
        data-testid={LoginTestIds.LOGO}
        className="w-9/12 max-w-md self-center"
      />
      <Box
        data-testid={LoginTestIds.BUTTON_CONTAINER}
        className="flex flex-col h-32 items-center justify-evenly">
        <LoginButton
          data-testid={LoginTestIds.LOGIN_BUTTON}
          onClick={logGoogleUser}>
          Login
        </LoginButton>
        <LoginButton
          data-testid={LoginTestIds.SPECTATOR_BUTTON}
          onClick={logAsSpectator}>
          Entrar como espectador
        </LoginButton>
      </Box>
    </Box>
  );

  async function logGoogleUser() {
    try {
      await signInWithGooglePopup();
    } catch {
      openDialog({
        content: "Ops, houve um problema para fazer o login. Tente novamente!",
      });
      logout();
    }
  }

  function logAsSpectator() {
    setIsSpectator(true);
    homeRedirect();
  }

  function homeRedirect() {
    router.push("/");
  }
}
