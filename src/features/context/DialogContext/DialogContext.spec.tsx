import { faker } from "@faker-js/faker";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DialogProvider, useDialogContext, DialogIds } from "./DialogContext"; // Adjust the import path as needed

// TODO - Not all functions are being tested
describe("DialogProvider", () => {
  const openDialogText = "Open Dialog";
  const closeDialogText = "Close Dialog";

  const TestComponent = () => {
    const { openDialog, closeDialog } = useDialogContext();

    return (
      <div>
        <button
          onClick={() =>
            openDialog({
              content: <div>{faker.lorem.paragraphs()}</div>,
              title: faker.lorem.words(),
            })
          }>
          {openDialogText}
        </button>
        <button onClick={closeDialog}>{closeDialogText}</button>
      </div>
    );
  };

  const setup = () =>
    render(
      <DialogProvider>
        <TestComponent />
      </DialogProvider>
    );

  it("should open and close the dialog correctly", async () => {
    const { queryByTestId, getByText, getByTestId } = setup();

    expect(queryByTestId(DialogIds.ROOT)).toBeFalsy();
    userEvent.click(getByText(openDialogText));
    await waitFor(() => expect(getByTestId(DialogIds.ROOT)).toBeTruthy());
    userEvent.click(getByText(closeDialogText));
    await waitFor(() => expect(queryByTestId(DialogIds.ROOT)).toBeFalsy());
  });

  it("should clear dialog content after closing", async () => {
    const { queryByTestId, getByText, getByTestId } = setup();

    userEvent.click(getByText(openDialogText));
    await waitFor(() => expect(getByTestId(DialogIds.ROOT)).toBeTruthy());
    userEvent.click(getByText(closeDialogText));
    await waitFor(() => expect(queryByTestId(DialogIds.ROOT)).toBeFalsy());
    userEvent.click(getByText(openDialogText));
    await waitFor(() => expect(getByTestId(DialogIds.ROOT)).toBeTruthy());
  });

  it("should clear the dialog title and content after the dialog is closed", async () => {
    const { queryByTestId, getByText, getByTestId } = setup();

    userEvent.click(getByText(openDialogText));
    await waitFor(() => expect(getByTestId(DialogIds.ROOT)).toBeTruthy());
    getByTestId(DialogIds.TITLE);
    getByTestId(DialogIds.CONTENT);

    userEvent.click(getByText(closeDialogText));
    await waitFor(() => expect(queryByTestId(DialogIds.ROOT)).toBeFalsy());
    expect(queryByTestId(DialogIds.TITLE)).toBeFalsy();
    expect(queryByTestId(DialogIds.CONTENT)).toBeFalsy();

    userEvent.click(getByText(openDialogText));
    await waitFor(() => expect(getByTestId(DialogIds.ROOT)).toBeTruthy());
    getByTestId(DialogIds.TITLE);
    getByTestId(DialogIds.CONTENT);
  });
});
