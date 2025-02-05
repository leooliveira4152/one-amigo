import { User } from "firebase/auth";

export type FirestoreUser = Pick<User, "displayName" | "email" | "uid"> & {
  admin?: boolean;
};
