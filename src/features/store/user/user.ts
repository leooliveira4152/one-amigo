import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { FirestoreUser } from "@/features/firebase/firestore";

import { useAppDispatch, useAppSelector } from "../store";

const LOCAL_STORAGE_SPECTATOR_KEY = "one-amigo-spectator";

type UserState = {
  currentUser: FirestoreUser | null;
  spectator: { isSpectator: boolean };
};
const initialState: UserState = {
  currentUser: null,
  spectator: { isSpectator: false },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<FirestoreUser | null>) => {
      state.currentUser = action.payload;
    },
    setIsSpectator: (state, action: PayloadAction<boolean>) => {
      state.spectator.isSpectator = action.payload;
      localStorage.setItem(
        LOCAL_STORAGE_SPECTATOR_KEY,
        action.payload ? "true" : ""
      );
    },
  },
});

export const useUserStore = () => {
  const values = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return {
    ...values,
    setCurrentUser: (user: FirestoreUser | null) =>
      dispatch(userSlice.actions.setCurrentUser(user)),
    setIsSpectator: (isSpectator: boolean) =>
      dispatch(userSlice.actions.setIsSpectator(isSpectator)),
    localStorageSpectatorKey: LOCAL_STORAGE_SPECTATOR_KEY,
  };
};
