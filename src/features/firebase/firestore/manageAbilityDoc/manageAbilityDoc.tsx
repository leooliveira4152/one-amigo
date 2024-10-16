import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { Path } from "react-hook-form";

import { validateRequiredProperties } from "@/utils";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreAbility } from "../types";
import { readDoc } from "../utils";

export const requiredProperties: Path<FirestoreAbility>[] = ["name", "id"];

// TODO - rename files

export function useAbilityDoc() {
  const t = useTranslations("error");

  async function createAbility(ability: FirestoreAbility) {
    const missingProperties = validateRequiredProperties(ability, requiredProperties);
    if (missingProperties.length)
      throw t("missingProperties", { properties: missingProperties.join(", ") });

    const abilityUserRef = doc(firestoreDatabase, CollectionsEnum.ABILITIES, ability.id);
    const document = await getDoc(abilityUserRef);
    if (document.exists()) throw t("documentExist");

    await setDoc(abilityUserRef, ability);
    return;
  }

  async function listAbilities() {
    const collectionDocuments = await getDocs(
      collection(firestoreDatabase, CollectionsEnum.ABILITIES)
    );
    return collectionDocuments.docs.map((doc) => doc.data() as FirestoreAbility);
  }

  async function readAbilityDoc(id: string) {
    return await readDoc<FirestoreAbility>(CollectionsEnum.ABILITIES, id);
  }

  return { createAbility, listAbilities, readAbilityDoc };
}
