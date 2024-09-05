import Konva from "konva";
import { useRef } from "react";
import { Image, Rect } from "react-konva";

import {
  StorageDirectoriesEnum,
  useGetStorageImage,
} from "@/features/firebase/storage";

import { useMapDimensions, useMobileTouchHandler, useMoveStage } from "./hooks";

export function Map() {
  const { imageElement: mapImage, dimensions: mapDimensions } =
    useGetStorageImage(`${StorageDirectoriesEnum.MAPS}/00_execucao_pele.jpg`);

  const draggableRef = useRef<Konva.Rect>(null);

  useMapDimensions(mapDimensions);
  const stageMovementProperties = useMoveStage(draggableRef);
  const mobileStageMovementProperties = useMobileTouchHandler(draggableRef);
  if (!mapDimensions?.width || !mapDimensions?.height) return null;

  return (
    <>
      <Image alt="map" image={mapImage} />
      <Rect
        ref={draggableRef}
        width={mapDimensions.width}
        height={mapDimensions.height}
        draggable
        {...stageMovementProperties}
        {...mobileStageMovementProperties}
      />
    </>
  );
}
