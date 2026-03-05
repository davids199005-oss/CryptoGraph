/**
 * Static helpers for formatting currency, plain numbers, percentages, and dates
 * in a consistent way across the app. Uses en-US locale and returns "N/A" for null/undefined.
 */
export class PriceFormatter {
	private static readonly DEFAULT_CURRENCY = 'USD';
	private static readonly DEFAULT_MIN_FRACTION_DIGITS = 2;
	private static readonly DEFAULT_MAX_FRACTION_DIGITS = 6;

	/** Returns a price formatted as currency (e.g. $1,234.56). */
	static formatCurrency(
		price: number | undefined,
		currency: string = PriceFormatter.DEFAULT_CURRENCY,
		minFractionDigits: number = PriceFormatter.DEFAULT_MIN_FRACTION_DIGITS,
		maxFractionDigits: number = PriceFormatter.DEFAULT_MAX_FRACTION_DIGITS
	): string {
		if (price === undefined || price === null) {
			return "N/A";
		}

		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: minFractionDigits,
			maximumFractionDigits: maxFractionDigits
		}).format(price);
	}

	/** Returns a price as a formatted number without a currency symbol. */
	static formatPrice(
		price: number | undefined,
		minFractionDigits: number = PriceFormatter.DEFAULT_MIN_FRACTION_DIGITS,
		maxFractionDigits: number = PriceFormatter.DEFAULT_MAX_FRACTION_DIGITS
	): string {
		if (price === undefined || price === null) {
			return "N/A";
		}

		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: minFractionDigits,
			maximumFractionDigits: maxFractionDigits
		}).format(price);
	}

	/** Returns a number with locale-aware thousand separators. */
	static formatNumber(num: number | undefined): string {
		if (num === undefined || num === null) {
			return "N/A";
		}

		return new Intl.NumberFormat('en-US').format(num);
	}

	/** Returns a percentage string with optional sign (e.g. +2.50%). */
	static formatPercentage(value: number | undefined, decimals: number = 2): string {
		if (value === undefined || value === null) {
			return "N/A";
		}

		const sign = value >= 0 ? "+" : "";
		return `${sign}${value.toFixed(decimals)}%`;
	}

	/** Returns a localized date string from an ISO or parseable date string. */
	static formatDate(dateString: string | undefined): string {
		if (!dateString) {
			return "N/A";
		}

		try {
			return new Date(dateString).toLocaleDateString();
		} catch {
			return dateString;
		}
	}
}
