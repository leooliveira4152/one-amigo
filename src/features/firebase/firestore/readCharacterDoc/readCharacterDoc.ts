import { doc, getDoc } from "firebase/firestore";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreCharacter } from "../types";

export async function readCharacterDoc(id: string) {
  const characterRef = doc(firestoreDatabase, CollectionsEnum.CHARACTERS, id);
  const document = await getDoc(characterRef);
  if (!document.exists()) return null;
  return document.data() as FirestoreCharacter;
}
