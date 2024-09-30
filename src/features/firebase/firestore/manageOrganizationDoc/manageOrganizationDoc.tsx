import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { Path } from "react-hook-form";

import { validateRequiredProperties } from "@/utils";

import { firestoreDatabase } from "../client";
import { CollectionsEnum, FirestoreOrganization } from "../types";

export const requiredProperties: Path<FirestoreOrganization>[] = ["name", "id", "roles"];

export async function createOrganization(organization: FirestoreOrganization) {
  if (!validateRequiredProperties(organization, requiredProperties))
    throw "Faltam propriedades obrigatórias";

  const abilityUserRef = doc(
    firestoreDatabase,
    CollectionsEnum.ORGANIZATIONS,
    organization.id
  );
  const document = await getDoc(abilityUserRef);
  if (document.exists()) throw "Documento já existe";

  setDoc(abilityUserRef, organization);
}

export async function listOrganizations() {
  const collectionDocuments = await getDocs(
    collection(firestoreDatabase, CollectionsEnum.ORGANIZATIONS)
  );
  return collectionDocuments.docs.map((doc) => doc.data() as FirestoreOrganization);
}
