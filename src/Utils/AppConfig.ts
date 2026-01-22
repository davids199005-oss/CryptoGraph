/**
 * Global application configuration
 * Contains all API endpoints and keys used throughout the application
 */
class AppConfig {
    /**
     * CoinGecko API endpoint for fetching top coins with market data
     */
    public readonly CoinListUrl =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

	/**
	 * CoinGecko API endpoint for detailed coin information
	 * Use {id} placeholder for coin identifier
	 */
	public readonly CoinDetailsUrl =
        "https://api.coingecko.com/api/v3/coins/{id}";

	/**
	 * CoinGecko API endpoint for fetching prices in multiple currencies
	 * Use {id} placeholder for comma-separated coin identifiers
	 * Returns prices in USD, EUR, and ILS
	 */
	public readonly CoinPriceUrl =
        "https://api.coingecko.com/api/v3/simple/price?ids={id}&vs_currencies=usd,eur,ils";

    /**
     * CryptoCompare API endpoint for multi-currency price fetching
     * Use {symbols} placeholder for comma-separated symbol list
     */
    public readonly CryptoComparePriceMultiUrl =
        "https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms={symbols}";

    /**
     * OpenAI API endpoint for chat completions
     * (Note: SDK handles this internally, kept for reference)
     */
    public readonly OpenAIChatCompletionsUrl =
        "https://api.openai.com/v1/chat/completions";
    
    /**
     * OpenAI API key loaded from environment variable
     * Must be set in .env as VITE_OPENAI_API_KEY
     */
    public readonly OpenAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
}

export const appConfig = new AppConfig();
