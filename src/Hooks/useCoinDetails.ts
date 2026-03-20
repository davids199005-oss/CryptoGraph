import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../Redux/AppState";
import { CoinsModel } from "../Models/coinsModel";
import { coinsService } from "../Services/CoinsService";

export type UseCoinDetailsResult = {
    coin: CoinsModel | null | undefined;
    loading: boolean;
    error: string | null;
};

type CoinDetailsError = {
    coinId: string;
    message: string;
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
    const [errorState, setErrorState] = useState<CoinDetailsError | null>(null);

    const hasCurrentDetailCoin = detailCoin?.id === coinId;
    const shouldFetch = Boolean(coinId && !coinFromStore && !hasCurrentDetailCoin);
    const hasCurrentError = errorState?.coinId === coinId;

    useEffect(() => {
        if (!coinId || !shouldFetch || hasCurrentError) {
            return;
        }

        let cancelled = false;

        coinsService
            .getCoinDetailsAsModel(coinId)
            .then((model) => {
                if (cancelled) return;
                if (model) {
                    setDetailCoin(model);
                    setErrorState(null);
                } else {
                    setDetailCoin(null);
                    setErrorState({ coinId, message: "Failed to load coin" });
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setDetailCoin(null);
                    setErrorState({ coinId, message: "Failed to load coin" });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [coinId, shouldFetch, hasCurrentError]);

    const coin = coinFromStore ?? (hasCurrentDetailCoin ? detailCoin : null);
    const loading = shouldFetch && !hasCurrentError;
    const error = hasCurrentError && errorState ? errorState.message : null;

    return { coin, loading, error };
}
