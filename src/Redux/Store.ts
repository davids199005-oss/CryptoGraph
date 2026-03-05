import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinsSlice, selectedCoinsSlice } from "./CoinsSlice";
import { searchSlice } from "./SearchSlice";
import { loadSelectedCoinsFromStorage } from "../Utils/LocalStorageUtils";
import { persistSelectedCoinsMiddleware } from "./middleware/persistSelectedCoinsMiddleware";

/**
 * Redux store: coins list, selected coin IDs, and search query. Preloads selected coins
 * from localStorage; persistSelectedCoinsMiddleware writes them back on each change.
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
