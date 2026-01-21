import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinsSlice, selectedCoinsSlice } from "./CoinsSlice";
import { loadSelectedCoinsFromStorage, saveSelectedCoinsToStorage } from "../Utils/LocalStorageUtils";

// Load saved selected coins from localStorage
const preloadedState: Partial<AppState> = {
    selectedCoins: loadSelectedCoinsFromStorage(),
};

export const store = configureStore<AppState>({
    reducer: {
        coins: coinsSlice.reducer,
        selectedCoins: selectedCoinsSlice.reducer,
    },
    preloadedState: preloadedState as Partial<AppState>,
});

// Subscribe to selectedCoins changes and save to localStorage
store.subscribe(() => {
    const state = store.getState();
    if (state.selectedCoins) {
        saveSelectedCoinsToStorage(state.selectedCoins);
    }
});
