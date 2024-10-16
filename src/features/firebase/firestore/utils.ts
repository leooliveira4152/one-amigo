import { doc, getDoc } from "firebase/firestore";

import { firestoreDatabase } from "./client";
import { CollectionsEnum } from "./types";

export async function readDoc<T extends Record<string, unknown>>(
  collection: CollectionsEnum,
  id: string
) {
  const abilityRef = doc(firestoreDatabase, collection, id);
  const document = await getDoc(abilityRef);
  if (!document.exists()) return null;
  return document.data() as T;
}
