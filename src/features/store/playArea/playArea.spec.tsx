import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";
import { Property } from "csstype";

import { mockInteger } from "@/test/testUtils";

import { playAreaSlice, usePlayAreaStore } from "./playArea";
import { useAppSelector } from "../store";

const mockInitialState = {
  playArea: {
    cursor: "default",
    mapDimensions: { width: 0, height: 0 },
    stageDimensions: { width: 0, height: 0 },
    stageScale: 1,
    stagePosition: { x: 0, y: 0 },
  },
};

const mockDispatch = jest.fn();
const mockStageScale = mockInteger();
const mockMapDimensions = { width: mockInteger(), height: mockInteger() };
const mockStageDimensions = {
  width: mockMapDimensions.width / 3,
  height: mockMapDimensions.height / 3,
};
const mockStagePosition = { x: mockInteger(), y: mockInteger() };

const mockAppSelectorReturn = {
  playArea: {
    ...mockInitialState.playArea,
    mapDimensions: mockMapDimensions,
    stageDimensions: mockStageDimensions,
  },
};

jest.mock("../store", () => ({
  useAppDispatch: jest.fn(() => mockDispatch),
  useAppSelector: jest.fn(() => mockAppSelectorReturn),
}));

describe("playArea", () => {
  describe("playAreaSlice", () => {
    it("should handle changePointer", () => {
      const action = playAreaSlice.actions.changePointer("pointer" as Property.Cursor);
      const state = playAreaSlice.reducer(mockInitialState, action);
      expect(state.playArea.cursor).toBe("pointer");
    });

    it("should handle changeMapDimensions", () => {
      const action = playAreaSlice.actions.changeMapDimensions(mockMapDimensions);
      const state = playAreaSlice.reducer(mockInitialState, action);
      expect(state.playArea.mapDimensions).toEqual(mockMapDimensions);
    });

    it("should handle changeStageDimensions", () => {
      const action = playAreaSlice.actions.changeStageDimensions(mockStageDimensions);
      const state = playAreaSlice.reducer(mockInitialState, action);
      expect(state.playArea.stageDimensions).toEqual(mockStageDimensions);
    });

    it("should handle changeStageScale", () => {
      const action = playAreaSlice.actions.changeStageScale(mockStageScale);
      const state = playAreaSlice.reducer(mockInitialState, action);
      expect(state.playArea.stageScale).toBe(mockStageScale);
    });

    it("should handle changeStagePosition", () => {
      const action = playAreaSlice.actions.changeStagePosition(mockStagePosition);
      const state = playAreaSlice.reducer(mockInitialState, action);
      expect(state.playArea.stagePosition).toEqual(mockStagePosition);
    });
  });

  describe("usePlayAreaStore", () => {
    const setup = () => renderHook(() => usePlayAreaStore());

    it("should return the correct initial values", () => {
      const { result } = setup();
      expect(result.current.cursor).toBe("default");
      expect(result.current.mapDimensions).toEqual(mockMapDimensions);
      expect(result.current.stageDimensions).toEqual(mockStageDimensions);
      expect(result.current.stageScale).toBe(mockInitialState.playArea.stageScale);
      expect(result.current.stagePosition).toEqual(
        mockInitialState.playArea.stagePosition
      );
    });

    it("should dispatch changePointer action", () => {
      const cursorType = "pointer";
      const { result } = setup();
      result.current.changePointer(cursorType as Property.Cursor);
      expect(mockDispatch).toHaveBeenCalledWith(
        playAreaSlice.actions.changePointer(cursorType)
      );
    });

    it("should dispatch changeMapDimensions action", () => {
      const mockUpdatedMapDimensions = {
        width: mockInteger(),
        height: mockInteger(),
      };

      const { result } = setup();
      result.current.changeMapDimensions(mockUpdatedMapDimensions);
      expect(mockDispatch).toHaveBeenCalledWith(
        playAreaSlice.actions.changeMapDimensions(mockUpdatedMapDimensions)
      );
    });

    it("should dispatch changeStageDimensions action", () => {
      const mockUpdatedMapDimensions = {
        width: mockInteger(),
        height: mockInteger(),
      };

      const { result } = setup();
      result.current.changeStageDimensions(mockUpdatedMapDimensions);
      expect(mockDispatch).toHaveBeenCalledWith(
        playAreaSlice.actions.changeStageDimensions(mockUpdatedMapDimensions)
      );
    });

    describe("changeStageScale", () => {
      it("should call the dispatch with the right params if the map wasn't overflowed", () => {
        const mockUpdatedScale = mockInteger();
        jest.mocked(useAppSelector).mockReturnValueOnce({
          playArea: {
            mapDimensions: {
              width: mockUpdatedScale,
              height: mockUpdatedScale,
            },
            stageDimensions: {
              width: mockUpdatedScale,
              height: mockUpdatedScale,
            },
          },
        });

        const { result } = setup();
        result.current.changeStageScale(mockUpdatedScale);
        expect(mockDispatch).toHaveBeenCalledWith(
          playAreaSlice.actions.changeStageScale(mockUpdatedScale)
        );
      });

      describe("Stage size is higher than the map", () => {
        const MAX_INT = 10;
        const mockUpdatedScale = faker.number.int({ max: 10, min: 1 });

        describe("Overflow happening by width", () => {
          const mockPlayArea = {
            playArea: {
              mapDimensions: {
                width: mockUpdatedScale / (3 * MAX_INT),
                height: mockUpdatedScale,
              },
              stageDimensions: {
                width: mockUpdatedScale * 2 * MAX_INT,
                height: mockUpdatedScale,
              },
            },
          };

          it("should limit the change scale if forceScale isn't true", () => {
            jest.mocked(useAppSelector).mockReturnValueOnce(mockPlayArea);
            const {
              playArea: { stageDimensions, mapDimensions },
            } = mockPlayArea;
            const { result } = setup();
            result.current.changeStageScale(mockUpdatedScale);

            const dimensionsDifferences = {
              width: stageDimensions.width - mapDimensions.width,
              height: stageDimensions.height - mapDimensions.height,
            };

            let scale = mockUpdatedScale;
            if (dimensionsDifferences.width > dimensionsDifferences.height)
              scale = stageDimensions.height / mapDimensions.height;
            else scale = stageDimensions.width / mapDimensions.width;
            expect(mockDispatch).toHaveBeenCalledWith(
              playAreaSlice.actions.changeStageScale(scale)
            );
          });

          it("should change scale if forceScale is true", () => {
            jest.mocked(useAppSelector).mockReturnValueOnce(mockPlayArea);
            const { result } = setup();
            result.current.changeStageScale(mockUpdatedScale, {
              forceScale: true,
            });
            expect(mockDispatch).toHaveBeenCalledWith(
              playAreaSlice.actions.changeStageScale(mockUpdatedScale)
            );
          });
        });

        describe("Overflow happening by height", () => {
          const mockPlayArea = {
            playArea: {
              mapDimensions: {
                width: mockUpdatedScale,
                height: mockUpdatedScale / (3 * MAX_INT),
              },
              stageDimensions: {
                width: mockUpdatedScale,
                height: mockUpdatedScale * 2 * MAX_INT,
              },
            },
          };

          it("should limit the change scale if forceScale isn't true", () => {
            jest.mocked(useAppSelector).mockReturnValueOnce(mockPlayArea);
            const {
              playArea: { stageDimensions, mapDimensions },
            } = mockPlayArea;
            const { result } = setup();
            result.current.changeStageScale(mockUpdatedScale);

            const dimensionsDifferences = {
              width: stageDimensions.width - mapDimensions.width,
              height: stageDimensions.height - mapDimensions.height,
            };

            let scale = mockUpdatedScale;
            if (dimensionsDifferences.width > dimensionsDifferences.height)
              scale = stageDimensions.height / mapDimensions.height;
            else scale = stageDimensions.width / mapDimensions.width;
            expect(mockDispatch).toHaveBeenCalledWith(
              playAreaSlice.actions.changeStageScale(scale)
            );
          });
          it("should change scale if forceScale is true", () => {
            jest.mocked(useAppSelector).mockReturnValueOnce(mockPlayArea);
            const { result } = setup();
            result.current.changeStageScale(mockUpdatedScale, {
              forceScale: true,
            });
            expect(mockDispatch).toHaveBeenCalledWith(
              playAreaSlice.actions.changeStageScale(mockUpdatedScale)
            );
          });
        });
      });
    });

    describe("changeStagePosition", () => {
      const limitPosition = {
        x:
          mockStageDimensions.width -
          mockMapDimensions.width * mockInitialState.playArea.stageScale,
        y:
          mockStageDimensions.height -
          mockMapDimensions.height * mockInitialState.playArea.stageScale,
      };

      it("should call the dispatch with the right params if no overflow was detected", () => {
        const { result } = setup();
        const mockUpdatedPosition = limitPosition;
        result.current.changeStagePosition(mockUpdatedPosition);
        expect(mockDispatch).toHaveBeenCalledWith(
          playAreaSlice.actions.changeStagePosition(mockUpdatedPosition)
        );
      });

      it("should call the dispatch with the right params if no overflow was detected and a new scale was passed", () => {
        const mockUpdatedStagePosition = mockInteger();
        const mockUpdatedPosition = {
          x:
            mockStageDimensions.width -
            mockMapDimensions.width * mockUpdatedStagePosition,
          y:
            mockStageDimensions.height -
            mockMapDimensions.height * mockUpdatedStagePosition,
        };

        const { result } = setup();
        result.current.changeStagePosition(mockUpdatedPosition, mockUpdatedStagePosition);
        expect(mockDispatch).toHaveBeenCalledWith(
          playAreaSlice.actions.changeStagePosition(mockUpdatedPosition)
        );
      });

      describe("Stage position goes past the map", () => {
        describe("Overflow happening by width", () => {
          it("should use 0 as the value if overflowed by the left", () => {
            const { result } = setup();
            const mockUpdatedPosition = {
              x: mockInteger(),
              y: limitPosition.y,
            };
            result.current.changeStagePosition(mockUpdatedPosition);
            expect(mockDispatch).toHaveBeenCalledWith(
              playAreaSlice.actions.changeStagePosition({
                x: 0,
                y: mockUpdatedPosition.y,
              })
            );
          });

          it("should use the capped value if overflowed by the right", () => {
            const { result } = setup();
            const mockUpdatedPosition = {
              x: limitPosition.x - 1,
              y: limitPosition.y,
            };

            result.current.changeStagePosition(mockUpdatedPosition);
            expect(mockDispatch).toHaveBeenCalledWith(
              playAreaSlice.actions.changeStagePosition({
                x: limitPosition.x,
                y: mockUpdatedPosition.y,
              })
            );
          });
        });

        describe("Overflow happening by height", () => {
          it("should use 0 as the value if overflowed by the top", () => {
            const { result } = setup();
            const mockUpdatedPosition = {
              x: limitPosition.x,
              y: mockInteger(),
            };
            result.current.changeStagePosition(mockUpdatedPosition);
            expect(mockDispatch).toHaveBeenCalledWith(
              playAreaSlice.actions.changeStagePosition({
                x: mockUpdatedPosition.x,
                y: 0,
              })
            );
          });

          it("should use the capped value if overflowed by the bottom", () => {
            const { result } = setup();
            const mockUpdatedPosition = {
              x: limitPosition.x,
              y: limitPosition.y - 1,
            };

            result.current.changeStagePosition(mockUpdatedPosition);
            expect(mockDispatch).toHaveBeenCalledWith(
              playAreaSlice.actions.changeStagePosition({
                x: mockUpdatedPosition.x,
                y: limitPosition.y,
              })
            );
          });
        });
      });
    });
  });
});
