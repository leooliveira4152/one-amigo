import { KonvaEventObject } from "konva/lib/Node";
import { Dispatch, SetStateAction, useState } from "react";

import { moveCharacter } from "@/features/firebase/database";
import { Coordinates } from "@/features/playArea";
import { usePlayAreaStore } from "@/features/store/playArea";

type useDragHandlerProps = Coordinates & {
  playAreaKey: string;
  setCoordinates: Dispatch<SetStateAction<Coordinates>>;
};

export function useDragHandler({
  x,
  y,
  playAreaKey,
  setCoordinates,
}: useDragHandlerProps) {
  const { stageScale, stagePosition } = usePlayAreaStore();

  const [dragOffset, setDragOffset] = useState<Coordinates>({ x: 0, y: 0 });

  return {
    onDragStart: (event: KonvaEventObject<DragEvent>) => {
      const stage = event.target.getStage();
      const pointerPosition = stage?.getPointerPosition();
      if (!pointerPosition) return;

      // Calculate the offset between the pointer position and the center of the circle
      const offsetX = pointerPosition.x - (x * stageScale + stagePosition.x);
      const offsetY = pointerPosition.y - (y * stageScale + stagePosition.y);

      setDragOffset({ x: offsetX, y: offsetY });
    },
    onDragEnd: (event: KonvaEventObject<DragEvent>) => {
      const stage = event.target.getStage();
      const pointerPosition = stage?.getPointerPosition();
      if (!pointerPosition) return;

      // Calculate the new position, considering the stored offset and stroke width
      const newPosition = {
        x: (pointerPosition.x - stagePosition.x - dragOffset.x) / stageScale,
        y: (pointerPosition.y - stagePosition.y - dragOffset.y) / stageScale,
      };

      // TODO - OoB currently happens to the bottom right

      // Ensure the position is not out of bounds
      newPosition.x = Math.max(newPosition.x, 0);
      newPosition.y = Math.max(newPosition.y, 0);

      setCoordinates(newPosition);
      moveCharacter(playAreaKey, newPosition);
    },
  };
}
