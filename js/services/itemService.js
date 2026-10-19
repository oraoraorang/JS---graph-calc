import { loadItems, saveItems } from './storage.js';
import { generateId } from '../utils/id.js';
import { PALETTE, pickColor } from '../utils/colors.js';

/** @typedef {import('../interfaces/types.js').Item} Item */
/** @typedef {import('../interfaces/types.js').ChangeEvent} ChangeEvent */

// Letters offered as default slider names (skips x, y, e, i which have a special meaning).
const SLIDER_NAME_POOL = 'abcdfghjklmnopqrstuvwz'.split('');

/** @type {Item[]} */
let items = [];
/** @type {Set<(event: ChangeEvent) => void>} */
const listeners = new Set();

function seedItems() {
  return [
    { id: generateId(), type: 'slider', name: 'a', value: 1, min: -5, max: 5, step: 0.1 },
    { id: generateId(), type: 'expression', text: 'y = a * sin(x)', color: PALETTE[0], visible: true },
  ];
}

function commit(event) {
  saveItems(items);
  listeners.forEach((listener) => listener(event));
}

/** Loads saved items (or the example items on first visit). */
export function init() {
  items = loadItems() ?? seedItems();
}

/** Subscribe to changes. Returns an unsubscribe function. */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ---- Read (list) ----

/** @returns {Item[]} copies, so callers cannot mutate the store by accident */
export function getAll() {
  return items.map((item) => ({ ...item }));
}

// ---- Create (add) ----

export function addExpression(text = '') {
  const usedColors = items.filter((i) => i.type === 'expression').map((i) => i.color);
  const item = { id: generateId(), type: 'expression', text, color: pickColor(usedColors), visible: true };
  items.push(item);
  commit({ type: 'add', id: item.id });
  return { ...item };
}

export function addSlider() {
  const used = new Set(items.filter((i) => i.type === 'slider').map((i) => i.name));
  const free = SLIDER_NAME_POOL.find((letter) => !used.has(letter));
  const name = free ?? `k${used.size + 1}`;
  const item = { id: generateId(), type: 'slider', name, value: 1, min: -10, max: 10, step: 0.1 };
  items.push(item);
  commit({ type: 'add', id: item.id });
  return { ...item };
}

// ---- Update ----

/**
 * @param {string} id
 * @param {Partial<Item>} changes id and type cannot be changed
 */
export function update(id, changes) {
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  const { id: _ignoredId, type: _ignoredType, ...safeChanges } = changes;
  Object.assign(item, safeChanges);
  commit({ type: 'update', id });
  return { ...item };
}

// ---- Delete ----

export function remove(id) {
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  commit({ type: 'remove', id });
  return true;
}
