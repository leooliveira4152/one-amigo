import { Coordinates } from "@/features/playArea";

export enum DatabaseModelEnum {
  MAP = "map",
  CHARACTERS = "characters",
}

export type CharacterDatabaseType = Coordinates & {
  playAreaKey: string;
  characterId: string;
};

export type DatabaseModel = {
  [DatabaseModelEnum.MAP]: object;
  [DatabaseModelEnum.CHARACTERS]: Record<string, CharacterDatabaseType>;
};
