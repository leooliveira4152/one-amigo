import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { Path } from "react-hook-form";

import { validateRequiredProperties } from "@/utils";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreOrganization } from "../types";
import { readDoc } from "../utils";

export const requiredProperties: Path<FirestoreOrganization>[] = ["name", "id", "roles"];

// TODO - rename files

export function useOrganizationDoc() {
  const t = useTranslations("error");

  async function createOrganization(organization: FirestoreOrganization) {
    const missingProperties = validateRequiredProperties(
      organization,
      requiredProperties
    );
    if (missingProperties.length)
      throw t("missingProperties", { properties: missingProperties.join(", ") });

    const abilityUserRef = doc(
      firestoreDatabase,
      CollectionsEnum.ORGANIZATIONS,
      organization.id
    );
    const document = await getDoc(abilityUserRef);
    if (document.exists()) throw t("documentExist");

    setDoc(abilityUserRef, organization);
  }

  async function listOrganizations() {
    const collectionDocuments = await getDocs(
      collection(firestoreDatabase, CollectionsEnum.ORGANIZATIONS)
    );
    return collectionDocuments.docs.map((doc) => doc.data() as FirestoreOrganization);
  }

  async function readOrganizationDoc(id: string) {
    return await readDoc<FirestoreOrganization>(CollectionsEnum.ORGANIZATIONS, id);
  }

  return { createOrganization, listOrganizations, readOrganizationDoc };
}
