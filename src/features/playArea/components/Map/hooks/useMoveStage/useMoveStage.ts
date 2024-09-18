import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva/lib/shapes/Rect";
import { RefObject } from "react";

import { usePlayAreaStore } from "@/features/store/playArea";

export function useMoveStage(draggableRef: RefObject<Konva.Rect>) {
  const { mapDimensions, changeStagePosition, changePointer } = usePlayAreaStore();

  return {
    onDragStart: () => changePointer("grabbing"),
    onDragMove: (event: KonvaEventObject<DragEvent>) => {
      const draggedPosition = event.target._lastPos;
      if (
        !draggedPosition ||
        !draggableRef.current ||
        !mapDimensions.height ||
        !mapDimensions.width
      )
        return;

      changeStagePosition(draggedPosition);
      // Not resetting the draggableRef position implies that the user may not be able to drag it again
      draggableRef.current.position({ x: 0, y: 0 });
    },
    onDragEnd: () => changePointer("default"),
  };
}
