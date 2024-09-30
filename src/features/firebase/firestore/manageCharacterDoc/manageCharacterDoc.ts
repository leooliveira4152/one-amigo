import { addDoc, collection, doc, getDoc } from "firebase/firestore";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreCharacter } from "../types";

export async function createCharacter(character: FirestoreCharacter) {
  // TODO - pass every required property
  if (!character.name) throw "Faltam propriedades obrigatórias";

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
