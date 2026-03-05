import {
	Container,
	Box,
	Typography,
	Card,
	CardContent,
	Avatar,
	Stack,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { TrendingUp, Assessment, Recommend, Star } from "@mui/icons-material";

export function About() {
	return (
		<Box sx={{ py: 6 }}>
			<Container maxWidth="lg">
				<Card
					sx={{
						background: 'linear-gradient(145deg, rgba(10, 14, 26, 0.95) 0%, rgba(5, 8, 16, 0.98) 100%)',
						boxShadow: '0 0 50px rgba(0, 245, 255, 0.08)',
						borderRadius: 2,
						overflow: 'hidden',
						border: '1px solid rgba(0, 245, 255, 0.25)',
					}}
				>
					<Box
						sx={{
							background: 'linear-gradient(135deg, #050810 0%, #00f5ff 50%, #ff00aa 100%)',
							py: 6,
							textAlign: 'center',
							borderBottom: '1px solid rgba(0, 245, 255, 0.3)',
						}}
					>
						<Typography
							variant="h2"
							component="h1"
							gutterBottom
							sx={{
								color: '#e0f7ff',
								fontFamily: "'Orbitron', sans-serif",
								letterSpacing: '0.08em',
								textShadow: '0 0 30px rgba(0, 245, 255, 0.5)',
							}}
						>
							ABOUT CRYPTOGRAPH
						</Typography>
					</Box>

					<CardContent sx={{ p: 5 }}>
						<Box sx={{ mb: 6 }}>
							<Typography
								variant="h4"
								component="h2"
								gutterBottom
								sx={{
									color: '#00f5ff',
									pb: 2,
									borderBottom: '2px solid rgba(0, 245, 255, 0.5)',
									mb: 3,
									letterSpacing: '0.04em',
								}}
							>
								PROJECT DESCRIPTION
							</Typography>
							<Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 2, color: '#c8d4e0' }}>
								CryptoGraph is a comprehensive cryptocurrency tracking and analysis application
								designed to help users monitor and analyze digital assets in real-time. The application
								provides users with powerful tools to explore the cryptocurrency market, make informed
								decisions, and stay updated with the latest market trends.
							</Typography>
							<Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 2, color: '#c8d4e0' }}>
								Key features include:
							</Typography>
							<List sx={{ '& .MuiListItemText-primary': { color: '#e0f7ff', fontWeight: 600 }, '& .MuiListItemText-secondary': { color: '#8ba3b5' } }}>
								<ListItem>
									<ListItemIcon>
										<TrendingUp sx={{ color: '#00f5ff' }} />
									</ListItemIcon>
									<ListItemText
										primary="Real-time Market Data"
										secondary="View up-to-date prices and market information for over 100 cryptocurrencies"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<Assessment sx={{ color: '#00f5ff' }} />
									</ListItemIcon>
									<ListItemText
										primary="Interactive Charts"
										secondary="Analyze price trends with dynamic line charts and historical data"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<Recommend sx={{ color: '#00f5ff' }} />
									</ListItemIcon>
									<ListItemText
										primary="AI-Powered Recommendations"
										secondary="Get personalized buy/sell recommendations based on market analysis"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<Star sx={{ color: '#00f5ff' }} />
									</ListItemIcon>
									<ListItemText
										primary="Comprehensive Reports"
										secondary="Access detailed reports with price changes, market cap, and trading volume"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<Star sx={{ color: '#00f5ff' }} />
									</ListItemIcon>
									<ListItemText
										primary="Multi-Currency Support"
										secondary="View prices in USD, EUR, and ILS"
									/>
								</ListItem>
							</List>
							<Typography variant="body1" component="p" sx={{ lineHeight: 1.8, mt: 2, color: '#c8d4e0' }}>
								The application integrates with the CoinGecko and CryptoCompare APIs to deliver accurate market data, and leverages an AI model to provide intelligent investment recommendations.
							</Typography>
						</Box>

						<Divider sx={{ my: 4, borderColor: 'rgba(0, 245, 255, 0.2)' }} />

							<Typography
								variant="h4"
								component="h2"
								gutterBottom
								sx={{
									color: '#00f5ff',
									pb: 2,
									borderBottom: '2px solid rgba(0, 245, 255, 0.5)',
									mb: 3,
									letterSpacing: '0.04em',
								}}
							>
								DEVELOPER INFORMATION
							</Typography>
							<Box
								sx={{
									background: 'rgba(0, 245, 255, 0.04)',
									p: 4,
									borderRadius: 2,
									border: '1px solid rgba(0, 245, 255, 0.25)',
								}}
							>
								<Stack
									direction={{ xs: 'column', md: 'row' }}
									spacing={4}
									alignItems={{ xs: 'center', md: 'flex-start' }}
								>
									<Avatar
										src="/Images/my pitcure.png"
										alt="David Veryutin"
										sx={{
											width: 200,
											height: 200,
											border: '3px solid #00f5ff',
											boxShadow: '0 0 25px rgba(0, 245, 255, 0.4)',
											'& img': { objectPosition: 'right center' },
										}}
									/>
									<Box sx={{ flex: 1, width: '100%' }}>
										<Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(0, 245, 255, 0.2)' }}>
											<Typography variant="caption" sx={{ color: '#00f5ff', fontWeight: 600 }}>
												Name
											</Typography>
											<Typography variant="h6" sx={{ color: '#e0f7ff' }}>David</Typography>
										</Box>
										<Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(0, 245, 255, 0.2)' }}>
											<Typography variant="caption" sx={{ color: '#00f5ff', fontWeight: 600 }}>
												Lastname
											</Typography>
											<Typography variant="h6" sx={{ color: '#e0f7ff' }}>Veryutin</Typography>
										</Box>
										<Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(0, 245, 255, 0.2)' }}>
											<Typography variant="caption" sx={{ color: '#00f5ff', fontWeight: 600 }}>
												Birthdate
											</Typography>
											<Typography variant="h6" sx={{ color: '#e0f7ff' }}>05.01.1990</Typography>
										</Box>
										<Box>
											<Typography variant="caption" sx={{ color: '#00f5ff', fontWeight: 600 }}>
												Education
											</Typography>
											<Typography variant="h6" sx={{ color: '#e0f7ff' }}>
												A student in the Full Stack GenAI course at John Bryce Academy
											</Typography>
										</Box>
									</Box>
								</Stack>
							</Box>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}
