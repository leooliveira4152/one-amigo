import { faker } from "@faker-js/faker";
import { render } from "@testing-library/react";
import { RefObject } from "react";
import { Layer, Stage } from "react-konva";

import { PlayArea } from "./PlayArea";
import { Background, Entities, Map } from "./components";
import { useResizeObserver } from "./hooks";
import { usePlayAreaStore } from "../store/playArea";

const mockContainerRef = {} as RefObject<HTMLDivElement>;
const mockOnWheel = jest.fn();
const mockCursor = faker.string.alpha();
const mockStageScale = faker.number.int();
const mockStagePosition = { x: -faker.number.int(), y: -faker.number.int() };
const mockStageDimensions = {
  width: faker.number.int(),
  height: faker.number.int(),
};

const mockUsePlayAreaStoreReturn = {
  cursor: mockCursor,
  stageDimensions: mockStageDimensions,
  stageScale: mockStageScale,
  stagePosition: mockStagePosition,
} as unknown as ReturnType<typeof usePlayAreaStore>;

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => mockContainerRef),
}));
jest.mock("react-konva", () => ({
  Stage: jest.fn(({ children }) => <>{children}</>),
  Layer: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock("./components");
jest.mock("./hooks", () => ({
  useResizeObserver: jest.fn(),
  useScrollHandler: jest.fn(() => mockOnWheel),
}));
jest.mock("../store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => mockUsePlayAreaStoreReturn),
}));

describe("<PlayArea />", () => {
  const setup = () => render(<PlayArea />);

  it("should call the custom components regardless of any condition", () => {
    setup();
    expect(Background).toHaveBeenCalled();
    expect(Map).toHaveBeenCalled();
    expect(Entities).toHaveBeenCalled();
  });

  it("should call useResizeObserver with the containerRef", () => {
    setup();
    expect(useResizeObserver).toHaveBeenCalledWith(mockContainerRef);
  });

  it("should call every Konva component with the required params", () => {
    setup();
    expect(Stage).toHaveBeenCalledWith(
      expect.objectContaining({
        style: { cursor: mockUsePlayAreaStoreReturn.cursor },
        ...mockStageDimensions,
      }),
      {},
    );
    expect(Layer).toHaveBeenCalledWith(
      expect.objectContaining({
        scaleX: mockStageScale,
        scaleY: mockStageScale,
        onWheel: mockOnWheel,
        ...mockStagePosition,
      }),
      {},
    );
  });
});
