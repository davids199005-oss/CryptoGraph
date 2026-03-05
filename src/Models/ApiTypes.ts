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
	market_cap_rank?: number;
	total_volume?: {
		usd?: number;
		eur?: number;
		ils?: number;
	};
	high_24h?: { usd?: number };
	low_24h?: { usd?: number };
	price_change_24h?: number;
	price_change_percentage_24h?: number;
	market_cap_change_24h?: number;
	market_cap_change_percentage_24h?: number;
	circulating_supply?: number;
	total_supply?: number | null;
	max_supply?: number | null;
	ath?: { usd?: number };
	ath_change_percentage?: { usd?: number };
	ath_date?: { usd?: string };
	atl?: { usd?: number };
	atl_change_percentage?: { usd?: number };
	atl_date?: { usd?: string };
	last_updated?: string;
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

export interface CoinGeckoCoinDetailsImage {
	thumb?: string;
	small?: string;
	large?: string;
}

export interface CoinGeckoCoinDetailsResponse {
	id: string;
	name: string;
	symbol: string;
	image?: CoinGeckoCoinDetailsImage;
	market_data?: CoinGeckoMarketData;
	market_cap_rank?: number;
	last_updated?: string;
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
