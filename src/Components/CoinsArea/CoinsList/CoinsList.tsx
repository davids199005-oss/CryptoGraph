import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SearchOff, Inbox } from "@mui/icons-material";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { CoinsCard } from "../CoinsCard/CoinsCard";
import { AppState } from "../../../Redux/AppState";
import { coinsSlice } from "../../../Redux/CoinsSlice";

/**
 * Grid of cryptocurrency cards with search filter and loading/empty states.
 * Fetches the coins list once on mount and stores it in Redux; filters by the global
 * search query (name or ID). Renders CoinsCard for each matching coin.
 */
export function CoinsList() {
	const dispatch = useDispatch();
	const coinsFromStore = useSelector((state: AppState) => state.coins);
	const searchQuery = useSelector((state: AppState) => state.searchQuery);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		// If coins are already in store, don't fetch again (caching optimization)
		if (coinsFromStore.length > 0) {
			return;
		}

		let isMounted = true;
		setIsLoading(true);
		setLoadError(null);
		coinsService.getCoinsList()
			.then((coins: CoinsModel[]) => {
				if (!isMounted) return;
				dispatch(coinsSlice.actions.initCoins(coins));
				setLoadError(null);
			})
			.catch((err: Error) => {
				console.error("Error loading coins:", err);
				if (isMounted) {
					setLoadError("Failed to load coins. Please try again.");
				}
			})
			.finally(() => {
				if (isMounted) {
					setIsLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
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
					<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
						<Skeleton
							variant="rectangular"
							height={300}
							sx={{
								borderRadius: 3,
								background: 'linear-gradient(90deg, rgba(0, 245, 255, 0.08) 25%, rgba(0, 245, 255, 0.18) 50%, rgba(0, 245, 255, 0.08) 75%)',
								backgroundSize: '200% 100%',
								animation: 'shimmer 2s infinite',
							}}
						/>
					</Grid>
				))}
			</Grid>
		);
	}

	const STAGGER_DELAY_MS = 50;
	const STAGGER_MAX_DELAY_MS = 300;

	// Empty state when no coins loaded (error or no data)
	if (coinsFromStore.length === 0 && !isLoading) {
		return (
			<Box sx={{ textAlign: 'center', py: 10 }}>
				{loadError ? (
					<>
						<Typography variant="h6" color="error" sx={{ mb: 2 }}>
							{loadError}
						</Typography>
					</>
				) : (
					<>
						<Inbox sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
						<Typography variant="h6" color="text.secondary">
							No coins available
						</Typography>
					</>
				)}
			</Box>
		);
	}

	// No results for search query
	if (filteredCoins.length === 0) {
		return (
			<Box sx={{ textAlign: 'center', py: 10 }}>
				<SearchOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
				<Typography variant="h6" color="text.secondary">
					No matches for "{searchQuery}"
				</Typography>
			</Box>
		);
	}

	// Render filtered coins grid with stagger animation
	return (
		<Grid container spacing={3}>
			{filteredCoins.map((coin, index) => {
				const delay = Math.min(index * STAGGER_DELAY_MS, STAGGER_MAX_DELAY_MS);
				return (
					<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={coin.id}>
						<Box
							sx={{
								animation: 'fadeInUp 0.5s ease-out both',
								animationDelay: `${delay}ms`,
							}}
						>
							<CoinsCard coin={coin} />
						</Box>
					</Grid>
				);
			})}
		</Grid>
	);
}