"use client";

// TODO - This is a placeholder component

import { useUserStore } from "@/features/store/user";
import { useRouter } from "next/navigation";

export function Welcome() {
  const router = useRouter();
  const {
    currentUser,
    spectator: { isSpectator },
  } = useUserStore();

  console.log(currentUser);
  return <>Bem-vindo, {getDisplayName()}.</>;

  function getDisplayName() {
    if (currentUser && currentUser?.displayName) return currentUser.displayName;
    else if (isSpectator) return "espectador";
    router.replace("/login");
  }
}
