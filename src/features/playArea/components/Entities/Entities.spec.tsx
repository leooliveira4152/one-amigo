import { faker } from "@faker-js/faker";
import { render } from "@testing-library/react";

import { usePlayAreaStore } from "@/features/store/playArea";
import { mockInteger } from "@/test/testUtils";

import { Entities } from "./Entities";
import { Character } from "./components";

const mockCharacterAmount = mockInteger();
const mockUsePlayAreaStoreReturn = {
  mapDimensions: { height: faker.number.int(), width: faker.number.int() },
};

jest.mock("@/features/store/playArea", () => ({
  usePlayAreaStore: jest.fn(() => mockUsePlayAreaStoreReturn),
}));
jest.mock("@/features/firebase/database", () => ({
  useReadCharacters: jest.fn(() => new Array(mockCharacterAmount).fill({})),
}));
jest.mock("./components");

describe("<Entities />", () => {
  const setup = () => render(<Entities />);

  it("should call the required hooks and render the right amount of Characters elements", () => {
    setup();
    expect(Character).toHaveBeenCalledTimes(mockCharacterAmount);
  });

  it("should render no characters if mapDimensions aren't available yet", () => {
    jest.mocked(usePlayAreaStore).mockReturnValueOnce({
      mapDimensions: { height: 0, width: 0 },
    } as ReturnType<typeof usePlayAreaStore>);

    setup();
    expect(Character).not.toHaveBeenCalled();
  });
});
