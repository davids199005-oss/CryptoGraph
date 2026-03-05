/**
 * Persists and loads the list of selected coin IDs in localStorage so selection
 * survives page reloads. Uses a single key; returns an empty array if unavailable.
 */
const SELECTED_COINS_KEY = 'cryptograph_selected_coins';

/** Returns true when localStorage is defined and usable (e.g. not in SSR). */
function isStorageAvailable(): boolean {
    try {
        return typeof localStorage !== 'undefined';
    } catch {
        return false;
    }
}

/** Writes the selected coin IDs to localStorage. No-op if storage is unavailable. */
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

/** Reads the saved selected coin IDs from localStorage; returns [] if missing or invalid. */
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

/** Removes the selected-coins entry from localStorage. */
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
