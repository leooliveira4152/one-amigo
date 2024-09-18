import { Dialog, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";

export enum DialogIds {
  ROOT = "dialog-root",
  TITLE = "dialog-title",
  CONTENT = "dialog-content",
}

type OpenDialogProps = {
  content: ReactNode;
} & Omit<Partial<DialogProps>, "content">;

type DialogContextType = {
  openDialog: (props: OpenDialogProps) => void;
  closeDialog: () => void;
};

const defaultValues = { openDialog: () => {}, closeDialog: () => {} };
const DialogContext = createContext<DialogContextType>(defaultValues);

// TODO - create Missing unit test

export const DialogProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<ReactNode>(undefined);
  const [content, setContent] = useState<ReactNode>(undefined);
  const [dialogProps, setDialogProps] = useState<Partial<DialogProps>>({});

  return (
    <DialogContext.Provider value={{ closeDialog, openDialog }}>
      <Dialog
        data-testid={DialogIds.ROOT}
        open={isOpen}
        onClose={closeDialog}
        TransitionProps={{ onExited: clearDialogContent }}
        {...dialogProps}>
        {title && (
          <DialogTitle data-testid={DialogIds.TITLE}>{title}</DialogTitle>
        )}
        <DialogContent data-testid={DialogIds.CONTENT}>{content}</DialogContent>
      </Dialog>
      {children}
    </DialogContext.Provider>
  );

  function openDialog({ content, title, ...props }: OpenDialogProps) {
    setContent(content);
    setTitle(title);
    setDialogProps(props);
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
  }

  function clearDialogContent() {
    setTitle(undefined);
    setContent(undefined);
  }
};

export const useDialogContext = () => {
  return useContext(DialogContext);
};
