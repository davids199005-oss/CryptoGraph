import axios from "axios";
import { CoinsModel } from "../Models/CoinsModel";
import { appConfig } from "../Utils/AppConfig";
import {
	CoinGeckoPriceResponse,
	CoinGeckoCoinDetailsResponse,
	CryptoComparePriceResponse,
	CoinPriceData,
	CoinRecommendationData,
} from "../Models/ApiTypes";

class CoinsService {



	public async getCoinsList(): Promise<CoinsModel[]> {
        try {
            const response = await axios.get<CoinsModel[]>(appConfig.CoinListUrl);
            return response.data;
        } catch (error) {
            console.error("Error fetching coins list:", error);
            throw error;
        }
    }

	public async getCoinPrices(coinId: string): Promise<CoinPriceData | null> {
        try {
            const url = appConfig.CoinPriceUrl.replace("{id}", coinId);
            const response = await axios.get<CoinGeckoPriceResponse>(url);
            const prices = response.data[coinId];
            if (prices && prices.usd !== undefined) {
                return {
                    usd: prices.usd,
                    eur: prices.eur ?? 0,
                    ils: prices.ils ?? 0
                };
            }
            return null;
        } catch (error) {
            console.error("Error fetching coin prices:", error);
            return null;
        }
    }

	public async getCoinDetails(coinId: string): Promise<CoinGeckoCoinDetailsResponse | null> {
        try {
            const url = appConfig.CoinDetailsUrl.replace("{id}", coinId);
            const response = await axios.get<CoinGeckoCoinDetailsResponse>(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching coin details:", error);
            return null;
        }
    }

	public async getCoinDetailsWithMarketData(coinId: string): Promise<CoinGeckoCoinDetailsResponse | null> {
        try {
            const url = `${appConfig.CoinDetailsUrl.replace("{id}", coinId)}?market_data=true`;
            const response = await axios.get<CoinGeckoCoinDetailsResponse>(url);
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
            const response = await axios.get<CryptoComparePriceResponse>(url);

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

	public async getCoinDataForRecommendation(coinId: string): Promise<CoinRecommendationData | null> {
		try {
			const url = appConfig.CoinDetailsUrl.replace("{id}", coinId);
			const response = await axios.get<CoinGeckoCoinDetailsResponse>(url);

			const marketData = response.data.market_data;
			if (!marketData) {
				return null;
			}

			return {
				name: response.data.name || "",
				current_price_usd: marketData.current_price?.usd ?? 0,
				market_cap_usd: marketData.market_cap?.usd ?? 0,
				volume_24h_usd: marketData.total_volume?.usd ?? 0,
				price_change_percentage_30d_in_currency: marketData.price_change_percentage_30d_in_currency?.usd ?? 0,
				price_change_percentage_60d_in_currency: marketData.price_change_percentage_60d_in_currency?.usd ?? 0,
				price_change_percentage_200d_in_currency: marketData.price_change_percentage_200d_in_currency?.usd ?? 0,
			};
		} catch (error) {
			console.error("Error fetching coin data for recommendation:", error);
			return null;
		}
	}

}

export const coinsService = new CoinsService();