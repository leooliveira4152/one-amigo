import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { Path } from "react-hook-form";

import { validateRequiredProperties } from "@/utils";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreAbility } from "../types";

export const requiredProperties: Path<FirestoreAbility>[] = ["name", "id"];

export async function createAbility(ability: FirestoreAbility) {
  if (!validateRequiredProperties(ability, requiredProperties))
    throw "Faltam propriedades obrigatórias";

  const abilityUserRef = doc(firestoreDatabase, CollectionsEnum.ABILITIES, ability.id);
  const document = await getDoc(abilityUserRef);
  if (document.exists()) throw "Documento já existe";

  await setDoc(abilityUserRef, ability);
  return;
}

export async function listAbilities() {
  const collectionDocuments = await getDocs(
    collection(firestoreDatabase, CollectionsEnum.ABILITIES)
  );
  return collectionDocuments.docs.map((doc) => doc.data() as FirestoreAbility);
}
