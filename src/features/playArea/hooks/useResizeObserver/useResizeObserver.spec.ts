import { renderHook, waitFor } from "@testing-library/react";
import { RefObject } from "react";

import { usePlayAreaStore } from "@/features/store/playArea";
import { mockInteger } from "@/testUtils";

import { useResizeObserver } from "./useResizeObserver";
import { Dimension } from "../../types";

const mockViewSize = { width: mockInteger(), height: mockInteger() };
const mockContainerRefCurrent = [
  { contentRect: mockViewSize },
] as ResizeObserverEntry[];
const mockContainerRef = {
  current: mockContainerRefCurrent,
} as unknown as RefObject<HTMLDivElement>;

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

const mockUsePlayAreaStoreReturn = {
  mapDimensions: {
    width: mockInteger(),
    height: mockInteger(),
  },
  stageScale: mockInteger(),
  changeStageDimensions: jest.fn(),
  changeStageScale: jest.fn(),
} as unknown as ReturnType<typeof usePlayAreaStore>;

global.ResizeObserver = jest.fn(
  () =>
    ({
      observe: mockObserve,
      disconnect: mockDisconnect,
    } as unknown as ResizeObserver)
);

jest.mock("@mui/material", () => ({ debounce: jest.fn((fn) => fn) }));
jest.mock("@/features/store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => mockUsePlayAreaStoreReturn),
}));

describe("useResizeObserver", () => {
  const setup = () => renderHook(() => useResizeObserver(mockContainerRef));

  const mockResizeObserverCall = (stageSize: Dimension) =>
    jest
      .mocked(global.ResizeObserver)
      .mock.calls[0][0](
        [{ contentRect: stageSize }] as ResizeObserverEntry[],
        {} as ResizeObserver
      );

  const updateUsePlayAreaStoreMock = (
    props: Partial<ReturnType<typeof usePlayAreaStore>>
  ) =>
    jest.mocked(usePlayAreaStore).mockReturnValueOnce({
      ...mockUsePlayAreaStoreReturn,
      ...props,
    } as unknown as ReturnType<typeof usePlayAreaStore>);

  it("should call every required observer function", async () => {
    const { unmount } = setup();
    expect(global.ResizeObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(mockContainerRef.current);
    unmount();
    await waitFor(() => expect(mockDisconnect).toHaveBeenCalled());
  });

  it("should call changeStageDimensions with the stage dimensions unchanged if map dimensions aren't defined", () => {
    updateUsePlayAreaStoreMock({ mapDimensions: { width: 0, height: 0 } });
    setup();
    mockResizeObserverCall(mockViewSize);
    expect(
      mockUsePlayAreaStoreReturn.changeStageDimensions
    ).toHaveBeenCalledWith(mockViewSize);
  });

  // Using fixed arbitrary numbers here GREATLY facilitate the tests, as the calculations are complex
  // Using faker-js here causes the tests to be inconsistent
  describe("State changing when the map dimensions are defined", () => {
    describe("When mapDimensions.width is higher than .height", () => {
      const mockMapDimensions = { width: 200, height: 100 };

      it("should call changeStageDimensions and changeStageScale with their right values if map overflowed", () => {
        const mockStageScale = 0.3;
        updateUsePlayAreaStoreMock({
          mapDimensions: mockMapDimensions,
          stageScale: mockStageScale,
        });

        setup();
        mockResizeObserverCall({ width: 500, height: 150 });

        expect(
          mockUsePlayAreaStoreReturn.changeStageScale
        ).toHaveBeenCalledWith(1.5);
        expect(
          mockUsePlayAreaStoreReturn.changeStageDimensions
        ).toHaveBeenCalledWith({ width: 300, height: 150 });
      });

      it("should call changeStageDimensions with its right values and NOT changeStageScale if map wasn't overflowed", () => {
        const mockStageScale = 2;
        updateUsePlayAreaStoreMock({
          mapDimensions: mockMapDimensions,
          stageScale: mockStageScale,
        });

        setup();
        mockResizeObserverCall({ width: 500, height: 150 });

        expect(
          mockUsePlayAreaStoreReturn.changeStageScale
        ).not.toHaveBeenCalled();
        expect(
          mockUsePlayAreaStoreReturn.changeStageDimensions
        ).toHaveBeenCalledWith({ width: 300, height: 150 });
      });
    });
  });

  describe("When mapDimensions.height is higher than .width", () => {
    const mockMapDimensions = { width: 100, height: 200 };

    it("should call changeStageDimensions and changeStageScale with their right values if map overflowed", () => {
      const mockStageScale = 0.3;
      updateUsePlayAreaStoreMock({
        mapDimensions: mockMapDimensions,
        stageScale: mockStageScale,
      });

      setup();
      mockResizeObserverCall({ width: 100, height: 300 });

      expect(mockUsePlayAreaStoreReturn.changeStageScale).toHaveBeenCalledWith(
        1
      );
      expect(
        mockUsePlayAreaStoreReturn.changeStageDimensions
      ).toHaveBeenCalledWith({ width: 100, height: 200 });
    });

    it("should call changeStageDimensions with its right values and NOT changeStageScale if map wasn't overflowed", () => {
      const mockStageScale = 2;
      updateUsePlayAreaStoreMock({
        mapDimensions: mockMapDimensions,
        stageScale: mockStageScale,
      });

      setup();
      mockResizeObserverCall({ width: 100, height: 300 });

      expect(
        mockUsePlayAreaStoreReturn.changeStageScale
      ).not.toHaveBeenCalled();
      expect(
        mockUsePlayAreaStoreReturn.changeStageDimensions
      ).toHaveBeenCalledWith({ width: 100, height: 200 });
    });
  });
});
