import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";
import { KonvaEventObject } from "konva/lib/Node";

import { usePlayAreaStore } from "@/features/store/playArea";
import { mockInteger } from "@/testUtils";

import { useScrollHandler, SCALE_BY } from "./useScrollHandler";

const mockStagePosition = { x: -mockInteger(), y: -mockInteger() };
const mockUsePlayAreaStoreReturn = {
  stageScale: mockInteger(),
  stagePosition: mockStagePosition,
  changeStagePosition: jest.fn(),
  changeStageScale: jest.fn(),
} as unknown as ReturnType<typeof usePlayAreaStore>;

jest.mock("@/features/store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => mockUsePlayAreaStoreReturn),
}));

describe("useScrollHandler", () => {
  const mockPointerPosition = { x: -mockInteger(), y: -mockInteger() };
  const mockWheelEvent = (deltaY: number) =>
    ({
      target: {
        getStage: jest.fn(() => ({
          getPointerPosition: () => mockPointerPosition,
        })),
      },
      evt: { deltaY },
    } as unknown as KonvaEventObject<WheelEvent>);

  const setup = () => renderHook(useScrollHandler);

  it("should NOT call change functions if no pointerPosition is available", () => {
    const { result } = setup();
    result.current({
      target: { getStage: jest.fn() },
    } as unknown as KonvaEventObject<WheelEvent>);

    expect(mockUsePlayAreaStoreReturn.changeStageScale).not.toHaveBeenCalled();
    expect(
      mockUsePlayAreaStoreReturn.changeStagePosition
    ).not.toHaveBeenCalled();
  });

  // Please note that, if deltaY is positive, it isn't possible for the updatedScale to be 1 or greater
  it("should call both changeStagePosition and changeStageScale with the calculated values if deltaY is greater than 0", () => {
    const mockDeltaY = faker.number.int();
    const mockCurrentStageScale = 0.5;
    jest.mocked(usePlayAreaStore).mockReturnValueOnce({
      ...mockUsePlayAreaStoreReturn,
      stageScale: mockCurrentStageScale,
    });

    const { result } = setup();
    result.current(mockWheelEvent(mockDeltaY));
    const expectedUpdatedScale = mockCurrentStageScale / SCALE_BY;

    expect(mockUsePlayAreaStoreReturn.changeStageScale).toHaveBeenCalledWith(
      expectedUpdatedScale
    );
    expect(mockUsePlayAreaStoreReturn.changeStagePosition).toHaveBeenCalledWith(
      {
        x:
          mockPointerPosition.x -
          ((mockPointerPosition.x - mockStagePosition.x) /
            mockCurrentStageScale) *
            expectedUpdatedScale,
        y:
          mockPointerPosition.y -
          ((mockPointerPosition.y - mockStagePosition.y) /
            mockCurrentStageScale) *
            expectedUpdatedScale,
      },
      expectedUpdatedScale
    );
  });

  describe("Cases in which DeltaY is less than 0 (regardless of magnitude)", () => {
    const mockDeltaY = -faker.number.int();
    it("should call both changeStagePosition and changeStageScale with the calculated values", () => {
      const mockCurrentStageScale = 0.5;
      jest.mocked(usePlayAreaStore).mockReturnValueOnce({
        ...mockUsePlayAreaStoreReturn,
        stageScale: mockCurrentStageScale,
      });

      const { result } = setup();
      result.current(mockWheelEvent(mockDeltaY));
      const expectedUpdatedScale = mockCurrentStageScale * SCALE_BY;

      expect(mockUsePlayAreaStoreReturn.changeStageScale).toHaveBeenCalledWith(
        expectedUpdatedScale
      );
      expect(
        mockUsePlayAreaStoreReturn.changeStagePosition
      ).toHaveBeenCalledWith(
        {
          x:
            mockPointerPosition.x -
            ((mockPointerPosition.x - mockStagePosition.x) /
              mockCurrentStageScale) *
              expectedUpdatedScale,
          y:
            mockPointerPosition.y -
            ((mockPointerPosition.y - mockStagePosition.y) /
              mockCurrentStageScale) *
              expectedUpdatedScale,
        },
        expectedUpdatedScale
      );
    });

    it("should call changeStagePosition with its calculated value and changeStageScale with 1 (max allowed scale, to prevent distortions)", () => {
      const mockCurrentStageScale = 0.99;
      jest.mocked(usePlayAreaStore).mockReturnValueOnce({
        ...mockUsePlayAreaStoreReturn,
        stageScale: mockCurrentStageScale,
      });

      const { result } = setup();
      result.current(mockWheelEvent(mockDeltaY));

      expect(mockUsePlayAreaStoreReturn.changeStageScale).toHaveBeenCalledWith(
        1
      );
      expect(
        mockUsePlayAreaStoreReturn.changeStagePosition
      ).toHaveBeenCalledWith(
        {
          x:
            mockPointerPosition.x -
            (mockPointerPosition.x - mockStagePosition.x) /
              mockCurrentStageScale,
          y:
            mockPointerPosition.y -
            (mockPointerPosition.y - mockStagePosition.y) /
              mockCurrentStageScale,
        },
        1
      );
    });
  });
});
