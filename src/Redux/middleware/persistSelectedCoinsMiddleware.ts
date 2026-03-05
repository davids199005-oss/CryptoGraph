import type { Middleware } from "@reduxjs/toolkit";
import type { AppState } from "../AppState";
import { saveSelectedCoinsToStorage } from "../../Utils/LocalStorageUtils";

/**
 * Redux middleware that writes selectedCoins to localStorage after every action,
 * so the user's selection is restored on the next visit.
 */
export const persistSelectedCoinsMiddleware: Middleware<object, AppState> =
    (store) => (next) => (action) => {
        const result = next(action);
        const state = store.getState();
        if (state.selectedCoins) {
            saveSelectedCoinsToStorage(state.selectedCoins);
        }
        return result;
    };
