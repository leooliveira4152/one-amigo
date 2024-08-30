import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, { RefObject } from "react";

import { Coordinates } from "@/features/playArea/types";

import { useMobileTouchHandler } from "./useMobileTouchHandler";

// Using big int scales messes with minor calculations
const mockStageScale = faker.number.int({ max: 10 });
const mockStagePosition = {
  x: faker.number.int({ max: 10 }),
  y: faker.number.int({ max: 10 }),
};
const mockChangeStageScale = jest.fn();
const mockChangeStagePosition = jest.fn();
const mockDraggableRef = {
  current: { stopDrag: jest.fn() },
} as unknown as RefObject<Konva.Rect>;

jest.mock("@/features/store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => ({
    stageScale: mockStageScale,
    stagePosition: mockStagePosition,
    changeStageScale: mockChangeStageScale,
    changeStagePosition: mockChangeStagePosition,
  })),
}));

describe("useMobileTouchHandler", () => {
  type TouchEventCoordinates = { clientX: number; clientY: number };
  const pinchEvent = (
    pinchCoordinates: [TouchEventCoordinates, TouchEventCoordinates]
  ) =>
    ({
      evt: { touches: pinchCoordinates, preventDefault: jest.fn() },
    } as unknown as KonvaEventObject<TouchEvent>);

  const getPointerCoordinates = (touchCoordinates: TouchEventCoordinates) => ({
    x: touchCoordinates.clientX,
    y: touchCoordinates.clientY,
  });

  const firstPinchCoordinates: [TouchEventCoordinates, TouchEventCoordinates] =
    [
      {
        clientX: faker.number.int({ max: 10 }),
        clientY: faker.number.int({ max: 10 }),
      },
      {
        clientX: faker.number.int({ max: 10 }),
        clientY: faker.number.int({ max: 10 }),
      },
    ];
  const secondPinchCoordinates: [TouchEventCoordinates, TouchEventCoordinates] =
    [
      {
        clientX: faker.number.int({ max: 10 }),
        clientY: faker.number.int({ max: 10 }),
      },
      {
        clientX: faker.number.int({ max: 10 }),
        clientY: faker.number.int({ max: 10 }),
      },
    ];

  const initialCenter = getCenter(
    getPointerCoordinates(firstPinchCoordinates[0]),
    getPointerCoordinates(firstPinchCoordinates[1])
  );
  const initialDistance = getDistance(
    getPointerCoordinates(firstPinchCoordinates[0]),
    getPointerCoordinates(firstPinchCoordinates[1])
  );

  const updatedCenter = getCenter(
    getPointerCoordinates(secondPinchCoordinates[0]),
    getPointerCoordinates(secondPinchCoordinates[1])
  );
  const updatedDistance = getDistance(
    getPointerCoordinates(secondPinchCoordinates[0]),
    getPointerCoordinates(secondPinchCoordinates[1])
  );
  const updatedScale =
    mockStageScale * (updatedDistance / initialDistance) ** 0.75;

  const setup = (draggableRef?: RefObject<Konva.Rect>) =>
    renderHook(() => useMobileTouchHandler(draggableRef ?? mockDraggableRef));

  it("should call the change functions with their right props ONLY after calculations", () => {
    const { result, rerender } = setup();
    result.current.onTouchMove(pinchEvent(firstPinchCoordinates));

    // First function call sets the initial props, but doesn't calculate the new scale or position yet
    expect(mockDraggableRef.current?.stopDrag).toHaveBeenCalled();
    expect(mockChangeStageScale).not.toHaveBeenCalled();
    expect(mockChangeStagePosition).not.toHaveBeenCalled();

    rerender();
    result.current.onTouchMove(pinchEvent(secondPinchCoordinates));
    expect(mockChangeStageScale).toHaveBeenCalledWith(updatedScale);
    expect(mockChangeStagePosition).toHaveBeenCalledWith({
      x: Number(
        (
          updatedCenter.x -
          (updatedScale * (updatedCenter.x - mockStagePosition.x)) /
            mockStageScale -
          (updatedCenter.x - initialCenter.x) / 5
        ).toFixed(3)
      ),
      y: Number(
        (
          updatedCenter.y -
          (updatedScale * (updatedCenter.y - mockStagePosition.y)) /
            mockStageScale -
          (updatedCenter.y - initialCenter.y) / 5
        ).toFixed(3)
      ),
    });
  });

  it("should have a callable onTouchEnd prop that resets the temporary position props", () => {
    const mockStateChanger = jest.fn();
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => ["", mockStateChanger]);

    const { result } = setup();
    expect(result.current.onTouchEnd).toBeInstanceOf(Function);

    result.current.onTouchEnd();
    expect(mockStateChanger).toHaveBeenCalledWith(undefined);
  });

  describe("Cases in which the rescale/move functions doesn't trigger", () => {
    type Normalizer = [TouchEventCoordinates, TouchEventCoordinates];
    const requiredFunctions = [
      mockDraggableRef.current?.stopDrag,
      mockChangeStageScale,
      mockChangeStagePosition,
    ];

    it("should NOT trigger the required function if no touch2 was passed (user pressed the screen with one finger)", () => {
      const { result, rerender } = setup();
      result.current.onTouchMove(
        pinchEvent([firstPinchCoordinates[0]] as unknown as Normalizer)
      );
      rerender();
      result.current.onTouchMove(
        pinchEvent([secondPinchCoordinates[0]] as unknown as Normalizer)
      );

      requiredFunctions.forEach((requiredFunction) =>
        expect(requiredFunction).not.toHaveBeenCalled()
      );
    });

    it("should NOT trigger the required function if no stage was passed (some issue with draggableRef)", () => {
      const { result, rerender } = setup(
        {} as unknown as RefObject<Konva.Rect>
      );
      result.current.onTouchMove(pinchEvent(firstPinchCoordinates));
      rerender();
      result.current.onTouchMove(pinchEvent(secondPinchCoordinates));

      requiredFunctions.forEach((requiredFunction) =>
        expect(requiredFunction).not.toHaveBeenCalled()
      );
    });
  });
});

function getDistance(p1: Coordinates, p2: Coordinates) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1: Coordinates, p2: Coordinates) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}
