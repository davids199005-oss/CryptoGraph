import { CoinsModel } from "../Models/CoinsModel";

/** Root Redux state shape for the application. */
export type AppState = {
    coins: CoinsModel[];
    selectedCoins: string[];
    searchQuery: string;
};