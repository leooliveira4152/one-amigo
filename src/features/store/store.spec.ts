import { playAreaSlice } from "./playArea";
import { makeStore } from "./store";
import { userSlice } from "./user";

describe("store", () => {
  it("should create a store with combined reducers", () => {
    const store = makeStore();

    expect(store.getState()).toEqual({
      user: userSlice.getInitialState(),
      playArea: playAreaSlice.getInitialState(),
    });
  });
});
