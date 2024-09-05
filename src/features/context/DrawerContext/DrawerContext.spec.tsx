import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DrawerProvider, useDrawerContext } from "./DrawerContext"; // Adjust the import path as needed

describe("DrawerProvider", () => {
  const openDrawerText = "Open Drawer";
  const closeDrawerText = "Close Drawer";
  const testContentText = "Test content";

  const TestComponent = () => {
    const { openDrawer, closeDrawer } = useDrawerContext();

    return (
      <div>
        <button
          onClick={() =>
            openDrawer({
              content: <div>{testContentText}</div>,
              anchor: "left",
            })
          }>
          {openDrawerText}
        </button>
        <button onClick={closeDrawer}>Close Drawer</button>
      </div>
    );
  };

  const setup = () =>
    render(
      <DrawerProvider>
        <TestComponent />
      </DrawerProvider>
    );

  it("should open and close the drawer correctly", async () => {
    const { getByText, queryByText } = setup();

    expect(queryByText(testContentText)).toBeFalsy();
    userEvent.click(getByText(openDrawerText));
    await waitFor(() => getByText(testContentText));
    userEvent.click(getByText(closeDrawerText));
    await waitFor(() => expect(queryByText(testContentText)).toBeFalsy());
  });

  it("should reset drawer content after closing", async () => {
    const { getByText, queryByText } = setup();

    userEvent.click(getByText(openDrawerText));
    await waitFor(() => getByText(testContentText));
    userEvent.click(getByText(closeDrawerText));
    await waitFor(() => expect(queryByText(testContentText)).toBeFalsy());
    userEvent.click(getByText(openDrawerText));
    await waitFor(() => getByText(testContentText));
  });
});
