import { useEffect, useState } from "react";
import { CoinsModel } from "../Models/CoinsModel";
import { coinsService } from "../Services/CoinsService";
import { openAiService } from "../Services/OpenAiService";

export type Recommendation = {
    coin: CoinsModel;
    recommendation: "buy" | "do not buy";
    reason: string;
    loading: boolean;
    error?: string;
};

export type UseRecommendationsResult = {
    recommendations: Recommendation[];
    loading: boolean;
    apiKeyMissing: boolean;
};

export function useRecommendations(
    selectedCoinIds: string[],
    selectedCoins: CoinsModel[]
): UseRecommendationsResult {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

    useEffect(() => {
        if (selectedCoinIds.length === 0) {
            setRecommendations([]);
            setApiKeyMissing(false);
            return;
        }

        let isCancelled = false;

        async function fetchRecommendations() {
            setLoading(true);

            if (!openAiService.isConfigured()) {
                setApiKeyMissing(true);
                setRecommendations([]);
                setLoading(false);
                return;
            }

            setApiKeyMissing(false);
            setRecommendations(
                selectedCoins.map(coin => ({
                    coin,
                    recommendation: "buy" as const,
                    reason: "",
                    loading: true,
                }))
            );

            const recommendationPromises = selectedCoins.map(async (coin) => {
                if (!coin.id) {
                    return null;
                }

                try {
                    const coinData = await coinsService.getCoinDataForRecommendation(coin.id);

                    if (isCancelled || !coinData) {
                        return null;
                    }

                    const recommendation = await openAiService.getCoinRecommendation(coinData);

                    if (isCancelled) {
                        return null;
                    }

                    if (!recommendation) {
                        return {
                            coin,
                            recommendation: "do not buy" as const,
                            reason: "Recommendation unavailable at the moment.",
                            loading: false,
                            error: "No recommendation returned",
                        } as Recommendation;
                    }

                    return {
                        coin,
                        recommendation: recommendation.recommendation,
                        reason: recommendation.reason,
                        loading: false,
                    } as Recommendation;
                } catch (error) {
                    console.error(`Error fetching recommendation for ${coin.name}:`, error);
                    return {
                        coin,
                        recommendation: "do not buy" as const,
                        reason: "Failed to fetch recommendation data.",
                        loading: false,
                        error: "Error loading recommendation",
                    } as Recommendation;
                }
            });

            const results = await Promise.all(recommendationPromises);

            if (!isCancelled) {
                setRecommendations(results.filter((r): r is Recommendation => r !== null));
                setLoading(false);
            }
        }

        fetchRecommendations();

        return () => {
            isCancelled = true;
        };
    }, [selectedCoinIds, selectedCoins]);

    return { recommendations, loading, apiKeyMissing };
}
