import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinsSlice, selectedCoinsSlice } from "./CoinsSlice";
import { loadSelectedCoinsFromStorage, saveSelectedCoinsToStorage } from "../Utils/LocalStorageUtils";

// Загружаем сохраненные выбранные монеты из localStorage
const preloadedState: Partial<AppState> = {
    selectedCoins: loadSelectedCoinsFromStorage(),
};

export const store = configureStore<AppState>({
    reducer: {
        coins: coinsSlice.reducer,
        selectedCoins: selectedCoinsSlice.reducer,
    },
    preloadedState: preloadedState as any,
});

// Подписываемся на изменения selectedCoins и сохраняем в localStorage
store.subscribe(() => {
    const state = store.getState();
    if (state.selectedCoins) {
        saveSelectedCoinsToStorage(state.selectedCoins);
    }
});
