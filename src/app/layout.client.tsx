"use client";

import { Dialog } from "@/components/Dialog";
import { Footer } from "@/components/Footer";
import { auth } from "@/features/firebase/auth/auth";
import { AppStore, makeStore } from "@/features/store";
import { useUserStore } from "@/features/store/user";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { deepPurple, pink } from "@mui/material/colors";
import { User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { Provider } from "react-redux";

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

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user)
        setCurrentUser(user.toJSON() as User); // probably not the best approach
      else if (!user && pathname !== "/login" && !isSpectator)
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
      <body className="flex flex-col h-screen ">
        <CssBaseline />
        <div className="flex flex-col flex-1 items-center justify-between p-24">
          {enableRender && (
            <>
              <Dialog />
              {children}
            </>
          )}
        </div>
        <Footer />
      </body>
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
