import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../store";
import { ReactNode } from "react";

type ContentType = { title?: ReactNode; content?: ReactNode };
type DialogState = { dialog: { open: boolean; content: ContentType } };

const initialState: DialogState = {
  dialog: { open: false, content: { title: undefined, content: undefined } },
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<ContentType>) => {
      state.dialog.open = true;
      state.dialog.content = action.payload;
    },
    closeDialog: (state) => {
      state.dialog.open = false;
    },
    clearDialogContent: (state) => {
      state.dialog.content = { title: undefined, content: undefined };
    },
  },
});

export const useDialogStore = () => {
  const values = useAppSelector((state) => state.dialog);
  const dispatch = useAppDispatch();

  return {
    ...values.dialog,
    openDialog: (content: ContentType) =>
      dispatch(dialogSlice.actions.openDialog(content)),
    closeDialog: () => dispatch(dialogSlice.actions.closeDialog()),
    clearDialogContent: () =>
      dispatch(dialogSlice.actions.clearDialogContent()),
  };
};
