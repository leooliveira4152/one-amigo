import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentReference,
  setDoc,
} from "firebase/firestore";
import { useTranslations } from "next-intl";

import { generateRandomObject } from "@/test/testUtils";
import { setKeyToNull } from "@/utils";

import { requiredProperties, useCharacterDoc } from "./manageCharacterDoc";
import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreCharacter } from "../types";

const mockDocReturn = {} as DocumentReference;
const mockDataReturn = {} as FirestoreCharacter;
const mockExists = jest.fn();
const mockData = jest.fn(() => mockDataReturn);
const mockCollectionReturn = {} as CollectionReference;
const mockAddDocReturn = { ...generateRandomObject, id: faker.string.alphanumeric(10) };

jest.mock("../client", () => ({ firestoreDatabase: jest.fn() }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(() => mockDocReturn),
  getDoc: jest.fn(() => Promise.resolve({ exists: mockExists, data: mockData })),
  collection: jest.fn(() => mockCollectionReturn),
  addDoc: jest.fn(() => mockAddDocReturn),
  setDoc: jest.fn(),
}));

describe("useCharacterDoc", () => {
  const {
    result: {
      current: { createCharacter, readCharacterDoc },
    },
  } = renderHook(useCharacterDoc);
  const {
    result: { current: t },
  } = renderHook(() => useTranslations("error"));

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
    const characterObject: Omit<FirestoreCharacter, "id"> = {
      name: faker.person.fullName(),
      abilities: [faker.lorem.words(2), faker.lorem.words(2)],
      affiliation: { organization: faker.lorem.words(2) },
      deathSave: { failed: 0, success: 0 },
    };

    it("should create the character if every required properties are present", async () => {
      await createCharacter(characterObject);
      expect(collection).toHaveBeenCalledWith(
        firestoreDatabase,
        CollectionsEnum.CHARACTERS
      );
      expect(addDoc).toHaveBeenCalledWith(mockCollectionReturn, {});
      expect(setDoc).toHaveBeenCalledWith(mockAddDocReturn, {
        ...characterObject,
        id: mockAddDocReturn.id,
      });
    });

    it.each(requiredProperties)(
      "should return an error if %s wasn't passed",
      async (property) => {
        const modifiedCharacterObject = setKeyToNull(characterObject, property);
        expect(createCharacter(modifiedCharacterObject)).rejects.toEqual(
          t("missingProperties")
        );
        expect(collection).not.toHaveBeenCalled();
      }
    );
  });
});
