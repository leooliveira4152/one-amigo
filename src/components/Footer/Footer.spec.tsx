import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { User } from "firebase/auth";
import { usePathname } from "next/navigation";

import { useUserStore } from "@/features/store/user";

import { Footer, FooterIds } from "./Footer";


const mockUserStore = {
  currentUser: {} as User,
  spectator: { isSpectator: true },
  setIsSpectator: jest.fn(),
} as unknown as ReturnType<typeof useUserStore>;

const mockLogout = jest.fn();
const mockSignInWithGooglePopup = jest.fn();

jest.mock("next/navigation");
jest.mock("@/features/firebase/auth", () => ({
  useLogout: jest.fn(() => ({ logout: mockLogout })),
  useSignInWithGooglePopup: jest.fn(() => ({
    signInWithGooglePopup: mockSignInWithGooglePopup,
  })),
}));
jest.mock("@/features/store/user", () => ({
  useUserStore: jest.fn(() => mockUserStore),
}));

describe("<Footer />", () => {
  const setup = () => render(<Footer />);

  describe("root component rendering", () => {
    it("should NOT render the component if user is in login screen", () => {
      jest.mocked(usePathname).mockReturnValueOnce("/login");

      const { container } = setup();
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
      getByTestId(FooterIds.ROOT);
    });
  });

  describe("button rendering", () => {
    describe("logout button", () => {
      it("should render the logout button (and NOT the login one) if user is logged (currentUser is defined)", () => {
        const { getByTestId, queryByTestId } = setup();
        getByTestId(FooterIds.LOGOUT);
        expect(queryByTestId(FooterIds.LOGIN)).toBeFalsy();
      });

      it("should call logout function from firebase on press", () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId(FooterIds.LOGOUT));

        expect(mockLogout).toHaveBeenCalled();
      });
    });

    describe("login button", () => {
      it("should render the login button (and NOT the logout one) if user is NOT logged (currentUser is NOT defined)", () => {
        jest
          .mocked(useUserStore)
          .mockReturnValueOnce({ ...mockUserStore, currentUser: null });

        const { getByTestId, queryByTestId } = setup();
        getByTestId(FooterIds.LOGIN);
        expect(queryByTestId(FooterIds.LOGOUT)).toBeFalsy();
      });

      it("should call signInWithGooglePopup function from firebase on press", () => {
        jest
          .mocked(useUserStore)
          .mockReturnValueOnce({ ...mockUserStore, currentUser: null });

        const { getByTestId } = setup();
        fireEvent.click(getByTestId(FooterIds.LOGIN));
        expect(mockSignInWithGooglePopup).toHaveBeenCalled();
      });
    });
  });
});
