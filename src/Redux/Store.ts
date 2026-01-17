import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinsSlice } from "./CoinsSlice";






export const store = configureStore<AppState>({
    reducer: {
        coins: coinsSlice.reducer,
    },
});