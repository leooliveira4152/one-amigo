import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";
import { KonvaEventObject } from "konva/lib/Node";

import { moveCharacter } from "@/features/firebase/database";
import { Coordinates } from "@/features/playArea";
import { mockInteger } from "@/testUtils";

import { useDragHandler } from "./useDragHandler";

const mockCoordinates = { x: mockInteger(), y: mockInteger() };
const mockPlayAreaKey = faker.string.alpha();
const mockSetCoordinates = jest.fn();

const mockChangeState = jest.fn();
const mockPlayAreaStoreReturn = {
  stageScale: mockInteger(),
  stagePosition: { x: mockInteger(), y: mockInteger() },
};

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn((value) => [value, mockChangeState]),
}));

jest.mock("@/features/firebase/database");
jest.mock("@/features/store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => mockPlayAreaStoreReturn),
}));

describe("useDragHandler", () => {
  const setup = () =>
    renderHook(() =>
      useDragHandler({
        ...mockCoordinates,
        playAreaKey: mockPlayAreaKey,
        setCoordinates: mockSetCoordinates,
      })
    );

  const createMockEvent = (pointerPosition?: Coordinates) =>
    ({
      target: {
        getStage: () => ({ getPointerPosition: () => pointerPosition }),
      },
    } as unknown as KonvaEventObject<DragEvent>);

  describe("onDragStart", () => {
    it("should call setDragOffset with the expected value", () => {
      const mockPointerPosition = { x: mockInteger(), y: mockInteger() };
      const { result } = setup();
      result.current.onDragStart(createMockEvent(mockPointerPosition));
      expect(mockChangeState).toHaveBeenCalledWith({
        x:
          mockPointerPosition.x -
          (mockCoordinates.x * mockPlayAreaStoreReturn.stageScale +
            mockPlayAreaStoreReturn.stagePosition.x),
        y:
          mockPointerPosition.y -
          (mockCoordinates.y * mockPlayAreaStoreReturn.stageScale +
            mockPlayAreaStoreReturn.stagePosition.y),
      });
    });

    it("should NOT call setDragOffset if no pointerPosition was found", () => {
      const { result } = setup();
      result.current.onDragStart(createMockEvent());
      expect(mockChangeState).not.toHaveBeenCalled();
    });
  });

  describe("onDragMove", () => {
    it("should call setCoordinates with the expected value", () => {
      const mockPointerPosition = { x: mockInteger(), y: mockInteger() };
      const { result } = setup();
      result.current.onDragMove(createMockEvent(mockPointerPosition));
      expect(mockSetCoordinates).toHaveBeenCalledWith({
        x:
          (mockPointerPosition.x - mockPlayAreaStoreReturn.stagePosition.x) /
          mockPlayAreaStoreReturn.stageScale,
        y:
          (mockPointerPosition.y - mockPlayAreaStoreReturn.stagePosition.y) /
          mockPlayAreaStoreReturn.stageScale,
      });
    });

    it("should NOT call setCoordinates if no pointerPosition was found", () => {
      const { result } = setup();
      result.current.onDragMove(createMockEvent());
      expect(mockSetCoordinates).not.toHaveBeenCalled();
    });
  });

  describe("onDragEnd", () => {
    it("should call setCoordinates and moveCharacter with the right values", () => {
      const mockPointerPosition = {
        x: mockInteger() * 10,
        y: mockInteger() * 10,
      };
      const { result } = setup();
      result.current.onDragEnd(createMockEvent(mockPointerPosition));

      const newPosition = {
        x:
          (mockPointerPosition.x - mockPlayAreaStoreReturn.stagePosition.x) /
          mockPlayAreaStoreReturn.stageScale,
        y:
          (mockPointerPosition.y - mockPlayAreaStoreReturn.stagePosition.y) /
          mockPlayAreaStoreReturn.stageScale,
      };
      expect(mockSetCoordinates).toHaveBeenCalledWith(newPosition);
      expect(moveCharacter).toHaveBeenCalledWith(mockPlayAreaKey, newPosition);
    });

    it("should call setCoordinates with 0 if the values overflowed", () => {
      const mockPointerPosition = {
        x: mockInteger() * -10,
        y: mockInteger() * -10,
      };
      const { result } = setup();
      result.current.onDragEnd(createMockEvent(mockPointerPosition));

      const newPosition = { x: 0, y: 0 };
      expect(mockSetCoordinates).toHaveBeenCalledWith(newPosition);
      expect(moveCharacter).toHaveBeenCalledWith(mockPlayAreaKey, newPosition);
    });

    it("should NOT call setCoordinates nor moveCharacter if no pointerPosition was found", () => {
      const { result } = setup();
      result.current.onDragEnd(createMockEvent());
      expect(mockSetCoordinates).not.toHaveBeenCalled();
      expect(moveCharacter).not.toHaveBeenCalled();
    });
  });
});
