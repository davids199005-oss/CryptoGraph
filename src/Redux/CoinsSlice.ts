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