import { FirestoreAbility } from "./manageAbilityDoc/types";
import { FirestoreCharacter } from "./manageCharacterDoc/types";
import { FirestoreOrganization } from "./manageOrganizationDoc/types";
import { FirestoreUser } from "./manageUserDoc/types";

export * from "./manageAbilityDoc/types";
export * from "./manageCharacterDoc/types";
export * from "./manageOrganizationDoc/types";
export * from "./manageUserDoc/types";

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
  [CollectionsEnum.ABILITIES]: FirestoreAbility;
};

export type FirestoreSheetFeature = { name: string; description: string };
