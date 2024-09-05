import { useState } from "react";

import { Coordinates } from "@/features/playArea";
import { endsWithAtNumber } from "@/utils";

import { updateDatabase, useRealtimeDatabase } from "../database";
import { CharacterDatabaseType, DatabaseModelEnum } from "../types";

export function useReadCharacters() {
  const [characters, setCharacters] = useState<CharacterDatabaseType[]>([]);

  useRealtimeDatabase(DatabaseModelEnum.CHARACTERS, (snapshot) => {
    if (!snapshot) return;
    const characterData = Object.entries(snapshot).map(([id, data]) => {
      // Duplicated characters icons should be handled separately in playArea but should have the same icons and stats
      const characterId = endsWithAtNumber(id) ? id.split("@")[0] : id;
      return {
        ...data,
        characterId,
        playAreaKey: id,
      };
    });
    setCharacters(characterData);
  });

  return characters;
}

export function moveCharacter(id: string, data: Coordinates) {
  updateDatabase(`${DatabaseModelEnum.CHARACTERS}/${id}`, data);
}
