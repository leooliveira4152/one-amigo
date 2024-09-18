import { faker } from "@faker-js/faker";
import { render } from "@testing-library/react";
import { Layer, Rect } from "react-konva";
import useImage from "use-image";

import { Background, backgroundImageScale } from "./Background";

const mockDimensions = {
  width: faker.number.int(),
  height: faker.number.int(),
};

jest.mock("react-konva", () => ({
  Layer: jest.fn(({ children }) => <>{children}</>),
  Rect: jest.fn(),
}));

jest.mock("@/features/store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => ({ stageDimensions: mockDimensions })),
}));

jest.mock("use-image");

describe("<Background />", () => {
  const mockBackgroundImage = {} as HTMLImageElement;
  jest.mocked(useImage).mockReturnValue([mockBackgroundImage, "loaded"]);
  const setup = () => render(<Background />);

  it("should call the canvas components with their right props", () => {
    setup();
    expect(Layer).toHaveBeenCalled();
    expect(Rect).toHaveBeenCalledWith(
      expect.objectContaining({
        alt: "background",
        fillPatternImage: mockBackgroundImage,
        fillPatternRepeat: "repeat",
        fillPatternScale: { x: backgroundImageScale, y: backgroundImageScale },
      }),
      {},
    );
  });
});
