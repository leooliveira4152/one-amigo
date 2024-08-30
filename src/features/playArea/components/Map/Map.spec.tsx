import { faker } from "@faker-js/faker";
import { render } from "@testing-library/react";
import Konva from "konva";
import { RefObject } from "react";
import { Image, Rect as Rect } from "react-konva";

import { useGetStorageImage } from "@/features/firebase/storage";
import { StorageDirectoriesEnum } from "@/features/firebase/storage/types";
import { generateRandomObject } from "@/testUtils";

import { Map } from "./Map";
import { useMapDimensions, useMobileTouchHandler, useMoveStage } from "./hooks";

const mockUseRefResponse = {} as RefObject<Konva.Rect>;
const mockImageElement = {} as HTMLImageElement;
const mockUseMoveStageResponse = generateRandomObject();
const mockUseMobileTouchHandlerResponse = generateRandomObject();
const mockMapDimensions = {
  width: faker.number.int(),
  height: faker.number.int(),
};

jest.mock("react-konva", () => ({ Image: jest.fn(), Rect: jest.fn() }));

jest.mock("./hooks", () => ({
  useMapDimensions: jest.fn(),
  useMoveStage: jest.fn(() => mockUseMoveStageResponse),
  useMobileTouchHandler: jest.fn(() => mockUseMobileTouchHandlerResponse),
}));

jest.mock("@/features/firebase/storage", () => ({
  useGetStorageImage: jest.fn(() => ({
    imageElement: mockImageElement,
    dimensions: mockMapDimensions,
  })),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => mockUseRefResponse),
}));

describe("<Map />", () => {
  const setup = () => render(<Map />);

  it("should call every required hook with the right props", () => {
    setup();

    expect(useGetStorageImage).toHaveBeenCalledWith(
      // TODO - change it to do it dynamically when doing proper database connection
      `${StorageDirectoriesEnum.MAPS}/00_execucao_pele.jpg`
    );
    expect(useMapDimensions).toHaveBeenCalledWith(mockMapDimensions);
    expect(useMoveStage).toHaveBeenCalledWith(mockUseRefResponse);
    expect(useMobileTouchHandler).toHaveBeenCalledWith(mockUseRefResponse);
  });

  describe("Konva objects calling", () => {
    it("should not call anything if no map was loaded yet", () => {
      jest.mocked(useGetStorageImage).mockReturnValueOnce({
        imageElement: {},
        dimensions: { width: 0, height: 0 },
      } as ReturnType<typeof useGetStorageImage>);

      setup();
      expect(Image).not.toHaveBeenCalled();
      expect(Rect).not.toHaveBeenCalled();
    });

    it("should call the canvas elements with their right props if map is loaded", () => {
      setup();
      expect(Image).toHaveBeenCalledWith(
        expect.objectContaining({ image: mockImageElement }),
        {}
      );
      expect(Rect).toHaveBeenCalledWith(
        expect.objectContaining({
          // TODO - someday figure out how to test if ref was passed
          draggable: true,
          ...mockMapDimensions,
          ...mockUseMoveStageResponse,
          ...mockUseMobileTouchHandlerResponse,
        }),
        {}
      );
    });
  });
});
