import { initGraphPage } from './pages/GraphPage.js';

$(function () {
  // The libraries come from a CDN; tell the user clearly if they failed to load.
  if (!window.math || !window.functionPlot) {
    $('#load-error')
      .removeClass('hidden')
      .text('Could not load math.js or function-plot from the CDN. Check your internet connection and reload.');
    return;
  }
  initGraphPage();
});
