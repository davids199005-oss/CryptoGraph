import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinsModel } from "../Models/CoinsModel";

/**
 * Redux slice for managing the full list of coins from the API
 */
export const coinsSlice = createSlice({
    name: "coins-slice",
    initialState: [] as CoinsModel[],
    reducers: {
        /**
         * Initialize coins list from API response
         */
        initCoins: (_state: CoinsModel[], action: PayloadAction<CoinsModel[]>): CoinsModel[] => {
            return action.payload;
        },
    },
});

/**
 * Redux slice for managing the list of coins selected by the user (max 5 coins)
 */
export const selectedCoinsSlice = createSlice({
    name: "selected-coins-slice",
    initialState: [] as string[],
    reducers: {
        /**
         * Toggle selection of a coin. If already selected, deselect it. Otherwise, select it.
         */
        toggleCoin: (currentState: string[], action: PayloadAction<string>): string[] => {
            const coinId = action.payload;
            return currentState.includes(coinId)
                ? currentState.filter(id => id !== coinId)
                : [...currentState, coinId];
        },
        /**
         * Remove a specific coin from selected coins
         */
        removeCoin: (currentState: string[], action: PayloadAction<string>): string[] => {
            return currentState.filter(id => id !== action.payload);
        },
        /**
         * Clear all selected coins
         */
        clearSelectedCoins: (): string[] => {
            return [];
        },
    },
});

// Export actions for easy access
export const selectedCoinsSliceActions = selectedCoinsSlice.actions;
