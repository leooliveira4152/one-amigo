import { userSlice } from "./user";
import { dialogSlice } from "./dialog";
import { makeStore } from "./store";

describe("store", () => {
  it("should create a store with combined reducers", () => {
    const store = makeStore();

    expect(store.getState()).toEqual({
      user: userSlice.getInitialState(),
      dialog: dialogSlice.getInitialState(),
    });
  });
});
