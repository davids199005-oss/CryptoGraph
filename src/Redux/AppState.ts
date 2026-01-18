import { CoinsModel } from "../Models/CoinsModel";

export type AppState = {
    coins: CoinsModel[];
    selectedCoins: string[];
};