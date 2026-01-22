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

/**
 * Service for fetching cryptocurrency data from CoinGecko and CryptoCompare APIs
 * Provides methods for retrieving coin prices, details, and market data
 */
class CoinsService {
	/**
	 * Fetches the list of top cryptocurrencies with market data
	 * @throws {Error} If the API request fails
	 */
	public async getCoinsList(): Promise<CoinsModel[]> {
        try {
            const response = await axios.get<CoinsModel[]>(appConfig.CoinListUrl);
            return response.data;
        } catch (error) {
            console.error("Error fetching coins list:", error);
            throw error;
        }
    }

	/**
	 * Fetches current price for a single coin in multiple currencies
	 * @param coinId - The coin identifier
	 * @returns Price data in USD, EUR, and ILS, or null if request fails
	 */
	public async getCoinPrices(coinId: string): Promise<CoinPriceData | null> {
        try {
            const trimmedId = coinId.trim();
            if (!trimmedId) {
                console.warn("Skipping price lookup for empty coin id");
                return null;
            }

            const url = appConfig.CoinPriceUrl.replace("{id}", trimmedId);
            const response = await axios.get<CoinGeckoPriceResponse>(url);
            const prices = response.data[trimmedId];
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

	/**
	 * Fetches detailed information about a coin
	 * @param coinId - The coin identifier
	 */
	public async getCoinDetails(coinId: string): Promise<CoinGeckoCoinDetailsResponse | null> {
        try {
            const trimmedId = coinId.trim();
            if (!trimmedId) {
                console.warn("Skipping details lookup for empty coin id");
                return null;
            }

            const url = appConfig.CoinDetailsUrl.replace("{id}", trimmedId);
            const response = await axios.get<CoinGeckoCoinDetailsResponse>(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching coin details:", error);
            return null;
        }
    }

	/**
	 * Fetches detailed information about a coin including market data
	 * @param coinId - The coin identifier
	 */
	public async getCoinDetailsWithMarketData(coinId: string): Promise<CoinGeckoCoinDetailsResponse | null> {
        try {
            const trimmedId = coinId.trim();
            if (!trimmedId) {
                console.warn("Skipping market data lookup for empty coin id");
                return null;
            }

            const url = `${appConfig.CoinDetailsUrl.replace("{id}", trimmedId)}?market_data=true`;
            const response = await axios.get<CoinGeckoCoinDetailsResponse>(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching coin details with market data:", error);
            return null;
        }
    }

	/**
	 * Fetches prices for multiple coins in a single API request (optimized batch operation)
	 * @param coinIds - Array of coin identifiers
	 * @returns Map of coin ID to USD price
	 */
	public async getMultipleCoinsPrices(coinIds: string[]): Promise<Map<string, number>> {
        try {
            const validIds = coinIds.map(id => id.trim()).filter(id => id.length > 0);
            if (validIds.length === 0) {
                return new Map();
            }

            // Make single API request to CoinGecko for all coin prices
            const ids = validIds.join(",");
            const url = appConfig.CoinPriceUrl.replace("{id}", ids);
            const response = await axios.get<Record<string, { usd: number; eur?: number; ils?: number }>>(url);

            // Map coin IDs to prices
            const priceMap = new Map<string, number>();
            Object.keys(response.data).forEach(coinId => {
                const priceData = response.data[coinId];
                if (priceData && priceData.usd !== undefined) {
                    priceMap.set(coinId, priceData.usd);
                }
            });

            return priceMap;
        } catch (error) {
            console.error("Error fetching multiple coin prices:", error);
            return new Map();
        }
    }

	/**
	 * Fetches prices for multiple coins by their symbols from CryptoCompare API
	 * @param coins - Array of objects containing coin id and symbol
	 * @returns Map of coin ID to USD price
	 */
	public async getMultipleCoinsPricesBySymbols(coins: { id: string; symbol: string }[]): Promise<Map<string, number>> {
        try {
            const validCoins = coins
                .map(coin => ({ id: coin.id.trim(), symbol: coin.symbol.trim() }))
                .filter(coin => coin.id.length > 0 && coin.symbol.length > 0);

            if (validCoins.length === 0) {
                return new Map();
            }

            // Get symbols for CryptoCompare API
            const symbols = validCoins.map(coin => coin.symbol.toUpperCase()).join(",");
            const url = appConfig.CryptoComparePriceMultiUrl.replace("{symbols}", symbols);
            const response = await axios.get<CryptoComparePriceResponse>(url);

            // Map coin IDs to prices (using coin.id as key to match with selected coins)
            const priceMap = new Map<string, number>();
            validCoins.forEach(coin => {
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

	/**
	 * Fetches comprehensive market data for AI-powered recommendation analysis
	 * @param coinId - The coin identifier
	 */
	public async getCoinDataForRecommendation(coinId: string): Promise<CoinRecommendationData | null> {
		try {
            const trimmedId = coinId.trim();
            if (!trimmedId) {
                console.warn("Skipping recommendation lookup for empty coin id");
                return null;
            }

            const url = appConfig.CoinDetailsUrl.replace("{id}", trimmedId);
			const response = await axios.get<CoinGeckoCoinDetailsResponse>(url);

			const marketData = response.data.market_data;
			if (!marketData) {
				console.warn(`No market data available for coin: ${coinId}`);
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
