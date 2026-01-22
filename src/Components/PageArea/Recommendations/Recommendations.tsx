import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
	Container,
	Typography,
	Box,
	Card,
	CardContent,
	Grid,
	CircularProgress,
	Stack,
	Chip,
	Alert,
	alpha,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { AppState } from "../../../Redux/AppState";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { openAiService } from "../../../Services/OpenAiService";
import { PriceFormatter } from "../../../Utils/PriceFormatter";

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
	const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

	const selectedCoins = useMemo(() => {
		return allCoins.filter(coin => coin.id && selectedCoinIds.includes(coin.id));
	}, [allCoins, selectedCoinIds]);

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
					// Get detailed coin data
					const coinData = await coinsService.getCoinDataForRecommendation(coin.id);

					if (isCancelled || !coinData) {
						return null;
					}

					// Get recommendation from OpenAI
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
				setRecommendations(results.filter(r => r !== null) as Recommendation[]);
				setLoading(false);
			}
		}

		fetchRecommendations();

		return () => {
			isCancelled = true;
		};
	}, [selectedCoinIds, selectedCoins]);


	if (selectedCoinIds.length === 0) {
		return (
			<Container maxWidth="xl" sx={{ py: 8 }}>
				<Card>
					<CardContent sx={{ textAlign: 'center', py: 8 }}>
						<Typography variant="h4" gutterBottom>
							No Coins Selected
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Please select coins on the Home page to view AI-powered recommendations.
						</Typography>
					</CardContent>
				</Card>
			</Container>
		);
	}

	return (
		<Box sx={{ minHeight: '100vh', py: 4, background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.9) 0%, rgba(18, 22, 51, 0.95) 100%)' }}>
			<Container maxWidth="xl">
				<Box sx={{ mb: 4, textAlign: 'center' }}>
					<Typography variant="h2" gutterBottom>
						AI-Powered Cryptocurrency Recommendations
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
						Get personalized buy/sell recommendations based on market data analysis
					</Typography>
					{apiKeyMissing && (
						<Alert severity="warning" sx={{ maxWidth: 640, margin: '0 auto' }}>
							Add VITE_OPENAI_API_KEY to enable AI recommendations.
						</Alert>
					)}
					{loading && (
						<Chip
							icon={<CircularProgress size={16} />}
							label="Analyzing selected coins..."
							color="primary"
							variant="outlined"
						/>
					)}
				</Box>

				<Grid container spacing={3}>
					{recommendations.map((rec) => (
						<Grid item xs={12} sm={6} md={4} key={rec.coin.id}>
							<Card
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									border: rec.recommendation === "buy" ? '2px solid' : '2px solid',
									borderColor: rec.recommendation === "buy" ? 'success.main' : 'error.main',
									background:
										rec.recommendation === "buy"
											? `linear-gradient(145deg, ${alpha('#10b981', 0.1)} 0%, ${alpha('#059669', 0.05)} 100%)`
											: `linear-gradient(145deg, ${alpha('#ef4444', 0.1)} 0%, ${alpha('#dc2626', 0.05)} 100%)`,
								}}
							>
								<CardContent sx={{ flexGrow: 1 }}>
									{/* Header */}
									<Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
										{rec.coin.image && (
											<Box
												component="img"
												src={rec.coin.image}
												alt={rec.coin.name}
												sx={{
													width: 56,
													height: 56,
													borderRadius: '50%',
													border: '2px solid',
													borderColor: rec.recommendation === "buy" ? 'success.main' : 'error.main',
												}}
											/>
										)}
										<Box>
											<Typography variant="h6" sx={{ fontSize: '1rem' }}>
												{rec.coin.name}
											</Typography>
											<Chip
												label={rec.coin.symbol?.toUpperCase()}
												size="small"
												sx={{
													backgroundColor: alpha('#667eea', 0.2),
													color: 'primary.light',
													fontWeight: 600,
												}}
											/>
										</Box>
									</Stack>

									{/* Current Price */}
									{rec.coin.current_price && (
										<Box sx={{ mb: 2 }}>
											<Typography variant="body2" color="text.secondary" gutterBottom>
												Current Price
											</Typography>
											<Typography variant="h6" color="primary.light">
												{PriceFormatter.formatCurrency(rec.coin.current_price)}
											</Typography>
										</Box>
									)}

									{/* Loading State */}
									{rec.loading ? (
										<Box sx={{ textAlign: 'center', py: 4 }}>
											<CircularProgress />
											<Typography variant="body2" sx={{ mt: 2 }}>Analyzing...</Typography>
										</Box>
									) : (
										<>
											{/* Recommendation Badge */}
											<Box sx={{ mb: 2 }}>
												<Chip
													icon={
														rec.recommendation === "buy" ? (
															<CheckCircle sx={{ fontSize: 20 }} />
														) : (
															<Cancel sx={{ fontSize: 20 }} />
														)
													}
													label={rec.recommendation === "buy" ? "BUY" : "DO NOT BUY"}
													color={rec.recommendation === "buy" ? "success" : "error"}
													sx={{
														fontWeight: 700,
														fontSize: '0.9rem',
														py: 3,
														width: '100%',
														justifyContent: 'center',
													}}
												/>
											</Box>

											{/* Reason */}
											<Box
												sx={{
													p: 2,
													borderRadius: 2,
													backgroundColor: alpha('#667eea', 0.1),
													borderLeft: '4px solid',
													borderLeftColor: rec.recommendation === "buy" ? 'success.main' : 'error.main',
													mb: 2,
												}}
											>
												<Typography variant="body2" sx={{ lineHeight: 1.6 }}>
													{rec.reason}
												</Typography>
											</Box>
										</>
									)}

									{/* Stats */}
									{rec.coin.market_cap && (
										<Stack spacing={1} sx={{ mt: 'auto' }}>
											<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
												<Typography variant="body2" color="text.secondary">Market Cap:</Typography>
												<Typography variant="body2" fontWeight={600}>
													{PriceFormatter.formatCurrency(rec.coin.market_cap)}
												</Typography>
											</Box>
											{rec.coin.total_volume && (
												<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
													<Typography variant="body2" color="text.secondary">Volume (24h):</Typography>
													<Typography variant="body2" fontWeight={600}>
														{PriceFormatter.formatCurrency(rec.coin.total_volume)}
													</Typography>
												</Box>
											)}
										</Stack>
									)}

									{rec.error && (
										<Typography variant="body2" color="error" sx={{ mt: 1 }}>
											{rec.error}
										</Typography>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
}
