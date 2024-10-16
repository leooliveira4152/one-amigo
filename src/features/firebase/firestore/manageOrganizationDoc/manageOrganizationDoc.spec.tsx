import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";

import { generateRandomObject } from "@/test/testUtils";
import { setKeyToNull } from "@/utils";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreOrganization } from "../types";
import { requiredProperties, useOrganizationDoc } from "./manageOrganizationDoc";
import { readDoc } from "../utils";

const docsLength = faker.number.int({ min: 2, max: 10 });
const mockReadAbilityDocReturn = generateRandomObject();

jest.mock("../client", () => ({ firestoreDatabase: jest.fn() }));
jest.mock("../utils", () => ({ readDoc: jest.fn(() => mockReadAbilityDocReturn) }));
jest.mock("firebase/firestore", () => ({
  getDocs: jest.fn(() => ({
    docs: new Array(docsLength).fill(null).map((_) => ({
      data: () => ({
        name: faker.lorem.words(2),
        id: faker.lorem.word(),
        roles: new Array(docsLength).fill(null).map((_) => faker.lorem.word()),
      }),
    })),
  })),
  getDoc: jest.fn(() => ({ exists: () => false })),
  doc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
}));

describe("useOrganizationDoc", () => {
  const {
    result: {
      current: { createOrganization, listOrganizations, readOrganizationDoc },
    },
  } = renderHook(useOrganizationDoc);
  const {
    result: { current: t },
  } = renderHook(() => useTranslations("error"));

  describe("createOrganization", () => {
    const abilityObject: FirestoreOrganization = {
      id: faker.lorem.word(),
      name: faker.lorem.words(2),
      members: [],
      roles: new Array(docsLength).fill(null).map((_) => faker.lorem.word()),
    };

    it("should create the ability accordingly if every required property is present", async () => {
      const mockDocReturn = {} as ReturnType<typeof doc>;
      jest.mocked(doc).mockReturnValueOnce(mockDocReturn);

      await createOrganization(abilityObject);
      expect(setDoc).toHaveBeenCalledWith(mockDocReturn, abilityObject);
    });

    it("should return an error if document already exists", () => {
      jest
        .mocked(getDoc)
        .mockResolvedValueOnce({ exists: () => true } as unknown as ReturnType<
          typeof getDoc
        >);

      expect(createOrganization(abilityObject)).rejects.toEqual(t("documentExist"));
    });

    it.each(requiredProperties)(
      "should return an error if %s wasn't passed",
      (property) => {
        const modifiedOrganizationObject = setKeyToNull(abilityObject, property);
        expect(createOrganization(modifiedOrganizationObject)).rejects.toEqual(
          t("missingProperties")
        );
        expect(collection).not.toHaveBeenCalled();
      }
    );
  });

  describe("listOrganizations", () => {
    it("should properly list all abilities with its intended return type", async () => {
      const abilities = await listOrganizations();
      expect(collection).toHaveBeenCalledWith(
        firestoreDatabase,
        CollectionsEnum.ORGANIZATIONS
      );
      expect(abilities).toHaveLength(docsLength);
      expect(abilities[0]).toStrictEqual(
        expect.objectContaining({ id: expect.any(String), name: expect.any(String) })
      );
    });
  });

  describe("readOrganizationDoc", () => {
    it("should call readDoc with the expected props", async () => {
      const mockId = faker.string.alphanumeric(10);
      const result = await readOrganizationDoc(mockId);
      expect(readDoc).toHaveBeenCalledWith(CollectionsEnum.ORGANIZATIONS, mockId);
      expect(result).toEqual(mockReadAbilityDocReturn);
    });
  });
});
