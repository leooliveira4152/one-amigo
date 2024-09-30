import { faker } from "@faker-js/faker";
import { waitFor } from "@testing-library/dom";
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";

import { setKeyToNull } from "@/utils";

import {
  createCharacter,
  readCharacterDoc,
  requiredProperties,
} from "./manageCharacterDoc";
import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreCharacter } from "../types";

const mockDocReturn = {} as DocumentReference;
const mockDataReturn = {} as FirestoreCharacter;
const mockExists = jest.fn();
const mockData = jest.fn(() => mockDataReturn);
const mockCollectionReturn = {} as CollectionReference;

jest.mock("../client", () => ({ firestoreDatabase: jest.fn() }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => mockDocReturn),
  getDoc: jest.fn(() => Promise.resolve({ exists: mockExists, data: mockData })),
  collection: jest.fn(() => mockCollectionReturn),
  addDoc: jest.fn(),
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

describe("createCharacter", () => {
  const characterObject: FirestoreCharacter = {
    name: faker.person.fullName(),
    ability: faker.lorem.words(2),
    affiliation: { organization: faker.lorem.words(2) },
  };

  it("should create the character if every required properties are present", async () => {
    createCharacter(characterObject);
    expect(collection).toHaveBeenCalledWith(
      firestoreDatabase,
      CollectionsEnum.CHARACTERS
    );
    await waitFor(() =>
      expect(addDoc).toHaveBeenCalledWith(mockCollectionReturn, characterObject)
    );
  });

  it.each(requiredProperties)(
    "should return an error if %s wasn't passed",
    (property) => {
      const modifiedCharacterObject = setKeyToNull(characterObject, property);
      expect(createCharacter(modifiedCharacterObject)).rejects.toEqual(
        "Faltam propriedades obrigatórias"
      );
      expect(collection).not.toHaveBeenCalled();
    }
  );
});
