import { useEffect } from "react";

import { Dimension } from "@/features/playArea";
import { usePlayAreaStore } from "@/features/store/playArea";

export function useMapDimensions(mapDimensions?: Dimension) {
  const {
    stageDimensions,
    changeMapDimensions,
    changeStageScale,
    changeStageDimensions,
  } = usePlayAreaStore();

  return useEffect(() => {
    if (!mapDimensions?.height || !mapDimensions.width) return;

    const dimensionsDifferences = {
      width: stageDimensions.width - mapDimensions.width,
      height: stageDimensions.height - mapDimensions.height,
    };

    let scale = 1;
    if (dimensionsDifferences.width > dimensionsDifferences.height)
      scale = stageDimensions.height / mapDimensions.height;
    else scale = stageDimensions.width / mapDimensions.width;

    changeStageScale(scale, { forceScale: true });
    changeMapDimensions(mapDimensions);
    changeStageDimensions({
      width: mapDimensions.width * scale,
      height: mapDimensions.height * scale,
    });

    // Should only trigger on map load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapDimensions]);
}
