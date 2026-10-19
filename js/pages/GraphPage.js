import * as itemService from '../services/itemService.js';
import { compileExpression, validateSlider } from '../services/mathService.js';
import * as ItemList from '../components/ItemList.js';
import * as GraphView from '../components/GraphView.js';

/**
 * Re-checks every item and redraws the graph.
 * Runs after every change, because an expression depends on the sliders
 * (deleting or renaming a slider can break an expression).
 */
function refresh() {
  const items = itemService.getAll();
  const sliders = items.filter((item) => item.type === 'slider');

  const errors = {};
  const scope = {};
  sliders.forEach((slider) => {
    const error = validateSlider(slider, sliders);
    if (error) errors[slider.id] = error;
    else scope[slider.name] = slider.value;
  });

  const curves = [];
  items
    .filter((item) => item.type === 'expression')
    .forEach((expression) => {
      const result = compileExpression(expression.text, scope);
      if (!result.ok) {
        if (result.error) errors[expression.id] = result.error;
        return;
      }
      if (expression.visible) {
        curves.push({ id: expression.id, color: expression.color, evaluate: result.evaluate });
      }
    });

  ItemList.setErrors(errors);
  GraphView.setCurves(curves);
}

export function initGraphPage() {
  itemService.init();

  ItemList.mount('#item-list', {
    onUpdate: itemService.update,
    onRemove: itemService.remove,
  });
  GraphView.mount('#graph');

  $('#add-expression').on('click', () => itemService.addExpression());
  $('#add-slider').on('click', () => itemService.addSlider());
  $('#reset-view').on('click', () => GraphView.resetView());

  itemService.subscribe((event) => {
    // Edits happen inside the row the user is typing in, so only add/remove rebuild the list.
    if (event.type !== 'update') ItemList.render(itemService.getAll());
    if (event.type === 'add') ItemList.focusItem(event.id);
    refresh();
  });

  ItemList.render(itemService.getAll());
  refresh();
}
