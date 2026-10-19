/**
 * Shared data shapes (JSDoc typedefs). They only exist for editor
 * auto-completion and documentation; nothing here runs at runtime.
 *
 * @typedef {Object} ExpressionItem
 * @property {string} id
 * @property {'expression'} type
 * @property {string} text      What the user typed, e.g. "y = a * sin(x)"
 * @property {string} color     Hex color of the curve, e.g. "#2d70b3"
 * @property {boolean} visible  Whether the curve is drawn
 *
 * @typedef {Object} SliderItem
 * @property {string} id
 * @property {'slider'} type
 * @property {string} name      Variable name used in expressions, e.g. "a"
 * @property {number} value
 * @property {number} min
 * @property {number} max
 * @property {number} step
 *
 * @typedef {ExpressionItem | SliderItem} Item
 *
 * @typedef {Object} ChangeEvent
 * @property {'add' | 'update' | 'remove'} type
 * @property {string} id
 *
 * @typedef {Object} ItemHandlers
 * @property {(id: string, changes: Partial<Item>) => void} onUpdate
 * @property {(id: string) => void} onRemove
 *
 * @typedef {Object} Curve
 * @property {string} id
 * @property {string} color
 * @property {(x: number) => number} evaluate  Returns NaN where the curve is undefined
 */
export {};
