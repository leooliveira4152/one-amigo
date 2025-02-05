import { faker } from "@faker-js/faker";

import {
  ActionTypes,
  AttackTypes,
  CharacterAttributes,
  DamageTypes,
  EffectTypes,
  FirestoreAbilityAction,
  TimeTypes,
  ValueWithModifier,
} from "@/features/firebase/firestore";
import { DiceTypes } from "@/types";
import { getObjectEntries, randomNumber } from "@/utils";

export const mockAttacks = (quantity: number = 15): FirestoreAbilityAction[] => {
  const mockAttacks: FirestoreAbilityAction[] = [];

  const attributesList = getObjectEntries(CharacterAttributes);
  const classesList = ["_swordsman", "_brawler", "_sniper"];

  const randomModifier = () => {
    const shuffledArray = [...attributesList].sort(() => 0.5 - Math.random());
    const slicedArray = shuffledArray.slice(0, randomNumber(4));
    const modifierObject: ValueWithModifier["modifier"] = {};
    slicedArray.forEach((modifier) => {
      modifierObject[modifier[1]] = Number((randomNumber(5) * 0.05).toFixed(2));
    });
    return modifierObject;
  };

  for (let i = 0; i <= quantity; i++) {
    const attackType = faker.helpers.enumValue(AttackTypes);
    const actionType = faker.helpers.enumValue(ActionTypes);
    const timeType = faker.helpers.enumValue(TimeTypes);
    const damageType = faker.helpers.enumValue(DamageTypes);
    const effectType = faker.helpers.enumValue(EffectTypes);
    const diceType = faker.helpers.enumValue(DiceTypes);
    const attribute = faker.helpers.enumValue(CharacterAttributes);
    const mainClass = faker.helpers.arrayElement(classesList);

    mockAttacks.push({
      id: `${attackType}${i}`,
      name: `${attackType} #${i}`,
      attackType: attackType,
      actionType: actionType,
      class: mainClass,
      ...(randomNumber(2) > 1 ? { time: { type: timeType, time: randomNumber() } } : {}),
      range: {
        value: randomNumber(20),
        modifier: randomModifier(),
      },
      description: faker.lorem.paragraphs(randomNumber(2) + 1),
      notes: Array(randomNumber(3))
        .fill(null)
        .map(() => faker.lorem.word()),
      ...(randomNumber(2) > 0
        ? {
            damage: {
              value: randomNumber(),
              modifier: randomModifier(),
              type: damageType,
              dice: diceType,
            },
          }
        : { effect: effectType }),
      ...(randomNumber(2) > 1
        ? { hitModifier: { value: randomNumber(3) - 2, modifier: randomModifier() } }
        : {
            savingThrow: {
              value: randomNumber(20),
              modifier: randomModifier(),
              attribute: attribute,
            },
          }),
    });
  }

  return mockAttacks;
};
