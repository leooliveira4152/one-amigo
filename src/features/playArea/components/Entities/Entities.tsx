import { useReadCharacters } from "@/features/firebase/database";
import { usePlayAreaStore } from "@/features/store/playArea";

import { Character } from "./components";
import { METER_SIZE } from "../../common";

export function Entities() {
  const { mapDimensions } = usePlayAreaStore();

  const characters = useReadCharacters();

  if (!mapDimensions.height || !mapDimensions.width) return null;

  return characters.map((data) => (
    <Character key={data.playAreaKey} radius={METER_SIZE} {...data} />
  ));
}
