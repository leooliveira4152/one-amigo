import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";

import { Dimension } from "@/features/playArea/types";
import { usePlayAreaStore } from "@/features/store/playArea";

import { useMapDimensions } from "./useMapDimensions";

const mockStageDimensions = {
  width: faker.number.int(),
  height: faker.number.int(),
};

const mockChangeMapDimensions = jest.fn();
const mockChangeStageScale = jest.fn();
const mockChangeStageDimensions = jest.fn();
const mockUsePlayAreaStore = {
  stageDimensions: mockStageDimensions,
  changeMapDimensions: mockChangeMapDimensions,
  changeStageScale: mockChangeStageScale,
  changeStageDimensions: mockChangeStageDimensions,
};

jest.mock("@/features/store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => mockUsePlayAreaStore),
}));

describe("useMapDimensions", () => {
  const setup = (mapDimensions?: Dimension) =>
    renderHook(() =>
      useMapDimensions(mapDimensions ?? { width: 0, height: 0 })
    );

  it("should not do or call anything if no mapDimension was provided", () => {
    setup();
    expect(mockChangeMapDimensions).not.toHaveBeenCalled();
    expect(mockChangeStageScale).not.toHaveBeenCalled();
    expect(mockChangeStageDimensions).not.toHaveBeenCalled();
  });

  describe("Calculations", () => {
    it("should use the proper values when width difference is higher than height difference", () => {
      const baseValue = faker.number.int();
      const mockMapDimensions = { width: baseValue, height: baseValue };
      const mockStageDimensions = {
        width: baseValue * 2,
        height: baseValue / 2,
      };

      jest.mocked(usePlayAreaStore).mockReturnValueOnce({
        ...mockUsePlayAreaStore,
        stageDimensions: mockStageDimensions,
      } as unknown as ReturnType<typeof usePlayAreaStore>);
      setup(mockMapDimensions);

      const expectedScale =
        mockStageDimensions.height / mockMapDimensions.height;
      expect(mockChangeStageScale).toHaveBeenCalledWith(expectedScale, {
        forceScale: true,
      });
      expect(mockChangeMapDimensions).toHaveBeenCalledWith(mockMapDimensions);
      expect(mockChangeStageDimensions).toHaveBeenCalledWith({
        width: mockMapDimensions.width * expectedScale,
        height: mockMapDimensions.height * expectedScale,
      });
    });

    it("should use the proper values when width difference is lower than height difference", () => {
      const baseValue = faker.number.int();
      const mockMapDimensions = { width: baseValue, height: baseValue };
      const mockStageDimensions = {
        width: baseValue / 3,
        height: baseValue * 3,
      };

      jest.mocked(usePlayAreaStore).mockReturnValueOnce({
        ...mockUsePlayAreaStore,
        stageDimensions: mockStageDimensions,
      } as unknown as ReturnType<typeof usePlayAreaStore>);
      setup(mockMapDimensions);

      const expectedScale = mockStageDimensions.width / mockMapDimensions.width;
      expect(mockChangeStageScale).toHaveBeenCalledWith(expectedScale, {
        forceScale: true,
      });
      expect(mockChangeMapDimensions).toHaveBeenCalledWith(mockMapDimensions);
      expect(mockChangeStageDimensions).toHaveBeenCalledWith({
        width: mockMapDimensions.width * expectedScale,
        height: mockMapDimensions.height * expectedScale,
      });
    });
  });
});
