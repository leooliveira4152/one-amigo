/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDatabase, onValue, ref, set, update } from "firebase/database";
import { DependencyList, useEffect } from "react";

import { DatabaseModel } from "./types";
import { app } from "../client";

const database = getDatabase(app);

type Key<
  T extends Record<string, any>,
  K extends string
> = K extends `${infer P}/${infer R}` ? Key<T[P], R> : T[K];

export const useRealtimeDatabase = <Path extends string>(
  path: Path,
  callback: (_snapshot: Key<DatabaseModel, Path> | null) => any,
  dependencies: DependencyList = []
) => {
  return useEffect(() => {
    const query = ref(database, path);
    return onValue(query, (snapshot) => callback(snapshot.val()));
    // Placing callback as a dependency here would trigger an infinite loop, beware
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...dependencies]);
};

export const writeOnDatabase = <Path extends string>(
  path: Path,
  data: Key<DatabaseModel, Path>
) => {
  const query = ref(database, path);
  set(query, data);
};

export const updateDatabase = <Path extends string>(
  path: Path,
  data: Partial<Key<DatabaseModel, Path>>
) => {
  const query = ref(database, path);
  update(query, data);
};
