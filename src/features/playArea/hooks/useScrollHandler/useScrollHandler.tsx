import { KonvaEventObject } from "konva/lib/Node";

import { usePlayAreaStore } from "@/features/store/playArea";

export const SCALE_BY = 1.08;

export function useScrollHandler() {
  const { stageScale, stagePosition, changeStagePosition, changeStageScale } =
    usePlayAreaStore();

  return function onWheel(event: KonvaEventObject<WheelEvent>) {
    const stage = event.target.getStage();
    const pointerPosition = stage?.getPointerPosition();

    if (!stage || !pointerPosition) return;

    const currentScale = stageScale;
    let updatedScale =
      event.evt.deltaY < 0 ? currentScale * SCALE_BY : currentScale / SCALE_BY;
    if (updatedScale > 1) updatedScale = 1;

    // Calculate the offset of the pointer position relative to the stage position
    const mousePointTo = {
      x: (pointerPosition.x - stagePosition.x) / currentScale,
      y: (pointerPosition.y - stagePosition.y) / currentScale,
    };

    // Update the stage position to keep the pointer position consistent
    const updatedPosition = {
      x: pointerPosition.x - mousePointTo.x * updatedScale,
      y: pointerPosition.y - mousePointTo.y * updatedScale,
    };

    changeStageScale(updatedScale);
    changeStagePosition(updatedPosition, updatedScale);
  };
}
