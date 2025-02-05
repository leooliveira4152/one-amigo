import { addDoc, collection, setDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { Path } from "react-hook-form";

import { validateRequiredProperties } from "@/utils";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreCharacter } from "../types";
import { readDoc } from "../utils";

export const requiredProperties: Path<FirestoreCharacter>[] = [
  "name",
  "abilities",
  "affiliation.organization",
  "deathSave",
];

// TODO - rename files

export function useCharacterDoc() {
  const t = useTranslations("error");

  async function createCharacter(character: Omit<FirestoreCharacter, "id">) {
    const missingProperties = validateRequiredProperties(character, requiredProperties);
    if (missingProperties.length) throw t("missingProperties");

    const characterCollection = collection(firestoreDatabase, CollectionsEnum.CHARACTERS);
    const docRef = await addDoc(characterCollection, {});
    await setDoc(docRef, { ...character, id: docRef.id });
    return;
  }

  async function readCharacterDoc(id: string) {
    return await readDoc<FirestoreCharacter>(CollectionsEnum.CHARACTERS, id);
  }

  return { createCharacter, readCharacterDoc };
}
