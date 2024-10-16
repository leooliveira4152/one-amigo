import { faker } from "@faker-js/faker";
import { Skeleton } from "@mui/material";
import { render, waitFor } from "@testing-library/react";

import { FirestoreCharacter } from "@/features/firebase/firestore";
import { PLACEHOLDER_MISSING_INFO } from "@/utils";

import { CharacterDrawer, CharacterDrawerTestIds } from "./CharacterDrawer";

const mockCharacterId = faker.string.alpha();
const mockReadCharacterDoc = jest.fn();

jest.mock("firebase/firestore");
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Skeleton: jest.fn(),
}));

jest.mock("@/features/firebase/firestore", () => ({
  useCharacterDoc: jest.fn(() => ({ readCharacterDoc: mockReadCharacterDoc })),
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
        .mocked(mockReadCharacterDoc)
        .mockResolvedValueOnce({ name: mockCharacterName } as FirestoreCharacter);
      const { getByText } = setup();
      await waitFor(() => getByText(mockCharacterName));
    });

    it("should render an inconclusive name if no character was found", async () => {
      const { getByText } = setup();
      await waitFor(() => getByText(PLACEHOLDER_MISSING_INFO));
    });
  });

  it("should call the required elements if everything is right", async () => {
    const { getByTestId, queryByTestId } = setup();
    await waitFor(() => getByTestId(CharacterDrawerTestIds.IMAGE));
    expect(Skeleton).toHaveBeenCalledTimes(1); // Should only be called once (until loading = false)
    expect(queryByTestId(CharacterDrawerTestIds.ROOT_SKELETON)).toBeFalsy();
  });
});
