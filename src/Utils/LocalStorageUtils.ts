/**
 * Utilities for working with localStorage
 */

const SELECTED_COINS_KEY = 'cryptograph_selected_coins';

function isStorageAvailable(): boolean {
    try {
        return typeof localStorage !== 'undefined';
    } catch {
        return false;
    }
}

/**
 * Saves selected coins to localStorage
 */
export function saveSelectedCoinsToStorage(coinIds: string[]): void {
    if (!isStorageAvailable()) {
        return;
    }

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
    if (!isStorageAvailable()) {
        return [];
    }

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
    if (!isStorageAvailable()) {
        return;
    }

    try {
        localStorage.removeItem(SELECTED_COINS_KEY);
    } catch (error) {
        console.error('Error clearing selected coins from localStorage:', error);
    }
}
