/**
 * Утилиты для работы с localStorage
 */

const SELECTED_COINS_KEY = 'cryptograph_selected_coins';

/**
 * Сохраняет выбранные монеты в localStorage
 */
export function saveSelectedCoinsToStorage(coinIds: string[]): void {
    try {
        localStorage.setItem(SELECTED_COINS_KEY, JSON.stringify(coinIds));
    } catch (error) {
        console.error('Error saving selected coins to localStorage:', error);
    }
}

/**
 * Загружает выбранные монеты из localStorage
 */
export function loadSelectedCoinsFromStorage(): string[] {
    try {
        const stored = localStorage.getItem(SELECTED_COINS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Проверяем, что это массив строк
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
 * Очищает сохраненные выбранные монеты из localStorage
 */
export function clearSelectedCoinsFromStorage(): void {
    try {
        localStorage.removeItem(SELECTED_COINS_KEY);
    } catch (error) {
        console.error('Error clearing selected coins from localStorage:', error);
    }
}
