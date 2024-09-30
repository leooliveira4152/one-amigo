import { faker } from "@faker-js/faker";
import { Skeleton } from "@mui/material";
import { render, waitFor } from "@testing-library/react";

import { FirestoreCharacter, readCharacterDoc } from "@/features/firebase/firestore";

import {
  CharacterDrawer,
  CharacterDrawerTestIds,
  PLACEHOLDER_CHARACTER_NAME,
} from "./CharacterDrawer";

const mockCharacterId = faker.string.alpha();

jest.mock("firebase/firestore");
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Skeleton: jest.fn(),
}));

jest.mock("@/features/firebase/firestore", () => ({
  readCharacterDoc: jest.fn(() => Promise.resolve()),
}));
jest.mock("@/features/firebase/storage", () => ({
  ...jest.requireActual("@/features/firebase/storage"),
  useGetStorageImage: jest.fn(() => ({
    imageUrl: faker.internet.url(),
    dimensions: { width: faker.number.int(), height: faker.number.int() },
  })),
}));

describe("<CharacterDrawer />", () => {
  const setup = () => render(<CharacterDrawer characterId={mockCharacterId} />);

  it("should call the required elements if everything is right", async () => {
    const { getByTestId, queryByTestId } = setup();
    await waitFor(() => getByTestId(CharacterDrawerTestIds.IMAGE));
    expect(Skeleton).toHaveBeenCalledTimes(1); // Should only be called once (until loading = false)
    expect(queryByTestId(CharacterDrawerTestIds.ROOT_SKELETON)).toBeFalsy();
  });

  describe("Character name rendering", () => {
    it("should render the character name if it was found", async () => {
      const mockCharacterName = faker.person.fullName();
      jest
        .mocked(readCharacterDoc)
        .mockResolvedValueOnce({ name: mockCharacterName } as FirestoreCharacter);
      const { getByText } = setup();
      await waitFor(() => getByText(mockCharacterName));
    });

    it("should render an inconclusive name if no character was found", async () => {
      const { getByText } = setup();
      await waitFor(() => getByText(PLACEHOLDER_CHARACTER_NAME));
    });
  });

  it("should call the required elements if everything is right", async () => {
    const { getByTestId, queryByTestId } = setup();
    await waitFor(() => getByTestId(CharacterDrawerTestIds.IMAGE));
    expect(Skeleton).toHaveBeenCalledTimes(1); // Should only be called once (until loading = false)
    expect(queryByTestId(CharacterDrawerTestIds.ROOT_SKELETON)).toBeFalsy();
  });
});
