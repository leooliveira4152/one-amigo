/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { getDatabase, onValue, ref, set } from "firebase/database";
import { app } from "../client";
import { DatabaseModel } from "./types";
import { DependencyList, useEffect } from "react";

const database = getDatabase(app);

type Key<
  T extends Record<string, any>,
  K extends string
> = K extends `${infer P}/${infer R}` ? Key<T[P], R> : T[K];

// TODO - Remove these functions from root/index
// TODO - Create unit tests when doing so

export const useRealtimeDatabase = <Path extends string>(
  path: Path,
  callback: (_snapshot: Key<DatabaseModel, Path> | null) => any,
  dependencies: DependencyList = []
) => {
  return useEffect(() => {
    const query = ref(database, path);
    return onValue(query, (snapshot) => callback(snapshot.val()));
  }, [path, callback, ...dependencies]);
};

export const writeOnDatabase = <Path extends string>(
  path: Path,
  data: Key<DatabaseModel, Path>
) => {
  const query = ref(database, path);
  set(query, data);
};
