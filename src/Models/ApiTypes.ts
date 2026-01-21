/**
 * Types for CoinGecko API responses
 */

export interface CoinGeckoPriceResponse {
	[key: string]: {
		usd: number;
		eur?: number;
		ils?: number;
	};
}

export interface CoinGeckoMarketData {
	current_price?: {
		usd?: number;
		eur?: number;
		ils?: number;
	};
	market_cap?: {
		usd?: number;
		eur?: number;
		ils?: number;
	};
	total_volume?: {
		usd?: number;
		eur?: number;
		ils?: number;
	};
	price_change_percentage_30d_in_currency?: {
		usd?: number;
		eur?: number;
		ils?: number;
	};
	price_change_percentage_60d_in_currency?: {
		usd?: number;
		eur?: number;
		ils?: number;
	};
	price_change_percentage_200d_in_currency?: {
		usd?: number;
		eur?: number;
		ils?: number;
	};
}

export interface CoinGeckoCoinDetailsResponse {
	id: string;
	name: string;
	symbol: string;
	market_data?: CoinGeckoMarketData;
	[key: string]: unknown;
}

export interface CryptoComparePriceResponse {
	[key: string]: {
		USD: number;
	};
}

export interface CoinPriceData {
	usd: number;
	eur: number;
	ils: number;
}

export interface CoinRecommendationData {
	name: string;
	current_price_usd: number;
	market_cap_usd: number;
	volume_24h_usd: number;
	price_change_percentage_30d_in_currency: number;
	price_change_percentage_60d_in_currency: number;
	price_change_percentage_200d_in_currency: number;
}
