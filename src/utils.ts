/* eslint-disable @typescript-eslint/no-explicit-any */

export const endsWithAtNumber = (str: string): boolean => {
  const regex = /@\d+$/;
  return regex.test(str);
};

type NestedObject = { [key: string]: any };

function getNestedValue(obj: NestedObject, path: string): any {
  const keys = path.split(".");
  return keys.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    obj
  );
}

export function validateRequiredProperties(obj: NestedObject, paths: string[]): string[] {
  return paths.filter((path) => {
    const value = getNestedValue(obj, path);
    return value === undefined || value === null || value === "" || value.length === 0;
  });
}

export function setKeyToNull<T extends NestedObject>(obj: T, keyPath: string): T {
  const keys = keyPath.split(".");
  const newObj = JSON.parse(JSON.stringify(obj));

  keys.reduce(
    (acc, key, i) => (i === keys.length - 1 ? (acc[key] = null) : acc[key] || {}),
    newObj
  );

  return newObj;
}

export const PLACEHOLDER_MISSING_INFO = "???";
