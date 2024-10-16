import { faker } from "@faker-js/faker";
import { fireEvent, render } from "@testing-library/react";
import { ComponentProps } from "react";
import { Circle } from "react-konva";

import { StorageDirectoriesEnum, useGetStorageImage } from "@/features/firebase/storage";
import { METER_SIZE } from "@/features/playArea/common";
import { useUserStore } from "@/features/store/user";
import { generateRandomObject } from "@/test/testUtils";

import { Character, CIRCUMFERENCE_NORMALIZER } from "./Character";
import { CharacterDrawer } from "./CharacterDrawer";

const mockCircleTestId = faker.string.alpha(5);
const mockCharacterId = faker.string.alpha(5);
const mockPlayAreKey = faker.string.alpha(5);
const mockRadius = faker.number.int();
const mockCoordinates = { x: faker.number.int(), y: faker.number.int() };
const mockCircleProps = generateRandomObject();
const mockGetStorageImageReturn = {
  imageElement: {} as HTMLImageElement,
  dimensions: { width: faker.number.int(), height: faker.number.int() },
};
const mockOpenDialog = jest.fn();
const mockOnDragStart = jest.fn();
const mockOnDragEnd = jest.fn();

jest.mock("react-konva", () => ({
  Circle: jest.fn((props) => {
    return (
      <button
        data-testid={props.onClick && props.onTap && mockCircleTestId}
        onClick={props.onClick}
      />
    );
  }),
}));

jest.mock("@/features/store/user", () => ({
  useUserStore: jest.fn(() => ({})),
}));
jest.mock("@/features/context/DialogContext", () => ({
  useDialogContext: jest.fn(() => ({ openDialog: mockOpenDialog })),
}));
jest.mock("@/features/firebase/storage", () => ({
  ...jest.requireActual("@/features/firebase/storage"),
  useGetStorageImage: jest.fn(() => mockGetStorageImageReturn),
}));

jest.mock("./useDragHandler", () => ({
  useDragHandler: jest.fn(() => ({
    onDragStart: mockOnDragStart,
    onDragEnd: mockOnDragEnd,
  })),
}));
jest.mock("./CharacterDrawer", () => ({
  CharacterDrawer: jest.fn(),
}));

describe("<Character />", () => {
  const defaultCircleProps = {
    radius: mockRadius,
    ...mockCoordinates,
    ...mockCircleProps,
  };

  const setup = (override?: Partial<ComponentProps<typeof Character>>) =>
    render(
      <Character
        characterId={mockCharacterId}
        playAreaKey={mockPlayAreKey}
        radius={mockRadius}
        {...mockCoordinates}
        {...mockCircleProps}
        {...override}
      />
    );

  const expectRightGetStorageImageCall = () => {
    expect(useGetStorageImage).toHaveBeenCalledWith(
      `${StorageDirectoriesEnum.CHARACTERS}/${mockCharacterId}/default_portrait.jpg`
    );
  };

  it("should render the circle accordingly if portraitDimensions are available", () => {
    const mockNormalizedRadius = METER_SIZE * CIRCUMFERENCE_NORMALIZER;
    setup();

    expectRightGetStorageImageCall();
    expect(Circle).toHaveBeenCalledTimes(3);

    expect(Circle).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        ...defaultCircleProps,
        fillPatternImage: mockGetStorageImageReturn.imageElement,
        fillPatternScale: {
          x: (mockNormalizedRadius * 2) / mockGetStorageImageReturn.dimensions.width,
          y: (mockNormalizedRadius * 2) / mockGetStorageImageReturn.dimensions.height,
        },
        fillPatternX: mockNormalizedRadius,
        fillPatternY: mockNormalizedRadius,
      }),
      {}
    );
    expect(Circle).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        draggable: undefined,
        onDragStart: mockOnDragStart,
        onDragEnd: mockOnDragEnd,
      }),
      {}
    );
  });

  it("should only render draggable = true if user is admin", () => {
    jest
      .mocked(useUserStore)
      .mockReturnValue({ currentUser: { admin: true } } as ReturnType<
        typeof useUserStore
      >);
    setup();

    expectRightGetStorageImageCall();
    expect(Circle).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ draggable: true }),
      {}
    );
  });

  it("should NOT render fillPattern-related props if no image dimension is available yet", () => {
    jest.mocked(useGetStorageImage).mockReturnValue({
      imageElement: {},
      dimensions: { width: 0, height: 0 },
    } as ReturnType<typeof useGetStorageImage>);
    setup();

    expectRightGetStorageImageCall();
    expect(Circle).toHaveBeenCalledWith(expect.objectContaining(defaultCircleProps), {});

    expect(Circle).toHaveBeenNthCalledWith(
      2,
      expect.not.objectContaining({
        fillPatternImage: expect.anything(),
        fillPatternScale: expect.anything(),
        fillPatternX: expect.anything(),
        fillPatternY: expect.anything(),
      }),
      {}
    );
  });

  it("should properly call the openDialog function when triggering onClick event", () => {
    const { getByTestId } = setup();
    fireEvent.click(getByTestId(mockCircleTestId));
    expect(mockOpenDialog).toHaveBeenCalledWith({
      content: <CharacterDrawer characterId={mockCharacterId} />,
      fullWidth: true,
      maxWidth: "sm",
    });
  });
});
