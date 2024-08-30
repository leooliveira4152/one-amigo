"use client";

import { useRef } from "react";
import { Layer, Stage } from "react-konva";

import { Map, Background } from "./components";
import { useResizeObserver, useScrollHandler } from "./hooks";
import { usePlayAreaStore } from "../store/playArea";

// TODO - Test how this works on mobile

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
          onWheel={onWheel}
          {...stagePosition}>
          <Map />
        </Layer>
      </Stage>
    </div>
  );
}
