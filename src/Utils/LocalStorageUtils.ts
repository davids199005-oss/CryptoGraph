/**
 * Utilities for working with localStorage
 */

const SELECTED_COINS_KEY = 'cryptograph_selected_coins';

/**
 * Saves selected coins to localStorage
 */
export function saveSelectedCoinsToStorage(coinIds: string[]): void {
    try {
        localStorage.setItem(SELECTED_COINS_KEY, JSON.stringify(coinIds));
    } catch (error) {
        console.error('Error saving selected coins to localStorage:', error);
    }
}

/**
 * Loads selected coins from localStorage
 */
export function loadSelectedCoinsFromStorage(): string[] {
    try {
        const stored = localStorage.getItem(SELECTED_COINS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Verify that it's an array of strings
            if (Array.isArray(parsed) && parsed.every(id => typeof id === 'string')) {
                return parsed;
            }
        }
    } catch (error) {
        console.error('Error loading selected coins from localStorage:', error);
    }
    return [];
}

/**
 * Clears saved selected coins from localStorage
 */
export function clearSelectedCoinsFromStorage(): void {
    try {
        localStorage.removeItem(SELECTED_COINS_KEY);
    } catch (error) {
        console.error('Error clearing selected coins from localStorage:', error);
    }
}
