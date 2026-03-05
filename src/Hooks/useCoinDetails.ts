import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../Redux/AppState";
import { CoinsModel } from "../Models/CoinsModel";
import { coinsService } from "../Services/CoinsService";

export type UseCoinDetailsResult = {
    coin: CoinsModel | null | undefined;
    loading: boolean;
    error: string | null;
};

/**
 * Loads coin data from Redux store or fetches by ID when not in store.
 * Returns the coin to display, loading flag, and error message.
 */
export function useCoinDetails(coinId: string | undefined): UseCoinDetailsResult {
    const allCoins = useSelector((state: AppState) => state.coins);

    const coinFromStore = useMemo(() => {
        if (!coinId) return undefined;
        return allCoins.find(c => c.id === coinId);
    }, [coinId, allCoins]);

    const [detailCoin, setDetailCoin] = useState<CoinsModel | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!coinId || coinFromStore || detailCoin?.id === coinId) {
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(null);
        coinsService
            .getCoinDetailsAsModel(coinId)
            .then((model) => {
                if (cancelled) return;
                if (model) {
                    setDetailCoin(model);
                    setError(null);
                } else {
                    setError("Failed to load coin");
                    setDetailCoin(null);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Failed to load coin");
                    setDetailCoin(null);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
            setDetailCoin(null);
            setError(null);
        };
    }, [coinId, coinFromStore, detailCoin?.id]);

    const coin = coinFromStore ?? detailCoin;

    return { coin, loading, error };
}
