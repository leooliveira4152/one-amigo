import "@testing-library/jest-dom";
import { faker } from "@faker-js/faker";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { createUser } from "./createUser";
import { firestoreDatabase } from "../client";
import { CollectionsEnum } from "../types";

jest.mock("../client");
jest.mock("firebase/firestore");

const mockUser = {
  displayName: faker.person.fullName(),
  email: faker.internet.email(),
  uid: faker.string.alphanumeric(),
} as User;

describe("createUser", () => {
  const mockFirestore = firestoreDatabase;
  const mockUserRef = doc(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFirestore as any,
    CollectionsEnum.USERS,
    mockUser.email!
  );
  const setup = (override?: Partial<User>) =>
    createUser({ ...mockUser, ...override });

  beforeEach(() => {
    jest
      .mocked(getDoc)
      .mockImplementation(
        () => ({ exists: () => false } as unknown as ReturnType<typeof getDoc>)
      );
  });

  it("should call doc with the right params", async () => {
    await setup();
    expect(doc).toHaveBeenCalledWith(
      mockFirestore,
      CollectionsEnum.USERS,
      mockUser.email
    );
  });

  it("should return before requesting firebase doc if there's no user.email", async () => {
    const result = await setup({ email: undefined });
    expect(result).toBeNull();
    expect(doc).not.toHaveBeenCalled();
  });

  it("should return before setDoc if the document already exists", async () => {
    jest
      .mocked(getDoc)
      .mockImplementation(
        () => ({ exists: () => true } as unknown as ReturnType<typeof getDoc>)
      );

    const result = await setup();
    expect(result).toBeNull();

    expect(doc).toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("should call setDoc with the right params if condition above aren't met", async () => {
    jest
      .mocked(getDoc)
      .mockResolvedValueOnce({ exists: () => false } as unknown as ReturnType<
        typeof getDoc
      >);

    const result = await setup();
    expect(result).toBeUndefined();

    expect(doc).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(mockUserRef, mockUser);
  });
});
