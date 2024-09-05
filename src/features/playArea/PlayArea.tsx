"use client";

import { useRef } from "react";
import { Layer, Stage } from "react-konva";

import { Map, Background, Entities } from "./components";
import { useResizeObserver, useScrollHandler } from "./hooks";
import { usePlayAreaStore } from "../store/playArea";

export function PlayArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cursor, stageDimensions, stageScale, stagePosition } =
    usePlayAreaStore();

  const onWheel = useScrollHandler();
  useResizeObserver(containerRef);

  return (
    <div
      ref={containerRef}
      className="h-full w-full flex justify-center items-center flex-col">
      <Stage
        // Using border instead of outline messes with the stage resizing process
        className="box-content outline-2 outline-white outline"
        style={{ cursor }}
        {...stageDimensions}>
        <Background />
        <Layer
          scaleX={stageScale}
          scaleY={stageScale}
          // Be aware that, as of 30-08-2024, Brave Shield blocks onWheel for some reason
          onWheel={onWheel}
          {...stagePosition}>
          <Map />
          <Entities />
        </Layer>
      </Stage>
    </div>
  );
}
