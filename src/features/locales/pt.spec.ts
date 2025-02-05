/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock("./common", () => ({ common: {} }));

function getStringValues(obj: any): string[] {
  const stringValues: string[] = [];
  function traverse(current: any) {
    if (typeof current === "string") {
      stringValues.push(current);
    } else if (typeof current === "object" && current !== null) {
      for (const key in current) {
        if (Object.prototype.hasOwnProperty.call(current, key)) {
          traverse(current[key]);
        }
      }
    }
  }

  traverse(obj);
  return stringValues;
}

function findDuplicateStrings(arr: string[]): string[] {
  const stringCount = new Map<string, number>();
  const duplicates: string[] = [];

  for (const str of arr) {
    const count = stringCount.get(str) || 0;
    stringCount.set(str, count + 1);
  }
  stringCount.forEach((count, str) => {
    if (count > 1) {
      duplicates.push(str);
    }
  });

  return duplicates;
}

describe("pt.ts", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should not repeat any keys that aren't in the common file", () => {
    const ptTranslation = require("./pt.ts");
    const stringValuesArray = getStringValues(ptTranslation);
    const duplicatedStrings = findDuplicateStrings(stringValuesArray);
    expect(duplicatedStrings.length).toBe(0);
  });

  it("should not have any keys that are in the common file (while common.ts is being mocked)", () => {
    const ptTranslation = require("./pt.ts");
    const { common } = jest.requireActual("./common.ts");
    const stringValuesArray = getStringValues(ptTranslation);
    const duplicatedStrings = stringValuesArray.filter((currentString) =>
      Object.values(common).includes(currentString)
    );
    expect(duplicatedStrings.length).toBe(0);
  });
});
