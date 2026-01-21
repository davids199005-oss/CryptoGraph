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

	public async getCoinDetails(coinId: string): Promise<any | null> {
        try {
            const url = appConfig.CoinDetailsUrl.replace("{id}", coinId);
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching coin details:", error);
            return null;
        }
    }

	public async getCoinDetailsWithMarketData(coinId: string): Promise<any | null> {
        try {
            const url = `${appConfig.CoinDetailsUrl.replace("{id}", coinId)}?market_data=true`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching coin details with market data:", error);
            return null;
        }
    }

	public async getMultipleCoinsPrices(coinIds: string[]): Promise<Map<string, number>> {
        try {
            if (coinIds.length === 0) {
                return new Map();
            }

            // Make single API request to CoinGecko for all coin prices
            const ids = coinIds.join(",");
            const url = appConfig.CoinPriceUrl.replace("{id}", ids);
            const response = await axios.get<Record<string, { usd: number; eur?: number; ils?: number }>>(url);

            // Map coin IDs to prices
            const priceMap = new Map<string, number>();
            Object.keys(response.data).forEach(coinId => {
                const priceData = response.data[coinId];
                if (priceData && priceData.usd) {
                    priceMap.set(coinId, priceData.usd);
                }
            });

            return priceMap;
        } catch (error) {
            console.error("Error fetching multiple coin prices:", error);
            return new Map();
        }
    }

	public async getMultipleCoinsPricesBySymbols(coins: { id: string; symbol: string }[]): Promise<Map<string, number>> {
        try {
            if (coins.length === 0) {
                return new Map();
            }

            // Get symbols for CryptoCompare API
            const symbols = coins.map(coin => coin.symbol.toUpperCase()).join(",");
            const url = appConfig.CryptoComparePriceMultiUrl.replace("{symbols}", symbols);
            const response = await axios.get<Record<string, { USD: number }>>(url);

            // Map coin IDs to prices (using coin.id as key to match with selected coins)
            const priceMap = new Map<string, number>();
            coins.forEach(coin => {
                const symbol = coin.symbol.toUpperCase();
                const priceData = response.data[symbol];
                if (priceData && priceData.USD !== undefined) {
                    priceMap.set(coin.id, priceData.USD);
                }
            });

            return priceMap;
        } catch (error) {
            console.error("Error fetching multiple coin prices from CryptoCompare:", error);
            return new Map();
        }
    }

}

export const coinsService = new CoinsService();