import { faker } from "@faker-js/faker";
import { fireEvent, render } from "@testing-library/react";
import { ComponentProps } from "react";
import { Circle } from "react-konva";

import {
  StorageDirectoriesEnum,
  useGetStorageImage,
} from "@/features/firebase/storage";
import { useUserStore } from "@/features/store/user";
import { generateRandomObject } from "@/testUtils";

import { Character } from "./Character";
import { CharacterDrawer } from "./CharacterDrawer";

const mockCircleTestId = faker.string.alpha();
const mockCharacterId = faker.string.alpha();
const mockPlayAreKey = faker.string.alpha();
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
  Circle: jest.fn((props) => (
    <button data-testid={mockCircleTestId} onClick={props.onClick} />
  )),
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
    draggable: expect.not.stringMatching(/true/),
    onClick: expect.any(Function),
    onTap: expect.any(Function),
    onDragStart: mockOnDragStart,
    onDragEnd: mockOnDragEnd,
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
    setup();

    expectRightGetStorageImageCall();
    expect(Circle).toHaveBeenCalledWith(
      expect.objectContaining({
        ...defaultCircleProps,
        fillPatternImage: mockGetStorageImageReturn.imageElement,
        fillPatternScale: expect.anything(),
        fillPatternX: mockRadius,
        fillPatternY: mockRadius,
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
    expect(Circle).toHaveBeenCalledWith(
      expect.objectContaining({
        ...defaultCircleProps,
        draggable: true,
        fillPatternImage: mockGetStorageImageReturn.imageElement,
        fillPatternScale: expect.anything(),
        fillPatternX: mockRadius,
        fillPatternY: mockRadius,
      }),
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
    expect(Circle).toHaveBeenCalledWith(
      expect.objectContaining(defaultCircleProps),
      {}
    );

    expect(Circle).toHaveBeenCalledWith(
      expect.not.objectContaining({
        fillPatternImage: expect.anything(),
        fillPatternScale: expect.anything(),
        fillPatternX: expect.anything(),
        fillPatternY: expect.anything(),
      }),
      {}
    );
  });

  it("should NOT render the Circle if no radius was passed to the component", () => {
    setup({ radius: 0 });
    expectRightGetStorageImageCall();
    expect(Circle).not.toHaveBeenCalled();
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
