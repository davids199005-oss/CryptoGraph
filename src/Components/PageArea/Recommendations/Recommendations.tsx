import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
	Container,
	Typography,
	Box,
	Card,
	CardContent,
	CircularProgress,
	Stack,
	Chip,
	Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { AppState } from "../../../Redux/AppState";
import { PriceFormatter } from "../../../Utils/PriceFormatter";
import { useRecommendations } from "../../../Hooks/useRecommendations";

export function Recommendations() {
	const allCoins = useSelector((state: AppState) => state.coins);
	const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);

	const selectedCoins = useMemo(() => {
		return allCoins.filter(coin => coin.id && selectedCoinIds.includes(coin.id));
	}, [allCoins, selectedCoinIds]);

	const { recommendations, loading, apiKeyMissing } = useRecommendations(selectedCoinIds, selectedCoins);

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
		<Box sx={{ py: 4 }}>
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
						<Grid size={{ xs: 12, sm: 6, md: 4 }} key={rec.coin.id}>
							<Card
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									border: rec.recommendation === "buy" ? '2px solid' : '2px solid',
									borderColor: rec.recommendation === "buy" ? 'success.main' : 'error.main',
									background:
										rec.recommendation === "buy"
											? `linear-gradient(145deg, rgba(0, 255, 136, 0.12) 0%, rgba(0, 204, 106, 0.06) 100%)`
											: `linear-gradient(145deg, rgba(255, 51, 102, 0.12) 0%, rgba(204, 41, 82, 0.06) 100%)`,
								}}
							>
								<CardContent sx={{ flexGrow: 1 }}>
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
													backgroundColor: 'rgba(0, 245, 255, 0.15)',
													color: 'primary.light',
													fontWeight: 600,
												}}
											/>
										</Box>
									</Stack>

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

									{rec.loading ? (
										<Box sx={{ textAlign: 'center', py: 4 }}>
											<CircularProgress />
											<Typography variant="body2" sx={{ mt: 2 }}>Analyzing...</Typography>
										</Box>
									) : (
										<>
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

											<Box
												sx={{
													p: 2,
													borderRadius: 2,
													backgroundColor: 'rgba(0, 245, 255, 0.08)',
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
