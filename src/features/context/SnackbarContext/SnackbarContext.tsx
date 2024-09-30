import { Alert, Snackbar, SnackbarProps } from "@mui/material";
import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";

export enum SnackbarIds {
  ROOT = "Snackbar-root",
  TITLE = "Snackbar-title",
  CONTENT = "Snackbar-content",
}

type SeverityType = ComponentProps<typeof Alert>["severity"];
type OpenSnackbarProps = {
  content: ReactNode;
  severity: SeverityType;
} & Omit<Partial<SnackbarProps>, "content">;

type SnackbarContextType = {
  openSnackbar: (props: OpenSnackbarProps) => void;
  closeSnackbar: () => void;
};

const defaultValues = { openSnackbar: () => {}, closeSnackbar: () => {} };
const SnackbarContext = createContext<SnackbarContextType>(defaultValues);

// TODO - create Missing unit test

export const SnackbarProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(undefined);
  const [severity, setSeverity] = useState<SeverityType>(undefined);
  const [snackbarProps, setSnackbarProps] = useState<Partial<SnackbarProps>>({});

  return (
    <SnackbarContext.Provider value={{ closeSnackbar, openSnackbar }}>
      <Snackbar
        data-testid={SnackbarIds.ROOT}
        open={isOpen}
        onClose={closeSnackbar}
        TransitionProps={{ onExited: clearSnackbarContent }}
        message={content}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        {...snackbarProps}
      >
        <Alert onClose={closeSnackbar} severity={severity} variant="filled">
          {content}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );

  function openSnackbar({ content, severity, ...props }: OpenSnackbarProps) {
    setContent(content);
    setSeverity(severity);
    setSnackbarProps(props);
    setIsOpen(true);
  }

  function closeSnackbar() {
    setIsOpen(false);
  }

  function clearSnackbarContent() {
    setSeverity(undefined);
    setContent(undefined);
  }
};

export const useSnackbarContext = () => {
  return useContext(SnackbarContext);
};
