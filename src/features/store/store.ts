import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";

import { dialogSlice } from "./dialog";
import { playAreaSlice } from "./playArea";
import { userSlice } from "./user";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
      dialog: dialogSlice.reducer,
      playArea: playAreaSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
