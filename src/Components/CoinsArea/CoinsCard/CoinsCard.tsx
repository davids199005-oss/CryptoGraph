import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	Card,
	CardContent,
	CardMedia,
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

type CoinsCardProps = {
	coin: CoinsModel;
};

type Prices = {
	usd: number;
	eur: number;
	ils: number;
};

export function CoinsCard(props: CoinsCardProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);
	const [showPrices, setShowPrices] = useState(false);
	const [prices, setPrices] = useState<Prices | null>(null);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const isSelected = props.coin.id ? selectedCoinIds.includes(props.coin.id) : false;

	const handleCoinRemovedFromModel = () => {
		if (props.coin.id) {
			dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
		}
	};

	function details() {
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
	}

	async function handleShowPrices(e: React.MouseEvent<HTMLButtonElement>) {
		e.stopPropagation();

		if (showPrices) {
			setShowPrices(false);
			return;
		}

		setLoading(true);
		const coinPrices = await coinsService.getCoinPrices(props.coin.id || "");
		setLoading(false);

		if (coinPrices) {
			setPrices(coinPrices);
			setShowPrices(true);
		}
	}

	function handleToggleSelect(e: React.ChangeEvent<HTMLInputElement>) {
		e.stopPropagation();

		if (!props.coin.id) return;

		if (isSelected) {
			dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
		} else {
			if (selectedCoinIds.length >= 5) {
				setShowModal(true);
			} else {
				dispatch(selectedCoinsSliceActions.toggleCoin(props.coin.id));
			}
		}
	}

	const priceChange24h = props.coin.price_change_percentage_24h || 0;
	const isPositive = priceChange24h >= 0;

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
				onClick={details}
			>
				{/* Selection Switch */}
				<Box
					sx={{
						position: 'absolute',
						top: 12,
						right: 12,
						zIndex: 10,
						backgroundColor: alpha('#000', 0.5),
						borderRadius: 2,
						padding: 0.5,
					}}
					onClick={(e) => e.stopPropagation()}
				>
					<FormControlLabel
						control={
							<Switch
								checked={isSelected}
								onChange={handleToggleSelect}
								size="small"
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked': {
										color: 'primary.main',
									},
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
										backgroundColor: 'primary.main',
									},
								}}
							/>
						}
						label=""
					/>
				</Box>

				<CardContent
					sx={{
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
						textAlign: 'center',
						pb: 2,
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

						{/* Price Change 24h - always render same-height block */}
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
								color: 'primary.light',
								'&:hover': {
									borderColor: 'primary.light',
									backgroundColor: alpha('#667eea', 0.1),
								},
							}}
						>
							{loading ? "Loading..." : showPrices ? "Hide Prices" : "Show Prices"}
						</Button>
					</Box>

					{/* Price Info */}
					{showPrices && prices && (
						<Stack spacing={1.5} sx={{ mt: 2 }}>
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
									USD
								</Typography>
								<Typography variant="body1" fontWeight={700} color="primary.light">
									${PriceFormatter.formatPrice(prices.usd)}
								</Typography>
							</Box>
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
									EUR
								</Typography>
								<Typography variant="body1" fontWeight={700} color="primary.light">
									€{PriceFormatter.formatPrice(prices.eur)}
								</Typography>
							</Box>
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
									ILS
								</Typography>
								<Typography variant="body1" fontWeight={700} color="primary.light">
									₪{PriceFormatter.formatPrice(prices.ils)}
								</Typography>
							</Box>
						</Stack>
					)}
				</CardContent>
			</Card>
			{showModal && (
				<RemoveCoinModel
					onClose={() => setShowModal(false)}
					onCoinRemoved={handleCoinRemovedFromModel}
				/>
			)}
		</>
	);
}
