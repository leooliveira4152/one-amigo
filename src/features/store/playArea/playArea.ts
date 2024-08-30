import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Property } from "csstype";

import { Coordinates, Dimension } from "@/features/playArea";

import { useAppDispatch, useAppSelector } from "../store";

type PlayAreaState = {
  playArea: {
    cursor: Property.Cursor;
    mapDimensions: Dimension;
    stageDimensions: Dimension;
    stageScale: number;
    stagePosition: Coordinates;
  };
};

const initialState: PlayAreaState = {
  playArea: {
    cursor: "default",
    mapDimensions: { width: 0, height: 0 },
    stageDimensions: { width: 0, height: 0 },
    stageScale: 1,
    stagePosition: { x: 0, y: 0 },
  },
};

export const playAreaSlice = createSlice({
  name: "playArea",
  initialState,
  reducers: {
    changePointer: (state, action: PayloadAction<Property.Cursor>) => {
      state.playArea.cursor = action.payload;
    },
    changeMapDimensions: (state, action: PayloadAction<Dimension>) => {
      state.playArea.mapDimensions.width = action.payload.width;
      state.playArea.mapDimensions.height = action.payload.height;
    },
    changeStageDimensions: (state, action: PayloadAction<Dimension>) => {
      state.playArea.stageDimensions.width = action.payload.width;
      state.playArea.stageDimensions.height = action.payload.height;
    },
    changeStageScale: (state, action: PayloadAction<number>) => {
      state.playArea.stageScale = action.payload;
    },
    changeStagePosition: (state, action: PayloadAction<Coordinates>) => {
      state.playArea.stagePosition = action.payload;
    },
  },
});

export const usePlayAreaStore = () => {
  const values = useAppSelector((state) => state.playArea);
  const dispatch = useAppDispatch();

  return {
    ...values.playArea,
    changePointer: (cursor: Property.Cursor) =>
      dispatch(playAreaSlice.actions.changePointer(cursor)),
    changeMapDimensions: (dimensions: Dimension) =>
      dispatch(playAreaSlice.actions.changeMapDimensions(dimensions)),
    changeStageDimensions: (dimensions: Dimension) =>
      dispatch(playAreaSlice.actions.changeStageDimensions(dimensions)),
    changeStageScale: (scale: number, options?: { forceScale: boolean }) => {
      const mapDimensions = values.playArea.mapDimensions;
      const stageDimensions = values.playArea.stageDimensions;

      const mapOverflow =
        scale * mapDimensions.width < stageDimensions.width ||
        scale * mapDimensions.height < stageDimensions.height;

      // Should not resize in a way that the screen isn't covered by map
      // The initial map resize doesn't have the right params defined, so we should force the rescale
      if (mapOverflow && !options?.forceScale) {
        const dimensionsDifferences = {
          width: stageDimensions.width - mapDimensions.width,
          height: stageDimensions.height - mapDimensions.height,
        };

        if (dimensionsDifferences.width > dimensionsDifferences.height)
          scale = stageDimensions.height / mapDimensions.height;
        else scale = stageDimensions.width / mapDimensions.width;
      }

      dispatch(playAreaSlice.actions.changeStageScale(scale));
    },
    changeStagePosition: (position: Coordinates, updatedScale?: number) => {
      const {
        mapDimensions,
        stageDimensions,
        stageScale: _stageScale,
      } = values.playArea;
      const stageScale = updatedScale ?? _stageScale;

      // prevents stage view from going OoB by the right
      // to obtain the right position, we change the comparison from "<" to "=" and then isolate the position
      const xOverflow =
        mapDimensions.width * stageScale + position.x < stageDimensions.width;
      const yOverflow =
        mapDimensions.height * stageScale + position.y < stageDimensions.height;
      if (xOverflow)
        position.x = stageDimensions.width - mapDimensions.width * stageScale;
      if (yOverflow)
        position.y = stageDimensions.height - mapDimensions.height * stageScale;

      // prevents stage view from going OoB by the left
      if (position.x > 0) position.x = 0;
      if (position.y > 0) position.y = 0;

      dispatch(playAreaSlice.actions.changeStagePosition(position));
    },
  };
};
