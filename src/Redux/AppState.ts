import { CoinsModel } from "../Models/coinsModel";

/** Root Redux state shape for the application. */
export type AppState = {
    coins: CoinsModel[];
    selectedCoins: string[];
    searchQuery: string;
};