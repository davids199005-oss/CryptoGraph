import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinsSlice, selectedCoinsSlice } from "./CoinsSlice";
import { searchSlice } from "./SearchSlice";
import { loadSelectedCoinsFromStorage, saveSelectedCoinsToStorage } from "../Utils/LocalStorageUtils";

// Load saved selected coins from localStorage
const preloadedState: Partial<AppState> = {
    selectedCoins: loadSelectedCoinsFromStorage(),
    searchQuery: "",
};

export const store = configureStore<AppState>({
    reducer: {
        coins: coinsSlice.reducer,
        selectedCoins: selectedCoinsSlice.reducer,
        searchQuery: searchSlice.reducer,
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
