"use client";

// eslint-disable-next-line import/order
import { firebaseConfig } from "@/features/firebase/client";
initializeApp(firebaseConfig);

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { deepPurple, pink } from "@mui/material/colors";
import { initializeApp } from "firebase/app";
import { User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { Provider } from "react-redux";

import { Footer } from "@/components/Footer";
import { DialogProvider } from "@/features/context/DialogContext";
import { DrawerProvider } from "@/features/context/DrawerContext";
import { auth } from "@/features/firebase/auth/auth";
import { readUser } from "@/features/firebase/firestore/manageUserDoc";
import { AppStore, makeStore } from "@/features/store";
import { useUserStore } from "@/features/store/user";

export function LayoutWrapper({ children }: PropsWithChildren) {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: deepPurple,
      secondary: pink,
    },
  });

  const {
    spectator: { isSpectator },
    setIsSpectator,
    localStorageSpectatorKey,
    currentUser,
    setCurrentUser,
  } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isSpectator = Boolean(localStorage.getItem(localStorageSpectatorKey));
    setIsSpectator(isSpectator);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // TODO - probably not the best approach
      if (user && user.email) {
        const userDoc = await readUser(user.email);
        setCurrentUser((userDoc?.data() ?? user.toJSON()) as User);
      } else if (!user && pathname !== "/login" && !isSpectator)
        router.replace("/login");
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enableRender = useMemo(() => {
    if (pathname === "/login" || currentUser || isSpectator) return true;
    return false;
  }, [isSpectator, pathname, currentUser]);

  return (
    <ThemeProvider theme={theme}>
      <DrawerProvider>
        <DialogProvider>
          <body className="flex flex-col h-dvh">
            <CssBaseline />
            <div className="flex flex-col flex-1 items-center justify-between p-2 h-full sm:p-12">
              {enableRender && children}
            </div>
            <Footer />
          </body>
        </DialogProvider>
      </DrawerProvider>
    </ThemeProvider>
  );
}

export function ContextWrapper({ children }: PropsWithChildren) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      <LayoutWrapper>{children}</LayoutWrapper>
    </Provider>
  );
}
