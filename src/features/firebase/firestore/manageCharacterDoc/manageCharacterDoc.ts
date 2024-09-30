import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { Path } from "react-hook-form";

import { validateRequiredProperties } from "@/utils";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreCharacter } from "../types";

export const requiredProperties: Path<FirestoreCharacter>[] = [
  "name",
  "ability",
  "affiliation.organization",
];

export async function createCharacter(character: FirestoreCharacter) {
  if (!validateRequiredProperties(character, requiredProperties))
    throw "Faltam propriedades obrigatórias";

  const abilityUserRef = collection(firestoreDatabase, CollectionsEnum.CHARACTERS);
  await addDoc(abilityUserRef, character);
  return;
}

export async function readCharacterDoc(id: string) {
  const characterRef = doc(firestoreDatabase, CollectionsEnum.CHARACTERS, id);
  const document = await getDoc(characterRef);
  if (!document.exists()) return null;
  return document.data() as FirestoreCharacter;
}
