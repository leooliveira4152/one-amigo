import {
  CharacterAttributes,
  DamageTypes,
  EffectTypes,
} from "../firebase/firestore/types";

export const common = {
  id: "Id",
  name: "Nome",
  roles: "Funções",
  abilities: "Habilidades",
  organization: "Organização",
  create: "Criar",

  actions: "Ações",
  attack: "Ataque",
  distanceUnit: "m",

  login: "Login",

  attributesAbv: {
    [`${CharacterAttributes.CHARISMA}Abv`]: "CAR",
    [`${CharacterAttributes.CONSTITUTION}Abv`]: "CON",
    [`${CharacterAttributes.DETERMINATION}Abv`]: "DET",
    [`${CharacterAttributes.DEXTERITY}Abv`]: "DES",
    [`${CharacterAttributes.INTELLIGENCE}Abv`]: "INT",
    [`${CharacterAttributes.STRENGTH}Abv`]: "FOR",
    [`${CharacterAttributes.WISDOM}Abv`]: "SAB",
  },

  damageTypes: {
    [DamageTypes.ACID]: "Ácido",
    [DamageTypes.BLUDGEONING]: "Pancada",
    [DamageTypes.COLD]: "Gelo",
    [DamageTypes.FIRE]: "Fogo",
    [DamageTypes.HEALING]: "Cura",
    [DamageTypes.LIGHTNING]: "Elétrico",
    [DamageTypes.MAGIC_FORCE]: "Força mágica",
    [DamageTypes.NECROTIC]: "Necrótico",
    [DamageTypes.PIERCING]: "Penetrante",
    [DamageTypes.POISON]: "Venenoso",
    [DamageTypes.PSYCHIC]: "Psíquico",
    [DamageTypes.RADIANT]: "Radiante",
    [DamageTypes.SLASHING]: "Cortante",
    [DamageTypes.THUNDER]: "Trovão",
  },

  effectTypes: {
    [EffectTypes.BUFF]: "Buff",
    [EffectTypes.COMMUNICATION]: "Comunicação",
    [EffectTypes.CONTROL]: "Controle",
    [EffectTypes.DEBUFF]: "Debuff",
    [EffectTypes.DIVINATION]: "Clarividência",
    [EffectTypes.HEALING]: "Cura",
    [EffectTypes.ILLUSION]: "Ilusão",
    [EffectTypes.MANIPULATION]: "Manipulação",
    [EffectTypes.MOVEMENT]: "Movimentação",
    [EffectTypes.RESTORATION]: "Restauração",
    [EffectTypes.SUMMONING]: "Invocação",
    [EffectTypes.UTILITY]: "Utilidade",
    [EffectTypes.WARDING]: "Visão",
  },
};
