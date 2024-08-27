import { faker } from "@faker-js/faker";
import { configureStore } from "@reduxjs/toolkit";
import { render, renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { User } from "firebase/auth"; // Assuming you have a mock User type
import React from "react";
import { Provider } from "react-redux";

import { useUserStore, userSlice } from "./user";


const mockUser = {
  uid: faker.string.alphanumeric(),
  displayName: faker.person.fullName(),
  email: faker.internet.email(),
};

describe("userSlice", () => {
  const initialState = userSlice.getInitialState();

  describe("reducer", () => {
    describe("setCurrentUser", () => {
      it("should set the current user", () => {
        const action = userSlice.actions.setCurrentUser(mockUser as User);
        const newState = userSlice.reducer(initialState, action);

        expect(newState.currentUser).toBe(mockUser);
      });
    });

    describe("setIsSpectator", () => {
      it("should set isSpectator to true", () => {
        const action = userSlice.actions.setIsSpectator(true);
        const newState = userSlice.reducer(initialState, action);

        expect(newState.spectator.isSpectator).toBe(true);
      });

      it("should set isSpectator to false", () => {
        const action = userSlice.actions.setIsSpectator(false);
        const newState = userSlice.reducer(initialState, action);

        expect(newState.spectator.isSpectator).toBe(false);
      });
    });
  });

  describe("useUserStore", () => {
    const store = configureStore({
      reducer: { user: userSlice.reducer },
    });

    enum UserStoreIds {
      SET_USER = "set-user-button",
      CHANGE_SPECTATOR_STATE = "change-spectator-state-button",
      SPECTATOR_STATE = "spectator-state",
    }

    const TestComponent = () => {
      const {
        currentUser,
        spectator: { isSpectator },
        setCurrentUser,
        setIsSpectator,
      } = useUserStore();

      return (
        <>
          <button
            data-testid={UserStoreIds.SET_USER}
            onClick={() => setCurrentUser(mockUser as User)}
          />
          <button
            data-testid={UserStoreIds.CHANGE_SPECTATOR_STATE}
            onClick={() => setIsSpectator(!isSpectator)}
          />
          <div>{currentUser?.email}</div>
          {isSpectator && <div data-testid={UserStoreIds.SPECTATOR_STATE} />}
        </>
      );
    };

    const setup = () =>
      render(
        <Provider store={store}>
          <TestComponent />
        </Provider>
      );

    it("should return correct initial state", () => {
      const { result } = renderHook(useUserStore, {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      const { currentUser, spectator } = result.current;
      expect(currentUser).toBeNull();
      expect(spectator.isSpectator).toBe(false);
    });

    it("should set and retrieve current user", async () => {
      const { getByTestId, getByText, queryByText } = setup();

      expect(queryByText(mockUser.email)).toBeFalsy();
      userEvent.click(getByTestId(UserStoreIds.SET_USER));
      await waitFor(() => getByText(mockUser.email));
    });

    it("should set and retrieve spectator status", async () => {
      const { getByTestId, queryByTestId } = setup();

      expect(queryByTestId(UserStoreIds.SPECTATOR_STATE)).toBeFalsy();

      userEvent.click(getByTestId(UserStoreIds.CHANGE_SPECTATOR_STATE));
      await waitFor(() => getByTestId(UserStoreIds.SPECTATOR_STATE));

      userEvent.click(getByTestId(UserStoreIds.CHANGE_SPECTATOR_STATE));
      await waitFor(() =>
        expect(queryByTestId(UserStoreIds.SPECTATOR_STATE)).toBeFalsy()
      );
    });
  });
});
