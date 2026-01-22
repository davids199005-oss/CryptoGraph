import { Container, Typography, Box } from "@mui/material";
import { CoinsList } from "../../CoinsArea/CoinsList/CoinsList";

export function Home() {
	return (
		<Box
			sx={{
				minHeight: '100vh',
				py: 6,
				background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.9) 0%, rgba(18, 22, 51, 0.95) 100%)',
			}}
		>
			<Container maxWidth="xl">
				<Typography
					variant="h2"
					component="h1"
					sx={{
						textAlign: 'center',
						mb: 1,
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}
				>
					Cryptocurrency Market
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
					sx={{ textAlign: 'center', mb: 6 }}
				>
					Explore the top cryptocurrencies and track real-time prices
				</Typography>
				<CoinsList />
			</Container>
		</Box>
	);
}
