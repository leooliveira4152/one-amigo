import "@testing-library/jest-dom";
import { faker } from "@faker-js/faker";
import { User } from "firebase/auth";
import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { generateRandomObject } from "@/testUtils";

import { createUser, readUser } from "./manageUserDoc";
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
    expect(setDoc).toHaveBeenCalled();
  });
});

describe("readUser", () => {
  const mockEmail = faker.internet.email();

  it("should return null if doc has no data", async () => {
    const mockDocument = {
      exists: () => true,
      data: generateRandomObject,
    } as DocumentSnapshot;
    jest.mocked(getDoc).mockResolvedValueOnce(mockDocument);

    expect(await readUser(mockEmail)).toBe(mockDocument);
  });

  describe("failed cases", () => {
    const mockUserRef = {} as DocumentReference;
    jest.mocked(doc).mockReturnValue(mockUserRef);

    const commonTests = () => {
      expect(doc).toHaveBeenCalledWith(
        firestoreDatabase,
        CollectionsEnum.USERS,
        mockEmail
      );
      expect(getDoc).toHaveBeenCalledWith(mockUserRef);
    };

    it("should return null if no email was passed", async () => {
      expect(await readUser("")).toBeNull();
    });

    it("should return null if no doc exists", async () => {
      jest.mocked(getDoc).mockResolvedValueOnce({
        exists: () => false,
        data: () => {},
      } as DocumentSnapshot);

      expect(await readUser(mockEmail)).toBeNull();
      commonTests();
    });

    it("should return null if doc has no data", async () => {
      jest.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => undefined,
      } as DocumentSnapshot);

      expect(await readUser(mockEmail)).toBeNull();
      commonTests();
    });
  });
});
