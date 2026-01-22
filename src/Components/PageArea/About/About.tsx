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
		<Box
			sx={{
				minHeight: '100vh',
				py: 6,
				background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.9) 0%, rgba(18, 22, 51, 0.95) 100%)',
			}}
		>
			<Container maxWidth="lg">
				<Card
					sx={{
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)',
						boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
						borderRadius: 4,
						overflow: 'hidden',
						color: '#1a1a1a',
						border: '1px solid rgba(102, 126, 234, 0.2)',
					}}
				>
					<Box
						sx={{
							background: 'linear-gradient(135deg, #030a27 0%, #764ba2 100%)',
							color: 'white',
							py: 6,
							textAlign: 'center',
						}}
					>
						<Typography variant="h2" component="h1" gutterBottom>
							About CryptoGraph
						</Typography>
					</Box>

					<CardContent sx={{ p: 5 }}>
						<Box sx={{ mb: 6 }}>
							<Typography
								variant="h4"
								component="h2"
								gutterBottom
								sx={{
									color: '#1a1a1a',
									pb: 2,
									borderBottom: '3px solid #667eea',
									mb: 3,
								}}
							>
								Project Description
							</Typography>
							<Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 2, color: '#374151' }}>
								CryptoGraph is a comprehensive cryptocurrency tracking and analysis application
								designed to help users monitor and analyze digital assets in real-time. The application
								provides users with powerful tools to explore the cryptocurrency market, make informed
								decisions, and stay updated with the latest market trends.
							</Typography>
							<Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 2, color: '#374151' }}>
								Key features include:
							</Typography>
							<List sx={{ '& .MuiListItemText-primary': { color: '#1a1a1a', fontWeight: 600 }, '& .MuiListItemText-secondary': { color: '#6b7280' } }}>
								<ListItem>
									<ListItemIcon>
										<TrendingUp sx={{ color: '#667eea' }} />
									</ListItemIcon>
									<ListItemText
										primary="Real-time Market Data"
										secondary="View up-to-date prices and market information for over 100 cryptocurrencies"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<Assessment sx={{ color: '#667eea' }} />
									</ListItemIcon>
									<ListItemText
										primary="Interactive Charts"
										secondary="Analyze price trends with dynamic line charts and historical data"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<Recommend sx={{ color: '#667eea' }} />
									</ListItemIcon>
									<ListItemText
										primary="AI-Powered Recommendations"
										secondary="Get personalized buy/sell recommendations based on market analysis"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<Star sx={{ color: '#667eea' }} />
									</ListItemIcon>
									<ListItemText
										primary="Comprehensive Reports"
										secondary="Access detailed reports with price changes, market cap, and trading volume"
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<Star sx={{ color: '#667eea' }} />
									</ListItemIcon>
									<ListItemText
										primary="Multi-Currency Support"
										secondary="View prices in USD, EUR, and ILS"
									/>
								</ListItem>
							</List>
							<Typography variant="body1" component="p" sx={{ lineHeight: 1.8, mt: 2, color: '#374151' }}>
								The application integrates with the CoinGecko and CryptoCompare APIs to deliver accurate market data, and leverages an AI model to provide intelligent investment recommendations.
							</Typography>
						</Box>

						<Divider sx={{ my: 4 }} />

							<Typography
								variant="h4"
								component="h2"
								gutterBottom
								sx={{
									color: '#1a1a1a',
									pb: 2,
									borderBottom: '3px solid #667eea',
									mb: 3,
								}}
							>
								Developer Information
							</Typography>
							<Box
								sx={{
									background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
									p: 4,
									borderRadius: 3,
									border: '2px solid #e5e7eb',
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
											border: '5px solid #667eea',
											boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',										'& img': {
											objectPosition: 'right center',
										},										}}
									/>
									<Box sx={{ flex: 1, width: '100%' }}>
										<Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e5e7eb' }}>
											<Typography variant="caption" color="primary" fontWeight={600}>
												Name
											</Typography>
											<Typography variant="h6" sx={{ color: '#1a1a1a' }}>David</Typography>
										</Box>
										<Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e5e7eb' }}>
											<Typography variant="caption" color="primary" fontWeight={600}>
												Lastname
											</Typography>
											<Typography variant="h6" sx={{ color: '#1a1a1a' }}>Veryutin</Typography>
										</Box>
										<Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e5e7eb' }}>
											<Typography variant="caption" color="primary" fontWeight={600}>
												Birthdate
											</Typography>
											<Typography variant="h6" sx={{ color: '#1a1a1a' }}>05.01.1990</Typography>
										</Box>
										<Box>
											<Typography variant="caption" color="primary" fontWeight={600}>
												Education
											</Typography>
											<Typography variant="h6" sx={{ color: '#1a1a1a' }}>
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
