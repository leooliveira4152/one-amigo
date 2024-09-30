import { faker } from "@faker-js/faker";
import { Alert } from "@mui/material";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { SnackbarProvider, useSnackbarContext } from "./SnackbarContext";

describe("SnackbarProvider", () => {
  const content = faker.lorem.sentence();
  const severity = faker.lorem.word() as ComponentProps<typeof Alert>["severity"];

  const openSnackbarText = "Open Snackbar";
  const closeSnackbarText = "Close Snackbar";

  const TestComponent = () => {
    const { openSnackbar, closeSnackbar } = useSnackbarContext();

    return (
      <div>
        <button onClick={() => openSnackbar({ content, severity })}>
          {openSnackbarText}
        </button>
        <button onClick={closeSnackbar}>{closeSnackbarText}</button>
      </div>
    );
  };

  const setup = () =>
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );

  it("should open and close the snackbar correctly", async () => {
    const { getByText, queryByText } = setup();

    expect(queryByText(content)).toBeFalsy();
    userEvent.click(getByText(openSnackbarText));
    await waitFor(() => getByText(content));
    userEvent.click(getByText(closeSnackbarText));
    await waitFor(() => expect(queryByText(content)).toBeFalsy());
  });

  it("should reset snackbar content after closing", async () => {
    const { getByText, queryByText } = setup();

    userEvent.click(getByText(openSnackbarText));
    await waitFor(() => getByText(content));
    userEvent.click(getByText(closeSnackbarText));
    await waitFor(() => expect(queryByText(content)).toBeFalsy());
    userEvent.click(getByText(openSnackbarText));
    await waitFor(() => getByText(content));
  });
});
