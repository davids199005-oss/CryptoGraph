import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	Card,
	Typography,
	Button,
	Box,
	Switch,
	FormControlLabel,
	Chip,
	CircularProgress,
	Stack,
	alpha,
} from "@mui/material";
import { TrendingUp, TrendingDown, Visibility, VisibilityOff } from "@mui/icons-material";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { AppState } from "../../../Redux/AppState";
import { selectedCoinsSliceActions } from "../../../Redux/CoinsSlice";
import { RemoveCoinModel } from "../RemoveCoinModel/RemoveCoinModel";
import { PriceFormatter } from "../../../Utils/PriceFormatter";

/**
 * Price data structure for display
 */
type Prices = {
	usd: number;
	eur: number;
	ils: number;
};

type CoinsCardProps = {
	coin: CoinsModel;
};

/**
 * CoinCard Component
 * Displays individual cryptocurrency card with:
 * - Coin info (name, symbol, image)
 * - 24h price change indicator
 * - Multi-currency price display (on demand)
 * - Selection toggle with 5-coin limit
 * - Link to detailed coin page
 */
export function CoinsCard(props: CoinsCardProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);
	
	// Component state
	const [showPrices, setShowPrices] = useState(false);
	const [prices, setPrices] = useState<Prices | null>(null);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	// Check if this coin is currently selected (memoized for performance)
	const isSelected = useMemo(() => 
		props.coin.id ? selectedCoinIds.includes(props.coin.id) : false,
		[props.coin.id, selectedCoinIds]
	);

	// Calculate price change indicator
	const priceChange24h = props.coin.price_change_percentage_24h || 0;
	const isPositive = priceChange24h >= 0;

	/**
	 * Navigate to coin details page
	 */
	const handleViewDetails = useCallback(() => {
		if (!props.coin.id) {
			console.error("Coin ID is missing");
			return;
		}
		const coinId = props.coin.id.trim();
		if (!coinId) {
			console.error("Coin ID is empty after trim");
			return;
		}
		navigate(`/coins/${coinId}`);
	}, [props.coin.id, navigate]);

	/**
	 * Toggle price visibility and fetch prices if needed
	 */
	const handleShowPrices = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const coinId = props.coin.id?.trim();
		if (!coinId) {
			console.warn("Cannot load prices: coin id is missing");
			return;
		}

		if (showPrices) {
			setShowPrices(false);
			setPrices(null);
			return;
		}

		try {
			setLoading(true);
			const coinPrices = await coinsService.getCoinPrices(coinId);
			
			if (coinPrices) {
				setPrices(coinPrices);
				setShowPrices(true);
			}
		} catch (error) {
			console.error("Error loading prices:", error);
		} finally {
			setLoading(false);
		}
	}, [props.coin.id, showPrices]);

	/**
	 * Handle coin selection with limit enforcement
	 * Shows modal if user tries to select more than 5 coins
	 */
	const handleToggleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();

		if (!props.coin.id) return;

		if (isSelected) {
			dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
		} else {
			// Enforce 5-coin maximum
			if (selectedCoinIds.length >= 5) {
				setShowModal(true);
			} else {
				dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
			}
		}
	}, [props.coin.id, isSelected, selectedCoinIds.length, dispatch]);

	/**
	 * Handle coin removal triggered from RemoveCoinModel modal
	 */
	const handleCoinRemovedFromModel = useCallback(() => {
		if (props.coin.id) {
			dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
		}
	}, [props.coin.id, dispatch]);

	return (
		<>
			<Card
				sx={{
					cursor: 'pointer',
					position: 'relative',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					border: isSelected ? '2px solid' : '1px solid',
					borderColor: isSelected ? 'primary.main' : 'rgba(102, 126, 234, 0.3)',
					background: isSelected
						? 'linear-gradient(145deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
						: 'linear-gradient(145deg, rgba(18, 22, 51, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)',
				}}
				onClick={handleViewDetails}
			>
				{/* Selection Toggle */}
				<Box
					sx={{
						position: 'absolute',
						top: 12,
						right: 12,
						zIndex: 10,
					}}
					onClick={(e) => e.stopPropagation()}
				>
					<FormControlLabel
						control={
							<Switch
								checked={isSelected}
								onChange={handleToggleSelect}
								sx={{
									width: 52,
									height: 28,
									padding: 0,
									'& .MuiSwitch-switchBase': {
										padding: 0,
										margin: '2px',
										transitionDuration: '300ms',
										'&.Mui-checked': {
											transform: 'translateX(24px)',
											color: '#fff',
											'& + .MuiSwitch-track': {
												backgroundColor: '#667eea',
												opacity: 1,
												border: 0,
												boxShadow: '0 0 12px rgba(102, 126, 234, 0.6), inset 0 0 8px rgba(102, 126, 234, 0.4)',
											},
											'& .MuiSwitch-thumb': {
												boxShadow: '0 2px 8px rgba(102, 126, 234, 0.8)',
											},
										},
									},
									'&:hover': {
										'& .MuiSwitch-thumb': {
											transform: 'scale(1.15)',
										},
									},
									'& .MuiSwitch-thumb': {
										boxSizing: 'border-box',
										width: 24,
										height: 24,
										transition: 'all 0.3s ease',
										boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
									},
									'& .MuiSwitch-track': {
										borderRadius: 28 / 2,
										backgroundColor: 'rgba(255, 255, 255, 0.2)',
										opacity: 1,
										transition: 'all 0.3s ease',
										border: '1px solid rgba(255, 255, 255, 0.3)',
									},
								}}
							/>
						}
						label=""
					/>
				</Box>

				<Box
					sx={{
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
						textAlign: 'center',
						p: 2,
					}}
				>
					{/* Fixed-height top section so button aligns across all cards */}
					<Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
						{/* Coin Image */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
							<Box
								component="img"
								src={props.coin.image}
								alt={props.coin.name}
								sx={{
									width: 64,
									height: 64,
									borderRadius: '50%',
									boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
									border: '2px solid',
									borderColor: 'primary.main',
								}}
							/>
						</Box>

						{/* Coin Name & Symbol */}
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
							{props.coin.name}
						</Typography>
						<Chip
							label={props.coin.symbol?.toUpperCase()}
							size="small"
							sx={{
								backgroundColor: alpha('#667eea', 0.2),
								color: 'primary.light',
								fontWeight: 600,
								mb: 2,
							}}
						/>

						{/* Price Change 24h - always render same-height block for consistent layout */}
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 0.5,
								mb: 2,
								minHeight: 28,
							}}
						>
							{props.coin.price_change_percentage_24h !== undefined ? (
								<>
									{isPositive ? (
										<TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
									) : (
										<TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
									)}
									<Typography
										variant="body2"
										sx={{
											color: isPositive ? 'success.main' : 'error.main',
											fontWeight: 600,
										}}
									>
										{isPositive ? '+' : ''}
										{priceChange24h.toFixed(2)}%
									</Typography>
								</>
							) : (
								<Typography variant="body2" color="text.secondary">
									—
								</Typography>
							)}
						</Box>

						{/* Show/Hide Prices Button - always at same position */}
						<Button
							variant="outlined"
							fullWidth
							onClick={handleShowPrices}
							disabled={loading}
							startIcon={
								loading ? (
									<CircularProgress size={16} />
								) : showPrices ? (
									<VisibilityOff />
								) : (
									<Visibility />
								)
							}
							sx={{
								mb: showPrices ? 2 : 0,
								borderColor: 'primary.main',
								color: '#ffffff',
								'& .MuiButton-startIcon svg': {
									color: '#ffffff',
								},
								'&:hover': {
									borderColor: 'primary.light',
									backgroundColor: alpha('#667eea', 0.1),
								},
							}}
						>
							{loading ? "Loading..." : showPrices ? "Hide Prices" : "Show Prices"}
						</Button>
					</Box>

					{/* Price Info Section */}
					{showPrices && prices && (
						<Stack spacing={1.5} sx={{ mt: 2 }}>
							<PriceDisplayBox currency="USD" symbol="$" price={prices.usd} />
							<PriceDisplayBox currency="EUR" symbol="€" price={prices.eur} />
							<PriceDisplayBox currency="ILS" symbol="₪" price={prices.ils} />
						</Stack>
					)}
				</Box>
			</Card>

			{/* Modal for coin removal when selection limit reached */}
			{showModal && (
				<RemoveCoinModel
					onClose={() => setShowModal(false)}
					onCoinRemoved={handleCoinRemovedFromModel}
				/>
			)}
		</>
	);
}

/**
 * Helper component for displaying formatted price in a consistent style
 */
function PriceDisplayBox({ currency, symbol, price }: { currency: string; symbol: string; price: number }) {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				p: 1.5,
				borderRadius: 2,
				background: alpha('#667eea', 0.1),
				border: '1px solid',
				borderColor: alpha('#667eea', 0.3),
			}}
		>
			<Typography variant="body2" color="text.secondary" fontWeight={600}>
				{currency}
			</Typography>
			<Typography variant="body1" fontWeight={700} color="primary.light">
				{symbol}{PriceFormatter.formatPrice(price)}
			</Typography>
		</Box>
	);
}
