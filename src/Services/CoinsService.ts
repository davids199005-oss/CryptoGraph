import axios from "axios";
import { CoinsModel } from "../Models/CoinsModel";
import { store } from "../Redux/Store";
import { appConfig } from "../Utils/AppConfig";
import { coinsSlice } from "../Redux/CoinsSlice";

class CoinsService {



	public async get100CoinsList(): Promise<CoinsModel[]> {
        if (store.getState().coins.length > 0) {
            return store.getState().coins;
        }

        const response = await axios.get<CoinsModel[]>(appConfig.CoinListUrl);
        
        const coins = response.data;

        const action = coinsSlice.actions.initCoins(coins);
        store.dispatch(action);

        return coins;
    }

	public async getCoinPrices(coinId: string): Promise<{usd: number, eur: number, ils: number} | null> {
        try {
            const url = appConfig.CoinPriceUrl.replace("{id}", coinId);
            const response = await axios.get<{[key: string]: {usd: number, eur: number, ils: number}}>(url);
            const prices = response.data[coinId];
            if (prices) {
                return {
                    usd: prices.usd,
                    eur: prices.eur,
                    ils: prices.ils
                };
            }
            return null;
        } catch (error) {
            console.error("Error fetching coin prices:", error);
            return null;
        }
    }
}

export const coinsService = new CoinsService();