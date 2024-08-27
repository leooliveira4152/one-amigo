/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { fireEvent, render, within } from "@testing-library/react";

import { Login, LoginTestIds } from "./Login";

let signInResolve: any;
let signInReject: any;

const mockPush = jest.fn();
const mockOpenDialog = jest.fn();
const mockSetIsSpectator = jest.fn();
const mockLogout = jest.fn();
const mockSignInWithGooglePopup = jest.fn(
  () =>
    new Promise((resolve, reject) => {
      signInResolve = resolve;
      signInReject = reject;
    })
);

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

jest.mock("../store/dialog", () => ({
  useDialogStore: jest.fn(() => ({ openDialog: mockOpenDialog })),
}));

jest.mock("../store/user", () => ({
  useUserStore: jest.fn(() => ({ setIsSpectator: mockSetIsSpectator })),
}));

jest.mock("../firebase/auth", () => ({
  useLogout: jest.fn(() => ({ logout: mockLogout })),
  useSignInWithGooglePopup: jest.fn(() => ({
    signInWithGooglePopup: mockSignInWithGooglePopup,
  })),
}));

describe("<Login />", () => {
  const setup = () => render(<Login />);

  it("should render the root component and its logo", () => {
    const { getByTestId } = setup();
    getByTestId(LoginTestIds.ROOT);
    getByTestId(LoginTestIds.LOGO);
  });

  it("should render the operation buttons inside their container", () => {
    const { getByTestId } = setup();
    const { getByTestId: getByTestIdWithinContainer } = within(
      getByTestId(LoginTestIds.BUTTON_CONTAINER)
    );
    getByTestIdWithinContainer(LoginTestIds.LOGIN_BUTTON);
    getByTestIdWithinContainer(LoginTestIds.SPECTATOR_BUTTON);
  });

  it("should add spectator status and redirect user to home if user clicks on logAsSpectator", () => {
    const { getByTestId } = setup();
    fireEvent.click(getByTestId(LoginTestIds.SPECTATOR_BUTTON));
    expect(mockSetIsSpectator).toHaveBeenCalledWith(true);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  describe("login button (signInWithGooglePopup call)", () => {
    it("should NOT call the dialog and logout function if everything works accordingly", async () => {
      const { getByTestId } = setup();
      fireEvent.click(getByTestId(LoginTestIds.LOGIN_BUTTON));
      expect(mockSignInWithGooglePopup).toHaveBeenCalled();
      await signInResolve();

      expect(mockOpenDialog).not.toHaveBeenCalled();
      expect(mockLogout).not.toHaveBeenCalled();
    });

    it("should open a dialog and logout if signInWithGooglePopup rejects", async () => {
      const { getByTestId } = setup();
      fireEvent.click(getByTestId(LoginTestIds.LOGIN_BUTTON));
      expect(mockSignInWithGooglePopup).toHaveBeenCalled();
      await signInReject();

      expect(mockOpenDialog).toHaveBeenCalledWith({
        content: expect.any(String),
      });
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
