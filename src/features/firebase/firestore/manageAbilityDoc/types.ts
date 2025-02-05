import { DiceTypes } from "@/types";

import type { CharacterAttributes, FirestoreSheetFeature } from "../types";

export enum AttackTypes {
  MELEE_WEAPON = "meleeWeapon",
  RANGED_WEAPON = "rangedWeapon",
  UNARMED_STRIKE = "meleeAttack",
  MAGIC = "magic",
}

export enum ActionTypes {
  ACTION = "action",
  BONUS_ACTION = "bonusAction",
}

export enum TimeTypes {
  CHANNEL = "channel",
  DURATION = "duration",
}

export enum DamageTypes {
  ACID = "acid",
  BLUDGEONING = "bludgeoning",
  COLD = "cold",
  FIRE = "fire",
  HEALING = "healing",
  LIGHTNING = "lightning",
  MAGIC_FORCE = "magicForce",
  NECROTIC = "necrotic",
  PIERCING = "piercing",
  POISON = "poison",
  PSYCHIC = "psychic",
  RADIANT = "radiant",
  SLASHING = "slashing",
  THUNDER = "thunder",
}

export enum EffectTypes {
  BUFF = "buff",
  DEBUFF = "debuff",
  HEALING = "healing",
  UTILITY = "utility",
  WARDING = "warding",
  CONTROL = "control",
  RESTORATION = "restoration",
  DIVINATION = "divination",
  ILLUSION = "illusion",
  SUMMONING = "summoning",
  COMMUNICATION = "communication",
  MOVEMENT = "movement",
  MANIPULATION = "manipulation",
}

export type ValueWithModifier = {
  value: number;
  modifier: Partial<Record<CharacterAttributes, number>>;
};

export type FirestoreAbilityAction = {
  id: string;
  name: string;
  attackType: AttackTypes;
  actionType: ActionTypes;
  class: string;
  time?: { type: TimeTypes; time: number }; // time in minutes
  range: ValueWithModifier;
  description?: string;
  notes?: string[];
  requireClass?: string;
} & (
  | { damage: ValueWithModifier & { type: DamageTypes; dice: DiceTypes }; effect?: never }
  | { damage?: never; effect: EffectTypes }
) &
  (
    | { hitModifier: ValueWithModifier; savingThrow?: never }
    | {
        hitModifier?: never;
        savingThrow: ValueWithModifier & { attribute: CharacterAttributes };
      }
  );

export type FirestoreAbility = {
  id: string;
  name: string;
  isMagic: boolean;
  description?: string;
  attacks: FirestoreAbilityAction[];
  features: FirestoreSheetFeature[];
};
