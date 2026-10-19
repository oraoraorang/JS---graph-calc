import { icons } from '../utils/icons.js';

const DEBOUNCE_MS = 150;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
// Removes floating point noise such as 0.30000000000000004
const tidy = (n) => Number(n.toFixed(10));

const numberInputClass =
  'w-full rounded border border-slate-300 px-1.5 py-1 text-xs focus:border-blue-500 focus:outline-none';

function labeledNumber(label, value) {
  const $input = $('<input>', { type: 'number', value, step: 'any', 'aria-label': label, class: numberInputClass });
  const $wrap = $('<label>', { class: 'flex flex-1 items-center gap-1 text-xs text-slate-500' })
    .append($('<span>').text(label))
    .append($input);
  return { $wrap, $input };
}

/**
 * Builds one slider row: name, value, range input and min/max/step fields.
 * @param {import('../interfaces/types.js').SliderItem} item
 * @param {import('../interfaces/types.js').ItemHandlers} handlers
 */
export function create(item, { onUpdate, onRemove }) {
  // Local copy of the values that are currently valid, used to restore a field after a bad entry.
  const state = { value: item.value, min: item.min, max: item.max, step: item.step };
  let timer = 0;

  const $root = $('<div>', {
    class: 'border-b border-slate-200 bg-slate-50 px-3 py-3',
    'data-id': item.id,
    'data-type': 'slider',
  });

  const $name = $('<input>', {
    type: 'text',
    value: item.name,
    maxlength: 12,
    spellcheck: false,
    autocomplete: 'off',
    'aria-label': 'Slider name',
    class:
      'w-20 rounded border border-slate-300 px-2 py-1 font-mono text-sm focus:border-blue-500 focus:outline-none',
  });

  const $value = $('<input>', {
    type: 'number',
    value: state.value,
    step: 'any',
    'aria-label': 'Slider value',
    class:
      'w-24 rounded border border-slate-300 px-2 py-1 font-mono text-sm focus:border-blue-500 focus:outline-none',
  });

  const $remove = $('<button>', {
    type: 'button',
    title: 'Delete slider',
    'aria-label': 'Delete slider',
    class: 'ml-auto shrink-0 rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600',
  }).html(icons.trash);

  const $range = $('<input>', {
    type: 'range',
    min: state.min,
    max: state.max,
    step: state.step,
    value: state.value,
    'aria-label': 'Slider',
    class: 'mt-2 w-full',
  });

  const min = labeledNumber('min', state.min);
  const max = labeledNumber('max', state.max);
  const step = labeledNumber('step', state.step);

  const $error = $('<p>', { 'data-role': 'error', class: 'mt-1 text-xs text-red-600' });

  // ---- events ----

  $name.on('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onUpdate(item.id, { name: $name.val().trim() }), DEBOUNCE_MS);
  });

  $range.on('input', () => {
    state.value = tidy(Number($range.val()));
    $value.val(state.value);
    onUpdate(item.id, { value: state.value });
  });

  $value.on('change', () => {
    const typed = parseFloat($value.val());
    if (!Number.isFinite(typed)) {
      $value.val(state.value); // not a number: restore the previous value
      return;
    }
    state.value = tidy(clamp(typed, state.min, state.max));
    $value.val(state.value);
    $range.val(state.value);
    onUpdate(item.id, { value: state.value });
  });

  function commitBounds() {
    const next = {
      min: parseFloat(min.$input.val()),
      max: parseFloat(max.$input.val()),
      step: parseFloat(step.$input.val()),
    };
    if (!Object.values(next).every(Number.isFinite)) {
      // Empty or invalid entry: restore the previous values.
      min.$input.val(state.min);
      max.$input.val(state.max);
      step.$input.val(state.step);
      return;
    }
    Object.assign(state, next);
    const changes = { ...next };
    if (next.min < next.max) {
      state.value = tidy(clamp(state.value, next.min, next.max));
      changes.value = state.value;
      $value.val(state.value);
      $range.attr({ min: next.min, max: next.max, step: Math.max(next.step, 1e-9) }).val(state.value);
    }
    onUpdate(item.id, changes);
  }
  [min, max, step].forEach((field) => field.$input.on('change', commitBounds));
  $remove.on('click', () => onRemove(item.id));

  return $root.append(
    $('<div>', { class: 'flex items-center gap-2' }).append(
      $name,
      $('<span>', { class: 'text-slate-500' }).text('='),
      $value,
      $remove
    ),
    $range,
    $('<div>', { class: 'mt-2 flex gap-2' }).append(min.$wrap, max.$wrap, step.$wrap),
    $error
  );
}
