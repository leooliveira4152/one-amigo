import { faker } from "@faker-js/faker";
import { DocumentReference } from "firebase/firestore";

import { readCharacterDoc } from "./readCharacterDoc";
import { FirestoreCharacter } from "../types";

const mockDocReturn = {} as DocumentReference;
const mockDataReturn = {} as FirestoreCharacter;
const mockExists = jest.fn();
const mockData = jest.fn(() => mockDataReturn);

jest.mock("../client", () => ({ firestoreDatabase: jest.fn() }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => mockDocReturn),
  getDoc: jest.fn(() =>
    Promise.resolve({ exists: mockExists, data: mockData })
  ),
}));

describe("readCharacterDoc", () => {
  const mockId = faker.string.alphanumeric();

  it("should call some functions and then return null if no document exists", async () => {
    mockExists.mockReturnValueOnce(false);
    const result = await readCharacterDoc(mockId);
    expect(result).toBeNull();
  });

  it("should call every functions and then return the right document data", async () => {
    mockExists.mockReturnValueOnce(true);
    const result = await readCharacterDoc(mockId);
    expect(result).toBe(mockDataReturn);
  });
});
