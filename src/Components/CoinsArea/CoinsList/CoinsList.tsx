import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography, Box, Skeleton } from "@mui/material";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { CoinsCard } from "../CoinsCard/CoinsCard";
import { AppState } from "../../../Redux/AppState";
import { coinsSlice } from "../../../Redux/CoinsSlice";

/**
 * CoinsList Component
 * Displays a grid of cryptocurrency coins with filtering and loading states
 * - Fetches coins from API on mount (cached in Redux store to avoid re-fetching)
 * - Filters coins based on global search query
 * - Shows loading skeleton while fetching
 * - Shows error/empty states appropriately
 */
export function CoinsList() {
	const dispatch = useDispatch();
	const coinsFromStore = useSelector((state: AppState) => state.coins);
	const searchQuery = useSelector((state: AppState) => state.searchQuery);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		// If coins are already in store, don't fetch again (caching optimization)
		if (coinsFromStore.length > 0) {
			return;
		}

		setIsLoading(true);
		coinsService.getCoinsList()
			.then((coins: CoinsModel[]) => {
				dispatch(coinsSlice.actions.initCoins(coins));
			})
			.catch((err: Error) => {
				console.error("Error loading coins:", err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [dispatch, coinsFromStore.length]);

	// Normalize search query and filter coins by name or ID
	const normalizedQuery = searchQuery.trim().toLowerCase();
	const filteredCoins = normalizedQuery
		? coinsFromStore.filter(coin => {
			const name = coin.name?.toLowerCase() ?? "";
			const idValue = (coin.id ?? "").toString().toLowerCase();
			return name.includes(normalizedQuery) || idValue.includes(normalizedQuery);
		})
		: coinsFromStore;

	// Loading skeleton state
	if (isLoading && coinsFromStore.length === 0) {
		return (
			<Grid container spacing={3}>
				{Array.from({ length: 12 }).map((_, index) => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
						<Skeleton
							variant="rectangular"
							height={300}
							sx={{
								borderRadius: 3,
								background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.1) 25%, rgba(102, 126, 234, 0.2) 50%, rgba(102, 126, 234, 0.1) 75%)',
								backgroundSize: '200% 100%',
								animation: 'shimmer 2s infinite',
							}}
						/>
					</Grid>
				))}
			</Grid>
		);
	}

	// Empty state when no coins loaded
	if (coinsFromStore.length === 0 && !isLoading) {
		return (
			<Box sx={{ textAlign: 'center', py: 8 }}>
				<Typography variant="h6" color="text.secondary">
					No coins available
				</Typography>
			</Box>
		);
	}

	// No results for search query
	if (filteredCoins.length === 0) {
		return (
			<Box sx={{ textAlign: 'center', py: 8 }}>
				<Typography variant="h6" color="text.secondary">
					No matches for "{searchQuery}"
				</Typography>
			</Box>
		);
	}

	// Render filtered coins grid
	return (
		<Grid container spacing={3}>
			{filteredCoins.map(coin => (
				<Grid item xs={12} sm={6} md={4} lg={3} key={coin.id}>
					<CoinsCard coin={coin} />
				</Grid>
			))}
		</Grid>
	);
}