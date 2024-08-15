import { Coordinates } from "@/features/playArea/types";

export enum DatabaseModelEnum {
  MAP = "map",
  CHARACTERS = "characters",
}

export type DatabaseModel = {
  [DatabaseModelEnum.MAP]: object;
  [DatabaseModelEnum.CHARACTERS]: Record<string, Coordinates>;
};
