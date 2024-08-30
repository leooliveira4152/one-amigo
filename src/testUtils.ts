import { faker } from "@faker-js/faker";

export const generateRandomObject = (
  numKeys = faker.number.int({ min: 1, max: 10 })
) =>
  Object.fromEntries(
    Array.from({ length: numKeys }, () => [
      faker.lorem.word(),
      faker.number.int(),
    ])
  );

export const mockInteger = () => faker.number.int({ min: 1, max: 10 });
