import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/features/store/user";

import { createUser } from "../../firestore";
import { auth } from "../auth";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const useSignInWithGooglePopup = () => {
  const router = useRouter();
  const { setIsSpectator } = useUserStore();

  const signInWithGooglePopup = async () => {
    const loggedUser = await signInWithPopup(auth, provider);
    await createUser(loggedUser.user);
    setIsSpectator(false);
    router.push("/");
  };

  return { signInWithGooglePopup };
};
