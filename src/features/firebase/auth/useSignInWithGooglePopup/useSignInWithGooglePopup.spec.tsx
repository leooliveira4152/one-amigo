import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";
import { signInWithPopup } from "firebase/auth";

import { useSignInWithGooglePopup } from "./useSignInWithGooglePopup";
import { createUser } from "../../firestore";
import { auth } from "../auth";

const mockSetIsSpectator = jest.fn();
const mockRoutePush = jest.fn();
const mockLoggedUser = { user: {} };

jest.mock("firebase/firestore");
jest.mock("../auth", () => ({ auth: jest.fn() }));
jest.mock("@/features/store/user", () => ({
  useUserStore: jest.fn(() => ({ setIsSpectator: mockSetIsSpectator })),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: mockRoutePush })),
}));
jest.mock("firebase/auth", () => ({
  signInWithPopup: jest.fn(() => Promise.resolve(mockLoggedUser)),
  GoogleAuthProvider: class {
    setCustomParameters() {}
  },
}));

describe("signInWithGooglePopup", () => {
  const setup = () => renderHook(useSignInWithGooglePopup).result.current;

  it("should call every function with its right params", async () => {
    const { signInWithGooglePopup } = setup();
    await signInWithGooglePopup();

    expect(signInWithPopup).toHaveBeenCalledWith(auth, {});
    expect(createUser).toHaveBeenCalledWith(mockLoggedUser.user);
    expect(mockSetIsSpectator).toHaveBeenCalledWith(false);
    expect(mockRoutePush).toHaveBeenCalled();
  });
});
