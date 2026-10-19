import * as ExpressionItem from './ExpressionItem.js';
import * as SliderItem from './SliderItem.js';

let $root = null;
let handlers = null;

/** Remembers the container and the callbacks used by every row. */
export function mount(selector, itemHandlers) {
  $root = $(selector);
  handlers = itemHandlers;
}

/** Draws the whole list (call after an item is added or removed). */
export function render(items) {
  $root.empty();

  if (items.length === 0) {
    $root.append(
      $('<p>', { class: 'px-4 py-8 text-center text-sm text-slate-500' }).text(
        'Nothing here yet. Add an expression or a slider.'
      )
    );
    return;
  }

  items.forEach((item) => {
    const $row = item.type === 'slider' ? SliderItem.create(item, handlers) : ExpressionItem.create(item, handlers);
    $root.append($row);
  });
}

function findRow(id) {
  return $root.children().filter((_, el) => el.dataset.id === id);
}

/** Shows an error message under each row; rows without an entry are cleared. */
export function setErrors(errorsById) {
  $root.children('[data-id]').each((_, el) => {
    $(el).find('[data-role="error"]').first().text(errorsById[el.dataset.id] || '');
  });
}

/** Puts the cursor in the first text field of a row (used after adding an item). */
export function focusItem(id) {
  findRow(id).find('input[type="text"]').first().trigger('focus');
}
