import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/features/store/user";

import { auth } from "../auth";

export function useLogout() {
  const router = useRouter();
  const { setCurrentUser } = useUserStore();

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    router.replace("/login");
  };

  return { logout };
}
