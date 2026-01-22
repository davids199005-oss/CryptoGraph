import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinsSlice, selectedCoinsSlice } from "./CoinsSlice";
import { searchSlice } from "./SearchSlice";
import { loadSelectedCoinsFromStorage, saveSelectedCoinsToStorage } from "../Utils/LocalStorageUtils";

/**
 * Initialize Redux store with persistence
 * - Loads previously selected coins from localStorage
 * - Automatically persists selected coins to localStorage on changes
 */
const preloadedState: AppState = {
    coins: [],
    selectedCoins: loadSelectedCoinsFromStorage(),
    searchQuery: "",
};

export const store = configureStore<AppState>({
    reducer: {
        coins: coinsSlice.reducer,
        selectedCoins: selectedCoinsSlice.reducer,
        searchQuery: searchSlice.reducer,
    },
    preloadedState: preloadedState,
});

/**
 * Subscribe to selectedCoins changes and persist to localStorage
 */
store.subscribe(() => {
    const state = store.getState();
    if (state.selectedCoins) {
        saveSelectedCoinsToStorage(state.selectedCoins);
    }
});
