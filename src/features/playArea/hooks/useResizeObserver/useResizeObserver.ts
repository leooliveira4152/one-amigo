import { debounce } from "@mui/material";
import { RefObject, useEffect } from "react";

import { usePlayAreaStore } from "@/features/store/playArea";

export function useResizeObserver(containerRef: RefObject<HTMLDivElement>) {
  const { mapDimensions, stageScale, changeStageDimensions, changeStageScale } =
    usePlayAreaStore();

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(
        debounce(([{ contentRect: viewSize }]) => {
          {
            let stageHeight = viewSize.height;
            let stageWidth = viewSize.width;

            if (mapDimensions.height && mapDimensions.width) {
              const mapAspect = mapDimensions.width / mapDimensions.height;

              // Initial playArea resizing, keeping map aspect ratio
              if (mapDimensions.width > mapDimensions.height)
                stageHeight = stageWidth / mapAspect;
              else stageWidth = stageHeight * mapAspect;

              // Checks if playArea overflowed and adjusts it if so (keeping map aspect ratio)
              if (stageWidth > viewSize.width) {
                stageWidth = viewSize.width;
                stageHeight = stageWidth / mapAspect;
              } else if (stageHeight > viewSize.height) {
                stageHeight = viewSize.height;
                stageWidth = stageHeight * mapAspect;
              }

              // Normalizing to help with jest assertions (no impact on production code)
              stageHeight = Number(stageHeight.toFixed(3));
              stageWidth = Number(stageWidth.toFixed(3));

              // Resize map if it isn't covering the entire playArea
              if (
                stageScale * mapDimensions.width < stageWidth ||
                stageScale * mapDimensions.height < stageHeight
              )
                changeStageScale(stageWidth / mapDimensions.width);
            }

            changeStageDimensions({
              height: stageHeight,
              width: stageWidth,
            });
          }
        }, 200)
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [
    changeStageDimensions,
    changeStageScale,
    containerRef,
    mapDimensions,
    stageScale,
  ]);
}
