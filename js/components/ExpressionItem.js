import { icons } from '../utils/icons.js';

const DEBOUNCE_MS = 150;

/**
 * Builds one expression row: color, text input, visibility toggle, delete button.
 * @param {import('../interfaces/types.js').ExpressionItem} item
 * @param {import('../interfaces/types.js').ItemHandlers} handlers
 */
export function create(item, { onUpdate, onRemove }) {
  let visible = item.visible;
  let timer = 0;

  const $root = $('<div>', {
    class: 'flex items-start gap-2 border-b border-slate-200 px-3 py-3',
    'data-id': item.id,
    'data-type': 'expression',
  });

  const $color = $('<input>', {
    type: 'color',
    value: item.color,
    title: 'Curve color',
    'aria-label': 'Curve color',
    class: 'mt-1 shrink-0',
  });

  const $text = $('<input>', {
    type: 'text',
    value: item.text,
    placeholder: 'y = sin(x)',
    spellcheck: false,
    autocomplete: 'off',
    'aria-label': 'Expression',
    class:
      'w-full rounded border border-slate-300 px-2 py-1.5 font-mono text-sm focus:border-blue-500 focus:outline-none',
  });

  const $error = $('<p>', { 'data-role': 'error', class: 'mt-1 text-xs text-red-600' });

  const $toggle = $('<button>', {
    type: 'button',
    class: 'mt-1 shrink-0 rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800',
  });

  const $remove = $('<button>', {
    type: 'button',
    title: 'Delete expression',
    'aria-label': 'Delete expression',
    class: 'mt-1 shrink-0 rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600',
  }).html(icons.trash);

  function paintToggle() {
    $toggle
      .html(visible ? icons.eye : icons.eyeOff)
      .attr({
        title: visible ? 'Hide curve' : 'Show curve',
        'aria-label': visible ? 'Hide curve' : 'Show curve',
        'aria-pressed': String(visible),
      });
    $text.toggleClass('opacity-50', !visible);
  }
  paintToggle();

  $text.on('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onUpdate(item.id, { text: $text.val() }), DEBOUNCE_MS);
  });
  $color.on('input', () => onUpdate(item.id, { color: $color.val() }));
  $toggle.on('click', () => {
    visible = !visible;
    paintToggle();
    onUpdate(item.id, { visible });
  });
  $remove.on('click', () => onRemove(item.id));

  return $root.append($color, $('<div>', { class: 'min-w-0 flex-1' }).append($text, $error), $toggle, $remove);
}
