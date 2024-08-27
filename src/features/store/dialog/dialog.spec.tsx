import { faker } from "@faker-js/faker";
import { configureStore } from "@reduxjs/toolkit";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";

import { dialogSlice, useDialogStore } from "./dialog";

describe("dialogSlice", () => {
  const initialState = dialogSlice.getInitialState();

  describe("reducer", () => {
    describe("openDialog", () => {
      it("should open the dialog with correct content", () => {
        const content = { title: "Test Dialog", content: "Hello" };
        const action = dialogSlice.actions.openDialog(content);
        const newState = dialogSlice.reducer(initialState, action);

        expect(newState.dialog.open).toBe(true);
        expect(newState.dialog.content).toEqual(content);
      });
    });

    describe("closeDialog", () => {
      it("should close the dialog", () => {
        const initialStateWithOpenDialog = {
          ...initialState,
          dialog: { ...initialState.dialog, open: true },
        };
        const action = dialogSlice.actions.closeDialog();
        const newState = dialogSlice.reducer(
          initialStateWithOpenDialog,
          action
        );

        expect(newState.dialog.open).toBe(false);
      });
    });

    describe("clearDialogContent", () => {
      it("should clear dialog content", () => {
        const initialStateWithContent = {
          ...initialState,
          dialog: {
            ...initialState.dialog,
            content: { title: "Test", content: "Content" },
          },
        };
        const action = dialogSlice.actions.clearDialogContent();
        const newState = dialogSlice.reducer(initialStateWithContent, action);

        expect(newState.dialog.content).toEqual({
          title: undefined,
          content: undefined,
        });
      });
    });
  });

  describe("useDialogStore", () => {
    const store = configureStore({
      reducer: { dialog: dialogSlice.reducer },
    });

    enum DialogStoreIds {
      OPEN = "open-dialog-button",
      CLOSE = "close-dialog-button",
      DIALOG_STATE = "dialog-state",
      CLEAR_DIALOG = "clear-dialog-button",
    }

    const mockDialogTitle = faker.lorem.sentence();
    const mockDialogContent = faker.lorem.sentence();

    const TestComponent = () => {
      const {
        openDialog,
        closeDialog,
        open,
        content: { title, content },
        clearDialogContent,
      } = useDialogStore();

      return (
        <>
          <button
            data-testid={DialogStoreIds.OPEN}
            onClick={() =>
              openDialog({ title: mockDialogTitle, content: mockDialogContent })
            }
          />
          <button data-testid={DialogStoreIds.CLOSE} onClick={closeDialog} />
          <button
            data-testid={DialogStoreIds.CLEAR_DIALOG}
            onClick={clearDialogContent}
          />
          {open && <div data-testid={DialogStoreIds.DIALOG_STATE} />}
          <div>{content}</div>
          <div>{title}</div>
        </>
      );
    };

    const setup = () =>
      render(
        <Provider store={store}>
          <TestComponent />
        </Provider>
      );

    it("should open and close the dialog", async () => {
      const { getByTestId, queryByTestId } = setup();

      userEvent.click(getByTestId(DialogStoreIds.OPEN));
      await waitFor(() => getByTestId(DialogStoreIds.DIALOG_STATE));

      userEvent.click(getByTestId(DialogStoreIds.CLOSE));
      await waitFor(() =>
        expect(queryByTestId(DialogStoreIds.DIALOG_STATE)).toBeFalsy()
      );
    });

    it("should properly clear the content", async () => {
      const { getByTestId, getByText, queryByText } = setup();

      userEvent.click(getByTestId(DialogStoreIds.OPEN));
      await waitFor(() => {
        getByText(mockDialogContent);
        getByText(mockDialogTitle);
      });

      userEvent.click(getByTestId(DialogStoreIds.CLEAR_DIALOG));
      await waitFor(() => {
        expect(queryByText(mockDialogContent)).toBeFalsy();
        expect(queryByText(mockDialogTitle)).toBeFalsy();
      });
    });
  });
});
