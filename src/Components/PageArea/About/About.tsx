import "./About.css";

export function About() {
	return (
		<div className="About">
			<div className="About-container">
				<div className="About-header">
					<h1>About CryptoGraph</h1>
				</div>

				<div className="About-content">
					{/* Project Description */}
					<section className="About-section">
						<h2>Project Description</h2>
						<div className="About-description">
							<p>
								CryptoGraph is a comprehensive cryptocurrency tracking and analysis application
								designed to help users monitor and analyze digital assets in real-time. The application
								provides users with powerful tools to explore the cryptocurrency market, make informed
								decisions, and stay updated with the latest market trends.
							</p>
							<p>
								Key features include:
							</p>
							<ul>
								<li><strong>Real-time Market Data:</strong> View up-to-date prices and market information for over 100 cryptocurrencies</li>
								<li><strong>Interactive Charts:</strong> Analyze price trends with dynamic line charts and historical data</li>
								<li><strong>AI-Powered Recommendations:</strong> Get personalized buy/sell recommendations based on market analysis</li>
								<li><strong>Comprehensive Reports:</strong> Access detailed reports with price changes, market cap, and trading volume</li>
								<li><strong>Multi-Currency Support:</strong> View prices in USD, EUR, and ILS</li>
							</ul>
							<p>
								The application integrates with the CoinGecko and CryptoCompare APIs to deliver accurate market data, and leverages an AI model to provide intelligent investment recommendations.
							</p>
						</div>
					</section>

					{/* Personal Information */}
					<section className="About-section About-personal">
						<h2>Developer Information</h2>
						<div className="About-personal-content">
							<div className="About-photo-container">
								<img
									src="/Images/my pitcure.png"
									alt="David Veryutin"
									className="About-photo"
								/>
							</div>
							<div className="About-personal-info">
								<div className="About-info-item">
									<span className="About-info-label">Name:</span>
									<span className="About-info-value">David</span>
								</div>
								<div className="About-info-item">
									<span className="About-info-label">Lastname:</span>
									<span className="About-info-value">Veryutin</span>
								</div>
								<div className="About-info-item">
									<span className="About-info-label">Birthdate:</span>
									<span className="About-info-value">05.01.1990</span>
								</div>
								<div className="About-info-item">
									<span className="About-info-label">Education:</span>
									<span className="About-info-value">“A student in the Full Stack GenAI course at John Bryce Academy”</span>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
