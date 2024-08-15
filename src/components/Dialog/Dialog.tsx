import React from "react";
import { Dialog as MuiDialog, DialogContent, DialogTitle } from "@mui/material";
import { useDialogStore } from "@/features/store/dialog";

export enum DialogIds {
  ROOT = "dialog-root",
  TITLE = "dialog-title",
  CONTENT = "dialog-content",
}

export function Dialog() {
  const {
    open,
    content: { title, content },
    closeDialog,
    clearDialogContent,
  } = useDialogStore();

  return (
    <MuiDialog
      data-testid={DialogIds.ROOT}
      open={open}
      onClose={closeDialog}
      TransitionProps={{ onExited: clearDialogContent }}>
      {title && (
        <DialogTitle data-testid={DialogIds.TITLE}>{title}</DialogTitle>
      )}
      <DialogContent data-testid={DialogIds.CONTENT}>{content}</DialogContent>
    </MuiDialog>
  );
}
