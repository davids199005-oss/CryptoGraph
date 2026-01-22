import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Typography, Box, Skeleton, CircularProgress } from "@mui/material";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { CoinsCard } from "../CoinsCard/CoinsCard";
import { AppState } from "../../../Redux/AppState";
import { coinsSlice } from "../../../Redux/CoinsSlice";

export function CoinsList() {
	const dispatch = useDispatch();
	const coinsFromStore = useSelector((state: AppState) => state.coins);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		// If coins are already in store, don't fetch again
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

	if (coinsFromStore.length === 0 && !isLoading) {
		return (
			<Box sx={{ textAlign: 'center', py: 8 }}>
				<Typography variant="h6" color="text.secondary">
					No coins available
				</Typography>
			</Box>
		);
	}

	return (
		<Grid container spacing={3}>
			{coinsFromStore.map(coin => (
				<Grid item xs={12} sm={6} md={4} lg={3} key={coin.id}>
					<CoinsCard coin={coin} />
				</Grid>
			))}
		</Grid>
	);
}