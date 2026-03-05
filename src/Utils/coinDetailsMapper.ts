import { CoinsModel } from "../Models/CoinsModel";
import { CoinGeckoCoinDetailsResponse } from "../Models/ApiTypes";

/**
 * Maps a CoinGecko coin-details API response into the app domain model (CoinsModel).
 * Handles both object and numeric shapes for price/ATH/ATL fields from the API.
 */
export function mapCoinDetailsResponseToModel(
    response: CoinGeckoCoinDetailsResponse,
    id: string
): CoinsModel {
    const md = response.market_data;
    const num = (v: number | { usd?: number } | undefined): number | undefined =>
        typeof v === "number" ? v : v?.usd;
    return {
        id: response.id ?? id,
        symbol: response.symbol,
        name: response.name,
        image: response.image?.large ?? response.image?.small ?? response.image?.thumb,
        current_price: md?.current_price?.usd,
        market_cap: md?.market_cap?.usd ?? (md as { market_cap?: number })?.market_cap,
        market_cap_rank: response.market_cap_rank ?? (md as { market_cap_rank?: number })?.market_cap_rank,
        fully_diluted_valuation: (md as { fully_diluted_valuation?: { usd?: number } })?.fully_diluted_valuation?.usd,
        total_volume: md?.total_volume?.usd,
        high_24h: num((md as { high_24h?: number | { usd?: number } })?.high_24h),
        low_24h: num((md as { low_24h?: number | { usd?: number } })?.low_24h),
        price_change_24h: md?.price_change_24h,
        price_change_percentage_24h: md?.price_change_percentage_24h,
        market_cap_change_24h: md?.market_cap_change_24h,
        market_cap_change_percentage_24h: md?.market_cap_change_percentage_24h,
        circulating_supply: md?.circulating_supply,
        total_supply: md?.total_supply ?? undefined,
        max_supply: md?.max_supply ?? undefined,
        ath: num((md as { ath?: number | { usd?: number } })?.ath),
        ath_change_percentage: typeof (md as { ath_change_percentage?: number })?.ath_change_percentage === "number"
            ? (md as { ath_change_percentage: number }).ath_change_percentage
            : (md as { ath_change_percentage?: { usd?: number } })?.ath_change_percentage?.usd,
        ath_date: typeof (md as { ath_date?: string })?.ath_date === "string"
            ? (md as { ath_date: string }).ath_date
            : (md as { ath_date?: { usd?: string } })?.ath_date?.usd,
        atl: num((md as { atl?: number | { usd?: number } })?.atl),
        atl_change_percentage: typeof (md as { atl_change_percentage?: number })?.atl_change_percentage === "number"
            ? (md as { atl_change_percentage: number }).atl_change_percentage
            : (md as { atl_change_percentage?: { usd?: number } })?.atl_change_percentage?.usd,
        atl_date: typeof (md as { atl_date?: string })?.atl_date === "string"
            ? (md as { atl_date: string }).atl_date
            : (md as { atl_date?: { usd?: string } })?.atl_date?.usd,
        last_updated: response.last_updated ?? md?.last_updated,
    };
}
