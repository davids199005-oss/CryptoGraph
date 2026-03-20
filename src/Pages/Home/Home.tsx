/**
 * Home page: market overview with title and the main coins list (searchable, selectable).
 */
import { Container, Typography, Box } from "@mui/material";
import { CoinsList } from "../../Components/CoinsArea/CoinsList/CoinsList";

export function Home() {
	return (
		<Box sx={{ py: 6 }}>
			<Container maxWidth="xl">
				<Typography
					variant="h2"
					component="h1"
					sx={{
						textAlign: 'center',
						mb: 1,
						letterSpacing: '0.08em',
						background: 'linear-gradient(135deg, #00f5ff 0%, #ff00aa 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						textShadow: '0 0 40px rgba(0, 245, 255, 0.3)',
					}}
				>
					CRYPTOCURRENCY MARKET
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
					sx={{ textAlign: 'center', mb: 6, letterSpacing: '0.04em' }}
				>
					Explore the top cryptocurrencies and track real-time prices
				</Typography>
				<CoinsList />
			</Container>
		</Box>
	);
}
