// Draws the curves with function-plot (loaded from the CDN as the global `functionPlot`).

const DEFAULT_X_DOMAIN = [-10, 10];

let container = null;
/** Set once the user pans or zooms, so the view survives slider/expression changes. */
let viewport = null;
/** @type {import('../interfaces/types.js').Curve[]} */
let curves = [];
let frame = 0;
// function-plot reuses its chart object for the same container, so we keep track of
// our own zoom listener and remove only that one (never function-plot's internal ones).
let lastChart = null;
let zoomListener = null;

export function mount(selector) {
  container = $(selector)[0];
  // Redraw whenever the graph area changes size (window resize, mobile layout, ...).
  new ResizeObserver(scheduleDraw).observe(container);
}

/** Replaces the curves that are drawn. */
export function setCurves(nextCurves) {
  curves = nextCurves;
  scheduleDraw();
}

export function resetView() {
  viewport = null;
  scheduleDraw();
}

// Several updates in the same frame (e.g. dragging a slider) are drawn once.
function scheduleDraw() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(draw);
}

function draw() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) return;

  const options = {
    target: container,
    width,
    height,
    grid: true,
    xAxis: { domain: viewport ? viewport.x : DEFAULT_X_DOMAIN },
    data: curves.map((curve) => ({
      graphType: 'polyline',
      color: curve.color,
      fn: (scope) => curve.evaluate(scope.x),
    })),
  };
  // Without a stored viewport function-plot picks the y range that keeps a 1:1 aspect ratio.
  if (viewport) options.yAxis = { domain: viewport.y };

  const chart = window.functionPlot(options);

  if (lastChart && zoomListener) lastChart.removeListener('all:zoom', zoomListener);
  zoomListener = () => {
    viewport = {
      x: [...chart.meta.xScale.domain()],
      y: [...chart.meta.yScale.domain()],
    };
  };
  chart.on('all:zoom', zoomListener);
  lastChart = chart;
}
