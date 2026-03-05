import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinsSlice, selectedCoinsSlice } from "./CoinsSlice";
import { searchSlice } from "./SearchSlice";
import { loadSelectedCoinsFromStorage } from "../Utils/LocalStorageUtils";
import { persistSelectedCoinsMiddleware } from "./middleware/persistSelectedCoinsMiddleware";

/**
 * Initialize Redux store with persistence
 * - Loads previously selected coins from localStorage
 * - Middleware persists selected coins to localStorage on every state change
 */
const preloadedState: AppState = {
    coins: [],
    selectedCoins: loadSelectedCoinsFromStorage(),
    searchQuery: "",
};

export const store = configureStore({
    reducer: {
        coins: coinsSlice.reducer,
        selectedCoins: selectedCoinsSlice.reducer,
        searchQuery: searchSlice.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistSelectedCoinsMiddleware),
});
