/**
 * Utility functions for formatting prices and numbers
 */

export class PriceFormatter {
	private static readonly DEFAULT_CURRENCY = 'USD';
	private static readonly DEFAULT_MIN_FRACTION_DIGITS = 2;
	private static readonly DEFAULT_MAX_FRACTION_DIGITS = 6;

	/**
	 * Formats a price as currency
	 */
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

	/**
	 * Formats a price without currency symbol
	 */
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

	/**
	 * Formats a large number with thousand separators
	 */
	static formatNumber(num: number | undefined): string {
		if (num === undefined || num === null) {
			return "N/A";
		}

		return new Intl.NumberFormat('en-US').format(num);
	}

	/**
	 * Formats a percentage value
	 */
	static formatPercentage(value: number | undefined, decimals: number = 2): string {
		if (value === undefined || value === null) {
			return "N/A";
		}

		const sign = value >= 0 ? "+" : "";
		return `${sign}${value.toFixed(decimals)}%`;
	}

	/**
	 * Formats a date string
	 */
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
