import { User } from "firebase/auth";

export type FirestoreUser = Pick<User, "displayName" | "email" | "uid"> & {
  admin?: boolean;
};

export type FirestoreCharacter = { name: string };

export enum CollectionsEnum {
  CHARACTERS = "characters",
  USERS = "users",
}

export type Collections = {
  [CollectionsEnum.USERS]: FirestoreUser;
};
