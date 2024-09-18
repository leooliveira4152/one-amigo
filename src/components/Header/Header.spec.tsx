import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";

import { useUserStore } from "@/features/store/user";

import { Header, HeaderIds } from "./Header";

const mockUserStore = {
  currentUser: {} as User,
  spectator: { isSpectator: true },
  setIsSpectator: jest.fn(),
} as unknown as ReturnType<typeof useUserStore>;

const mockLogout = jest.fn();
const mockSignInWithGooglePopup = jest.fn();
const mockPushRoute = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({ push: mockPushRoute })),
}));
jest.mock("@/features/firebase/auth", () => ({
  useLogout: jest.fn(() => ({ logout: mockLogout })),
  useSignInWithGooglePopup: jest.fn(() => ({
    signInWithGooglePopup: mockSignInWithGooglePopup,
  })),
}));
jest.mock("@/features/store/user", () => ({
  useUserStore: jest.fn(() => mockUserStore),
}));

describe("<Header />", () => {
  const setup = () => render(<Header />);

  describe("root component rendering", () => {
    it("should NOT render the component if user is in login screen", () => {
      jest.mocked(usePathname).mockReturnValueOnce("/login");

      const { container } = setup();
      expect(usePathname).toHaveBeenCalled();
      expect(useRouter).toHaveBeenCalled();
      expect(container).toBeEmptyDOMElement();
    });

    it("should NOT render the component if user isn't a spectator NOR an authenticated user", () => {
      jest.mocked(useUserStore).mockReturnValueOnce({
        ...mockUserStore,
        spectator: { isSpectator: false },
        currentUser: null,
      });

      const { container } = setup();
      expect(container).toBeEmptyDOMElement();
    });

    it("should render the component if the conditions above aren't matched", () => {
      const { getByTestId } = setup();
      getByTestId(HeaderIds.ROOT);
    });
  });

  describe("button rendering", () => {
    it("should render the home button with the proper redirect", () => {
      const { getByTestId } = setup();
      fireEvent.click(getByTestId(HeaderIds.HOME));
      expect(mockPushRoute).toHaveBeenCalledWith("/");
    });

    it("should render the character button with the proper redirect", () => {
      const { getByTestId } = setup();
      fireEvent.click(getByTestId(HeaderIds.CHARACTER));
      expect(mockPushRoute).toHaveBeenCalledWith("/character");
    });

    describe("logout button", () => {
      it("should render the logout button (and NOT the login one) if user is logged (currentUser is defined)", () => {
        const { getByTestId, queryByTestId } = setup();
        getByTestId(HeaderIds.LOGOUT);
        expect(queryByTestId(HeaderIds.LOGIN)).toBeFalsy();
      });

      it("should call logout function from firebase on press", () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId(HeaderIds.LOGOUT));

        expect(mockLogout).toHaveBeenCalled();
      });
    });

    describe("login button", () => {
      it("should render the login button (and NOT the logout one) if user is NOT logged (currentUser is NOT defined)", () => {
        jest
          .mocked(useUserStore)
          .mockReturnValueOnce({ ...mockUserStore, currentUser: null });

        const { getByTestId, queryByTestId } = setup();
        getByTestId(HeaderIds.LOGIN);
        expect(queryByTestId(HeaderIds.LOGOUT)).toBeFalsy();
      });

      it("should call signInWithGooglePopup function from firebase on press", () => {
        jest
          .mocked(useUserStore)
          .mockReturnValueOnce({ ...mockUserStore, currentUser: null });

        const { getByTestId } = setup();
        fireEvent.click(getByTestId(HeaderIds.LOGIN));
        expect(mockSignInWithGooglePopup).toHaveBeenCalled();
      });
    });
  });
});
