const STORAGE_KEY = 'graphcalc.items.v1';

/**
 * Reads saved items from LocalStorage.
 * @returns {import('../interfaces/types.js').Item[] | null} null if nothing valid is saved
 */
export function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item) => item && typeof item.id === 'string' && (item.type === 'expression' || item.type === 'slider')
    );
  } catch (err) {
    console.warn('Could not read saved items:', err);
    return null;
  }
}

/** @param {import('../interfaces/types.js').Item[]} items */
export function saveItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Could not save items:', err);
  }
}
