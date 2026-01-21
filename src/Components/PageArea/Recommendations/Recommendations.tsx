import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { openAiService } from "../../../Services/OpenAiService";
import { PriceFormatter } from "../../../Utils/PriceFormatter";
import "./Recommendations.css";

type Recommendation = {
	coin: CoinsModel;
	recommendation: "buy" | "do not buy";
	reason: string;
	loading: boolean;
	error?: string;
};

export function Recommendations() {
	const allCoins = useSelector((state: AppState) => state.coins);
	const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);

	const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const selectedCoins = useMemo(() => {
		return allCoins.filter(coin => coin.id && selectedCoinIds.includes(coin.id));
	}, [allCoins, selectedCoinIds]);

	useEffect(() => {
		if (selectedCoinIds.length === 0) {
			setRecommendations([]);
			return;
		}

		let isCancelled = false;

		async function fetchRecommendations() {
			setLoading(true);
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
					// Get detailed coin data
					const coinData = await coinsService.getCoinDataForRecommendation(coin.id);

					if (isCancelled || !coinData) {
						return null;
					}

					// Get recommendation from OpenAI
					const recommendation = await openAiService.getCoinRecommendation(coinData);

					if (isCancelled || !recommendation) {
						return null;
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
				setRecommendations(results.filter(r => r !== null) as Recommendation[]);
			}

			setLoading(false);
		}

		fetchRecommendations();

		return () => {
			isCancelled = true;
		};
	}, [selectedCoinIds, selectedCoins]);


	if (selectedCoinIds.length === 0) {
		return (
			<div className="Recommendations">
				<div className="Recommendations-empty">
					<h2>No Coins Selected</h2>
					<p>Please select coins on the Home page to view AI-powered recommendations.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="Recommendations">
			<div className="Recommendations-header">
				<h1>AI-Powered Cryptocurrency Recommendations</h1>
				<p className="Recommendations-subtitle">
					Get personalized buy/sell recommendations based on market data analysis
				</p>
				{loading && (
					<div className="Recommendations-loading">
						<p>Analyzing selected coins...</p>
					</div>
				)}
			</div>

			<div className="Recommendations-content">
				<div className="Recommendations-grid">
					{recommendations.map((rec) => (
						<div
							key={rec.coin.id}
							className={`Recommendations-card ${rec.recommendation === "buy" ? "buy" : "dont-buy"} ${rec.loading ? "loading" : ""}`}
						>
							<div className="Recommendations-card-header">
								{rec.coin.image && (
									<img src={rec.coin.image} alt={rec.coin.name} />
								)}
								<div className="Recommendations-card-title">
									<h3>{rec.coin.name}</h3>
									<p className="Recommendations-card-symbol">
										{rec.coin.symbol?.toUpperCase()}
									</p>
								</div>
							</div>

							{rec.coin.current_price && (
								<div className="Recommendations-price">
									<span className="Recommendations-price-label">Current Price:</span>
									<span className="Recommendations-price-value">
										{PriceFormatter.formatCurrency(rec.coin.current_price)}
									</span>
								</div>
							)}

							{rec.loading ? (
								<div className="Recommendations-recommendation loading">
									<div className="Recommendations-spinner"></div>
									<p>Analyzing...</p>
								</div>
							) : (
								<>
									<div className={`Recommendations-badge ${rec.recommendation}`}>
										{rec.recommendation === "buy" ? "✓ BUY" : "✗ DO NOT BUY"}
									</div>
									<div className="Recommendations-reason">
										<p>{rec.reason}</p>
									</div>
								</>
							)}

							{rec.coin.market_cap && (
								<div className="Recommendations-stats">
									<div className="Recommendations-stat">
										<span>Market Cap:</span>
										<span>{PriceFormatter.formatCurrency(rec.coin.market_cap)}</span>
									</div>
									{rec.coin.total_volume && (
										<div className="Recommendations-stat">
											<span>Volume (24h):</span>
											<span>{PriceFormatter.formatCurrency(rec.coin.total_volume)}</span>
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
