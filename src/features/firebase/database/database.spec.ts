import { faker } from "@faker-js/faker";
import { renderHook } from "@testing-library/react";
import { ref, set, update, onValue, DataSnapshot } from "firebase/database";

import { updateDatabase, useRealtimeDatabase, writeOnDatabase } from "./database";

// Mock Firebase functions
jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(() => ({})),
  set: jest.fn(),
  update: jest.fn(),
  onValue: jest.fn(),
}));

describe("Firebase Database Hooks and Functions", () => {
  const path = faker.system.directoryPath();
  const data = {};

  test("useRealtimeDatabase should subscribe to the correct path", () => {
    const mockOnValue = jest.fn();
    const mockSnapshotValue = faker.string.alphanumeric();

    const mockCallback = jest.fn();
    jest.mocked(onValue).mockImplementationOnce((_query, callback) => {
      callback({ val: () => mockSnapshotValue } as DataSnapshot);
      return mockOnValue;
    });

    renderHook(() => useRealtimeDatabase(path, mockCallback));
    expect(ref).toHaveBeenCalledWith(expect.anything(), path);
    expect(onValue).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith(mockSnapshotValue);
  });

  test("writeOnDatabase should call set with correct data", () => {
    writeOnDatabase(path, data);
    expect(ref).toHaveBeenCalledWith(expect.anything(), path);
    expect(set).toHaveBeenCalledWith(expect.anything(), data);
  });

  test("updateDatabase should call update with correct data", () => {
    updateDatabase(path, data);
    expect(ref).toHaveBeenCalledWith(expect.anything(), path);
    expect(update).toHaveBeenCalledWith(expect.anything(), data);
  });
});
