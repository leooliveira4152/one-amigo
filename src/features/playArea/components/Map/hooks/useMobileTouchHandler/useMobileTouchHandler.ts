import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva/lib/shapes/Rect";
import { RefObject, useState } from "react";

import { usePlayAreaStore } from "@/features/store/playArea";

import { Coordinates } from "../../../../types";

export function useMobileTouchHandler(draggableRef: RefObject<Konva.Rect>) {
  const { stageScale, stagePosition, changeStageScale, changeStagePosition } =
    usePlayAreaStore();

  const [initialCenter, setInitialCenter] = useState<Coordinates>();
  const [initialDistance, setInitialDistance] = useState<number>();
  const [initialStageScale, setInitialStageScale] = useState<number>();

  return {
    onTouchMove: (e: KonvaEventObject<TouchEvent>) => {
      e.evt.preventDefault();
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const stage = draggableRef.current;

      if (!(touch1 && touch2 && stage)) return;
      stage.stopDrag();

      const p1 = { x: touch1.clientX, y: touch1.clientY };
      const p2 = { x: touch2.clientX, y: touch2.clientY };

      const updatedDistance = getDistance(p1, p2);
      const updatedCenter = getCenter(p1, p2);

      if (!initialCenter) setInitialCenter(updatedCenter);
      if (!initialDistance) setInitialDistance(updatedDistance);
      if (!initialStageScale) setInitialStageScale(stageScale);
      if (!initialCenter || !initialDistance || !initialStageScale) return;

      const pointTo = {
        x: (updatedCenter.x - stagePosition.x) / stageScale,
        y: (updatedCenter.y - stagePosition.y) / stageScale,
      };
      const dx = updatedCenter.x - initialCenter.x;
      const dy = updatedCenter.y - initialCenter.y;

      // ** 0.75 and / 5 eases the pinch animation
      const updatedScale =
        initialStageScale * (updatedDistance / initialDistance) ** 0.75;
      // toFixed help with jest checks, no production code change
      const updatePosition = {
        x: Number((updatedCenter.x - pointTo.x * updatedScale - dx / 5).toFixed(3)),
        y: Number((updatedCenter.y - pointTo.y * updatedScale - dy / 5).toFixed(3)),
      };

      changeStageScale(updatedScale);
      changeStagePosition(updatePosition);
    },
    onTouchEnd: () => {
      setInitialCenter(undefined);
      setInitialDistance(undefined);
      setInitialStageScale(undefined);
    },
  };

  function getDistance(p1: Coordinates, p2: Coordinates) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCenter(p1: Coordinates, p2: Coordinates) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }
}
