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

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export function getObjectEntries<T extends Record<string, unknown>>(
  object: T
): Entries<UnionToIntersection<T>> {
  return Object.entries(object) as Entries<UnionToIntersection<T>>;
}

export const randomNumber = (multiplier = 10) => Math.round(Math.random() * multiplier);

export const PLACEHOLDER_MISSING_INFO = "???";
