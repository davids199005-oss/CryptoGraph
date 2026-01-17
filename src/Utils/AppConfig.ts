class AppConfig {

    public readonly CoinListUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";


	public readonly CoinDetailsUrl =
    "https://api.coingecko.com/api/v3/coins/{id}";

	public readonly CoinPriceUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids={id}&vs_currencies=usd,eur,ils";


    public readonly CryptoComparePriceMultiUrl =
    "https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms={symbols}";


    public readonly OpenAIChatCompletionsUrl =
    "https://api.openai.com/v1/chat/completions";
}

export const appConfig = new AppConfig();
