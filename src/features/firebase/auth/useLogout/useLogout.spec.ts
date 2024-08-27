import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";
import { signOut } from "firebase/auth";

import { useLogout } from "./useLogout";
import { auth } from "../auth";

const mockSetCurrentUser = jest.fn();
const mockReplace = jest.fn();

jest.mock("firebase/auth");
jest.mock("../auth");
jest.mock("@/features/store/user", () => ({
  useUserStore: jest.fn(() => ({ setCurrentUser: mockSetCurrentUser })),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ replace: mockReplace })),
}));

describe("logout", () => {
  const setup = () => renderHook(useLogout).result.current;

  it("should call firebase signOut with the right auth param and then redirect the user", async () => {
    const { logout } = setup();
    await logout();

    expect(signOut).toHaveBeenCalledWith(auth);
    expect(mockSetCurrentUser).toHaveBeenCalledWith(null);
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
