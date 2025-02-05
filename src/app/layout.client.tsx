"use client";

// eslint-disable-next-line import/order
import { firebaseConfig } from "@/features/firebase/client";
initializeApp(firebaseConfig);

import {
  Box,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { deepPurple, pink } from "@mui/material/colors";
import { initializeApp } from "firebase/app";
import { usePathname } from "next/navigation";
import { lazy, PropsWithChildren, useMemo, useRef } from "react";
import { Provider } from "react-redux";

// import { PageHeader } from "@/components/PageHeader";
import { DialogProvider } from "@/features/context/DialogContext";
import { DrawerProvider } from "@/features/context/DrawerContext";
import { SnackbarProvider } from "@/features/context/SnackbarContext";
import { AppStore, makeStore } from "@/features/store";
import { useUserStore } from "@/features/store/user";

// TODO - use Typography more (https://mui.com/material-ui/react-typography/)
// TODO - use sx more (https://mui.com/system/getting-started/usage/)
// TODO - change every tailwind workaround to style

// Lazy loading these component keeps firebase from being called without being fully initialized
const PageHeader = lazy(() =>
  import("@/components/PageHeader").then((imports) => ({ default: imports.PageHeader }))
);
const AccountManagement = lazy(() =>
  import("./accountManagement").then((imports) => ({
    default: imports.AccountManagement,
  }))
);

export function LayoutWrapper({ children }: PropsWithChildren) {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: deepPurple,
      secondary: pink,
    },
    typography: {},
  });

  const {
    spectator: { isSpectator },
    currentUser,
  } = useUserStore();
  const pathname = usePathname();

  const enableRender = useMemo(() => {
    if (pathname === "/login" || currentUser || isSpectator) return true;
    return false;
  }, [isSpectator, pathname, currentUser]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <DrawerProvider>
          <DialogProvider>
            <body className="flex flex-col h-dvh max-h-dvh overflow-hidden">
              <SnackbarProvider>
                <CssBaseline />
                <AccountManagement />
                <PageHeader />
                <Box
                  className="flex flex-col flex-1 items-center justify-between p-2 h-full sm:p-12 overflow-auto"
                  sx={{
                    "&::-webkit-scrollbar": { width: "0.5em" },
                    "&::-webkit-scrollbar-track": {
                      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: (theme) => `${theme.palette.primary.dark}B3`,
                      outline: "1px solid white",
                    },
                  }}
                >
                  {enableRender && children}
                </Box>
              </SnackbarProvider>
            </body>
          </DialogProvider>
        </DrawerProvider>
      </ThemeProvider>
    </StyledEngineProvider>
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
