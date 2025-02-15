import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { firestoreDatabase } from "../client";
import { Collections, CollectionsEnum, FirestoreUser } from "../types";

export async function createUser(user: User) {
  if (!user.email) return null;

  const userRef = doc(firestoreDatabase, CollectionsEnum.USERS, user.email);
  const document = await getDoc(userRef);
  if (document.exists()) return null;

  const filteredDocument: FirestoreUser = {
    displayName: user.displayName,
    email: user.email,
    uid: user.uid,
  };

  setDoc(userRef, filteredDocument);
}

export async function readUser(email: string) {
  if (!email) return null;
  const userRef = doc(firestoreDatabase, CollectionsEnum.USERS, email);
  const document = await getDoc(userRef);
  if (!document.exists() || !document.data()) return null;
  return { ...document, data: () => document.data() as Collections["users"] };
}
