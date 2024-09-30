import { User } from "firebase/auth";

// TODO - when managing multiple collections, properly move the types and functions to collection-based directories

export type FirestoreUser = Pick<User, "displayName" | "email" | "uid"> & {
  admin?: boolean;
};

export type FirestoreCharacter = {
  name: string;
  nickname?: string;
  ability?: string;
  affiliation: { organization: string; roles?: string[] };
};

export type FirestoreOrganization = {
  id: string;
  name: string;
  members: string[];
  roles: string[];
  pirateCrew?: boolean;
};

export type FirestoreAbility = {
  id: string;
  name: string;
  isMagic: boolean;
  description?: string;
};

export enum CollectionsEnum {
  CHARACTERS = "characters",
  USERS = "users",
  ORGANIZATIONS = "organizations",
  ABILITIES = "abilities",
}

export type Collections = {
  [CollectionsEnum.USERS]: FirestoreUser;
  [CollectionsEnum.CHARACTERS]: FirestoreCharacter;
  [CollectionsEnum.ORGANIZATIONS]: FirestoreOrganization;
  [CollectionsEnum.ABILITIES]: FirestoreOrganization;
};
