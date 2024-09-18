import { useReadCharacters } from "@/features/firebase/database";
import { usePlayAreaStore } from "@/features/store/playArea";

import { Character } from "./components";

export function Entities() {
  const { mapDimensions } = usePlayAreaStore();

  const characters = useReadCharacters();

  if (!mapDimensions.height || !mapDimensions.width) return null;

  return characters.map((data) => <Character key={data.playAreaKey} {...data} />);
}
