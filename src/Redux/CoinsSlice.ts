import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinsModel } from "../Models/CoinsModel"





function initCoins(_currentState: CoinsModel[], action: PayloadAction<CoinsModel[]>): CoinsModel[] {
    const coinsToInit = action.payload;
    const newState = coinsToInit;
    return newState;
}




export const coinsSlice = createSlice({
    name: "coins-slice",
    initialState: [] as CoinsModel[],
    reducers: {
        initCoins,
    },
});

const selectedCoinsSlice = createSlice({
    name: "selected-coins-slice",
    initialState: [] as string[],
    reducers: {
        toggleCoin: (currentState: string[], action: PayloadAction<string>): string[] => {
            const coinId = action.payload;
            if (currentState.includes(coinId)) {
                return currentState.filter(id => id !== coinId);
            }
            return [...currentState, coinId];
        },
        removeCoin: (currentState: string[], action: PayloadAction<string>): string[] => {
            return currentState.filter(id => id !== action.payload);
        },
        clearSelectedCoins: (): string[] => {
            return [];
        },
    },
});

export const selectedCoinsSliceActions = selectedCoinsSlice.actions;
export { selectedCoinsSlice };