import { FirestoreSheetFeature } from "..";

type CharacterAttribute<T extends string | null = null> = {
  value: number;
  skills: T extends string
    ? Record<T, { value: number; proficiency: boolean }>
    : undefined;
};

type StatWithTemporary = { current: number; temporary?: number; duration?: number };

export enum CharacterCombatStats {
  HP = "hp",
  ARMOR = "armor",
  DODGE = "dodge",
  SPEED = "speed",
  INITIATIVE = "initiative",
}

export enum CharacterAttributes {
  STRENGTH = "strength",
  DEXTERITY = "dexterity",
  CONSTITUTION = "constitution",
  DETERMINATION = "determination",
  INTELLIGENCE = "intelligence",
  WISDOM = "wisdom",
  CHARISMA = "charisma",
}

export type FirestoreCharacterCombatStats = {
  [CharacterCombatStats.ARMOR]?: StatWithTemporary;
  [CharacterCombatStats.DODGE]?: StatWithTemporary;
  [CharacterCombatStats.SPEED]?: StatWithTemporary;
  [CharacterCombatStats.HP]?: StatWithTemporary & { max: number };
  [CharacterCombatStats.INITIATIVE]?: StatWithTemporary;
};

// TODO - attributes tests should be calculated instead of stored
export type FirestoreCharacterAttributes = {
  [CharacterAttributes.STRENGTH]: CharacterAttribute<"athletics">;
  [CharacterAttributes.DEXTERITY]: CharacterAttribute<
    "acrobatics" | "sleightOfHand" | "stealth"
  >;
  [CharacterAttributes.CONSTITUTION]: CharacterAttribute;
  [CharacterAttributes.DETERMINATION]: CharacterAttribute;
  [CharacterAttributes.INTELLIGENCE]: CharacterAttribute<
    "arcana" | "history" | "investigation" | "nature" | "religion"
  >;
  [CharacterAttributes.WISDOM]: CharacterAttribute<
    "animalHandling" | "insight" | "medicine" | "perception" | "survival"
  >;
  [CharacterAttributes.CHARISMA]: CharacterAttribute<
    "deception" | "intimidation" | "performance" | "persuasion"
  >;
};

export type FirestoreCharacterInventory = {
  equipped?: boolean;
  name: string;
  quantity: number;
  notes: string[];
  description?: string;
};

export type FirestoreCharacter = {
  name: string;
  id: string;
  nickname?: string;
  abilities: string[];
  affiliation: { organization: string; roles?: string[] };
  deathSave: { failed: number; success: number };
  combatStats?: FirestoreCharacterCombatStats;
  attributes?: FirestoreCharacterAttributes;
  inventory?: FirestoreCharacterInventory[];
  features?: FirestoreSheetFeature[];
};
