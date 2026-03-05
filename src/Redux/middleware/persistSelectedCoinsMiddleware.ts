import type { Middleware } from "@reduxjs/toolkit";
import type { AppState } from "../AppState";
import { saveSelectedCoinsToStorage } from "../../Utils/LocalStorageUtils";

/**
 * Persists selectedCoins to localStorage after every action that might change the store.
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
