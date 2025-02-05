import { User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { auth } from "@/features/firebase/auth/auth";
import { readUser } from "@/features/firebase/firestore";
import { useUserStore } from "@/features/store/user";

// No way to lazy load a hook in an optimal way
// Lazy load is required to wait for firebase to initialize
export function AccountManagement() {
  const pathname = usePathname();
  const router = useRouter();
  const { localStorageSpectatorKey, setIsSpectator, setCurrentUser } = useUserStore();

  useEffect(() => {
    const isSpectator = Boolean(localStorage.getItem(localStorageSpectatorKey));
    setIsSpectator(isSpectator);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // TODO - probably not the best approach
      if (user && user.email) {
        const userDoc = await readUser(user.email);
        setCurrentUser((userDoc?.data() ?? user.toJSON()) as User);
      } else if (!user && pathname !== "/login" && !isSpectator) router.replace("/login");
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
