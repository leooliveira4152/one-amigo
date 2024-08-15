import { User } from "firebase/auth";

export type FirestoreUser = Pick<User, "displayName" | "email" | "uid">;

export enum CollectionsEnum {
  USERS = "users",
}

export type Collections = {
  [CollectionsEnum.USERS]: FirestoreUser;
};
