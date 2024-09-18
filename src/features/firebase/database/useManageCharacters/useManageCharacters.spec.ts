import { faker } from "@faker-js/faker"; // Import faker-js
import { renderHook } from "@testing-library/react";

import { Coordinates } from "@/features/playArea";

import { moveCharacter, useReadCharacters } from "./useManageCharacters";
import { updateDatabase, useRealtimeDatabase } from "../database";
import { DatabaseModelEnum } from "../types";

// Mock the necessary modules
jest.mock("../database", () => ({
  updateDatabase: jest.fn(),
  useRealtimeDatabase: jest.fn(),
}));

describe("useReadCharacters", () => {
  it("should set characters from the snapshot with correct transformation", () => {
    const mockSnapshot = {
      [faker.string.alpha()]: {
        name: faker.person.firstName(),
        position: { x: faker.number.int(), y: faker.number.int() },
      },
      [`${faker.string.alpha()}@2`]: {
        name: faker.person.firstName(),
        position: { x: faker.number.int(), y: faker.number.int() },
      },
    };

    (useRealtimeDatabase as jest.Mock).mockImplementationOnce((_, callback) => {
      callback(mockSnapshot);
    });

    const { result } = renderHook(() => useReadCharacters());
    const ids = Object.keys(mockSnapshot);

    expect(result.current).toEqual([
      {
        name: mockSnapshot[ids[0]].name,
        position: mockSnapshot[ids[0]].position,
        characterId: ids[0].split("@")[0], // First ID doesn't end with "@2"
        playAreaKey: ids[0],
      },
      {
        name: mockSnapshot[ids[1]].name,
        position: mockSnapshot[ids[1]].position,
        characterId: ids[1].split("@")[0], // Second ID ends with "@2"
        playAreaKey: ids[1],
      },
    ]);
  });

  it("should return an empty array when snapshot is null", () => {
    (useRealtimeDatabase as jest.Mock).mockImplementationOnce((_, callback) => {
      callback(null);
    });

    const { result } = renderHook(() => useReadCharacters());
    expect(result.current).toEqual([]);
  });
});

describe("moveCharacter", () => {
  it("should call updateDatabase with correct path and data", () => {
    const mockCoordinates: Coordinates = {
      x: faker.number.int(),
      y: faker.number.int(),
    };

    const characterId = faker.string.alpha();
    moveCharacter(characterId, mockCoordinates);
    expect(updateDatabase).toHaveBeenCalledWith(
      `${DatabaseModelEnum.CHARACTERS}/${characterId}`,
      mockCoordinates,
    );
  });
});
