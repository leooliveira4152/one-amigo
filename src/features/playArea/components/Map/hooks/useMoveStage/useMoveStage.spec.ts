import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { RefObject } from "react";

import { usePlayAreaStore } from "@/features/store/playArea";

import { useMoveStage } from "./useMoveStage";

const mockChangeStagePosition = jest.fn();
const mockChangePointer = jest.fn();
const mockDraggableRefPosition = jest.fn();
const mockDraggableRef = {
  current: { position: mockDraggableRefPosition },
} as unknown as RefObject<Konva.Rect>;
const mockUsePlayAreaStoreReturn = {
  mapDimensions: { width: faker.number.int(), height: faker.number.int() },
  changeStagePosition: mockChangeStagePosition,
  changePointer: mockChangePointer,
};

jest.mock("@/features/store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => mockUsePlayAreaStoreReturn),
}));

describe("useMoveStage", () => {
  const mockDragPosition = { x: faker.number.int(), y: faker.number.int() };
  const mockDragMoveEvent = {
    target: { _lastPos: mockDragPosition },
  } as KonvaEventObject<DragEvent>;

  const setup = (draggableRef?: RefObject<Konva.Rect>) =>
    renderHook(() => useMoveStage(draggableRef ?? mockDraggableRef));

  it("should change the stage to its new position and then reset the draggableRef position", () => {
    const { result } = setup();
    result.current.onDragMove(mockDragMoveEvent);
    expect(mockChangeStagePosition).toHaveBeenCalledWith(mockDragPosition);
    expect(mockDraggableRefPosition).toHaveBeenCalledWith({ x: 0, y: 0 });
  });

  describe("Cases in which the dragMove shouldn't trigger anything", () => {
    it("should NOT change stagePosition if no lastPos was provided", () => {
      const { result } = setup();
      result.current.onDragMove({
        target: {},
      } as KonvaEventObject<DragEvent>);
      expect(mockChangeStagePosition).not.toHaveBeenCalled();
    });

    it("should NOT change stagePosition if no draggableRef was provided", () => {
      const { result } = setup({} as RefObject<Konva.Rect>);
      result.current.onDragMove(mockDragMoveEvent);
      expect(mockChangeStagePosition).not.toHaveBeenCalled();
    });

    it("should NOT change stagePosition if no mapDimensions were loaded (yet)", () => {
      jest.mocked(usePlayAreaStore).mockReturnValueOnce({
        ...mockUsePlayAreaStoreReturn,
        mapDimensions: { width: 0, height: 0 },
      } as unknown as ReturnType<typeof usePlayAreaStore>);
      const { result } = setup();
      result.current.onDragMove(mockDragMoveEvent);
      expect(mockChangeStagePosition).not.toHaveBeenCalled();
    });
  });

  it("should change the pointer then drag starts and/or ends", () => {
    const { result } = setup();
    result.current.onDragStart();
    expect(mockChangePointer).toHaveBeenCalledWith("grabbing");

    result.current.onDragEnd();
    expect(mockChangePointer).toHaveBeenCalledWith("default");
  });
});
