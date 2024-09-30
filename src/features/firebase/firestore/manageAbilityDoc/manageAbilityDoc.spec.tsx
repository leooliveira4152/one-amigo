import { faker } from "@faker-js/faker";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

import { setKeyToNull } from "@/utils";

import { createAbility, listAbilities, requiredProperties } from "./manageAbilityDoc";
import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreAbility } from "../types";

const docsLength = faker.number.int({ min: 2, max: 10 });

jest.mock("../client", () => ({ firestoreDatabase: jest.fn() }));
jest.mock("firebase/firestore", () => ({
  getDocs: jest.fn(() => ({
    docs: new Array(docsLength).fill(null).map((_) => ({
      data: () => ({ name: faker.lorem.words(2), id: faker.lorem.word() }),
    })),
  })),
  getDoc: jest.fn(() => ({ exists: () => false })),
  doc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
}));

describe("createAbility", () => {
  const abilityObject: FirestoreAbility = {
    id: faker.lorem.word(),
    name: faker.lorem.words(2),
    isMagic: faker.datatype.boolean(),
  };

  it("should create the ability accordingly if every required property is present", async () => {
    const mockDocReturn = {} as ReturnType<typeof doc>;
    jest.mocked(doc).mockReturnValueOnce(mockDocReturn);

    await createAbility(abilityObject);
    expect(setDoc).toHaveBeenCalledWith(mockDocReturn, abilityObject);
  });

  it("should return an error if document already exists", () => {
    jest
      .mocked(getDoc)
      .mockResolvedValueOnce({ exists: () => true } as unknown as ReturnType<
        typeof getDoc
      >);

    expect(createAbility(abilityObject)).rejects.toEqual("Documento já existe");
  });

  it.each(requiredProperties)(
    "should return an error if %s wasn't passed",
    (property) => {
      const modifiedAbilityObject = setKeyToNull(abilityObject, property);
      expect(createAbility(modifiedAbilityObject)).rejects.toEqual(
        "Faltam propriedades obrigatórias"
      );
      expect(collection).not.toHaveBeenCalled();
    }
  );
});

describe("listAbilities", () => {
  it("should properly list all abilities with its intended return type", async () => {
    const abilities = await listAbilities();
    expect(collection).toHaveBeenCalledWith(firestoreDatabase, CollectionsEnum.ABILITIES);
    expect(abilities).toHaveLength(docsLength);
    expect(abilities[0]).toStrictEqual(
      expect.objectContaining({ id: expect.any(String), name: expect.any(String) })
    );
  });
});
