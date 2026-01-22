import { appConfig } from "../Utils/AppConfig";
import OpenAI from "openai";
import { CoinRecommendationData } from "../Models/ApiTypes";

/**
 * Response type for AI-generated cryptocurrency recommendations
 */
type RecommendationResponse = {
	recommendation: "buy" | "do not buy";
	reason: string;
};

/**
 * Service for communicating with OpenAI's GPT API
 * Provides AI-powered cryptocurrency analysis and recommendations
 */
class OpenAiService {
	/**
	 * Lazily-initialized OpenAI client. We defer creation until the first call
	 * so we can fail gracefully when the API key is missing in the browser env.
	 */
	private client: OpenAI | null = null;

	/**
	 * Preferred model for recommendations. Use a widely available model to avoid runtime failures.
	 */
	private readonly recommendationModel = "gpt-4o-mini";

	public isConfigured(): boolean {
		return Boolean(appConfig.OpenAIApiKey);
	}

	private getClient(): OpenAI {
		if (this.client) {
			return this.client;
		}

		if (!appConfig.OpenAIApiKey) {
			throw new Error("OpenAI API key is missing. Set VITE_OPENAI_API_KEY to enable recommendations.");
		}

		this.client = new OpenAI({
			apiKey: appConfig.OpenAIApiKey,
			dangerouslyAllowBrowser: true,
		});

		return this.client;
	}

    /**
     * Generic method to get chat completions from GPT model
     * @param messages - Array of chat messages with roles and content
     */
    public async getChatCompletions(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
		const response = await this.getClient().chat.completions.create({
			model: this.recommendationModel,
			messages: messages,
		});
		const message = response.choices[0]?.message;
		if (!message) {
			throw new Error("OpenAI returned an empty response");
		}
		return message;
    }

	/**
	 * Analyzes cryptocurrency data and provides a buy/sell recommendation using GPT
	 * @param coinData - Market data for the cryptocurrency
	 * @returns Recommendation object with decision and reasoning, or null on error
	 */
	public async getCoinRecommendation(coinData: CoinRecommendationData): Promise<RecommendationResponse | null> {
		try {
			if (!this.isConfigured()) {
				console.warn("OpenAI API key missing; skipping recommendation request");
				return null;
			}

			const systemPrompt = `You are an AI assistant that analyzes cryptocurrency data and provides a clear, concise recommendation for the user.

Your task:
Given the following coin data, return:

1. "buy" or "do not buy"
2. A short explanation (2–4 sentences) based only on the data provided.

Do NOT add extra financial data, predictions, or external information.
Base your reasoning strictly on the numbers given.

Your response must be in the following JSON format:

{
  "recommendation": "buy" | "do not buy",
  "reason": "string"
}`;

			const userPrompt = `Coin data:
{
  "name": "${coinData.name}",
  "current_price_usd": ${coinData.current_price_usd},
  "market_cap_usd": ${coinData.market_cap_usd},
  "volume_24h_usd": ${coinData.volume_24h_usd},
  "price_change_percentage_30d_in_currency": ${coinData.price_change_percentage_30d_in_currency},
  "price_change_percentage_60d_in_currency": ${coinData.price_change_percentage_60d_in_currency},
  "price_change_percentage_200d_in_currency": ${coinData.price_change_percentage_200d_in_currency}
}`;

			const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt }
			];

			const response = await this.getChatCompletions(messages);
			const normalizedContent = this.normalizeMessageContent(response.content);

			if (!normalizedContent) {
				return null;
			}

			// Try to parse JSON from the response
			let jsonContent = normalizedContent;

			// Remove markdown code blocks if present
			if (jsonContent.startsWith("```json")) {
				jsonContent = jsonContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
			} else if (jsonContent.startsWith("```")) {
				jsonContent = jsonContent.replace(/```\n?/g, "");
			}

			const parsed = JSON.parse(jsonContent) as RecommendationResponse;
			
			// Validate the response format
			if (parsed.recommendation === "buy" || parsed.recommendation === "do not buy") {
				return parsed;
			}

			return null;
		} catch (error) {
			console.error("Error getting coin recommendation:", error);
			return null;
		}
	}

	/**
	 * Normalize OpenAI message content to a plain string regardless of content part type
	 */
	private normalizeMessageContent(
		content: string | Array<{ text?: string } | string> | null | undefined
	): string {
		if (!content) {
			return "";
		}

		if (typeof content === "string") {
			return content.trim();
		}

		if (Array.isArray(content) && content.length > 0) {
			return (content as Array<{ text?: string } | string>)
				.map(part => {
					if (typeof part === "string") {
						return part;
					}
					if ("text" in part && typeof part.text === "string") {
						return part.text;
					}
					return "";
				})
				.join("")
				.trim();
		}

		return "";
	}
}

export const openAiService = new OpenAiService();
