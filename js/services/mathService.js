// Wraps math.js (loaded from the CDN as the global `math`).
const math = window.math;

// Keep a reference to the original parser, then disable the powerful functions
// so a typed expression cannot call them (hardening recommended by the math.js docs).
const parseExpression = math.parse;
const disabled = (name) => () => {
  throw new Error(`Function ${name} is disabled`);
};
math.import(
  {
    import: disabled('import'),
    createUnit: disabled('createUnit'),
    reviver: disabled('reviver'),
    evaluate: disabled('evaluate'),
    parse: disabled('parse'),
    simplify: disabled('simplify'),
    derivative: disabled('derivative'),
    resolve: disabled('resolve'),
  },
  { override: true }
);

/** Removes an optional leading "y =" or "f(x) =". */
export function stripPrefix(text) {
  return text.replace(/^\s*(?:y|f\s*\(\s*x\s*\))\s*=(?!=)\s*/i, '').trim();
}

function cleanMessage(err) {
  return (err && err.message ? err.message : String(err)).replace(/\s+/g, ' ');
}

/** A plottable result is a number (or a complex number, which simply leaves a gap). */
function isPlottable(value) {
  return typeof value === 'number' || math.isComplex(value);
}

/**
 * Finds a variable that is not x, not a slider and not a math.js constant.
 * math.js would silently treat letters like "b" or "m" as units, so we check explicitly
 * to give a clear message.
 */
function findUnknownVariable(node, scope) {
  let unknown = null;
  node.traverse((child, path, parent) => {
    if (unknown || !child.isSymbolNode) return;
    if (parent && parent.isFunctionNode && path === 'fn') return; // function names like sin
    const name = child.name;
    if (name === 'x' || Object.hasOwn(scope, name) || name in math) return;
    unknown = name;
  });
  return unknown;
}

function makeEvaluator(code, scope) {
  const evalScope = { ...scope };
  return (x) => {
    evalScope.x = x;
    try {
      const value = code.evaluate(evalScope);
      return typeof value === 'number' && Number.isFinite(value) ? value : NaN;
    } catch {
      return NaN;
    }
  };
}

/**
 * Parses an expression and checks it can be evaluated with the given slider values.
 * @param {string} text
 * @param {Record<string, number>} scope slider name -> value
 * @returns {{ok: true, evaluate: (x: number) => number} | {ok: false, empty?: boolean, error: string | null}}
 */
export function compileExpression(text, scope) {
  const source = stripPrefix(text);
  if (!source) return { ok: false, empty: true, error: null };

  if (source.includes('=') || source.includes('<') || source.includes('>')) {
    return { ok: false, error: 'Only y = f(x) is supported (no equations or inequalities).' };
  }

  let node;
  let code;
  try {
    node = parseExpression(source);
    code = node.compile();
  } catch (err) {
    return { ok: false, error: cleanMessage(err) };
  }

  const unknown = findUnknownVariable(node, scope);
  if (unknown) {
    return { ok: false, error: `Unknown variable "${unknown}". Add a slider named ${unknown}.` };
  }

  try {
    const probe = code.evaluate({ ...scope, x: 1 });
    if (!isPlottable(probe)) {
      return { ok: false, error: 'The expression must give a number for each x.' };
    }
  } catch (err) {
    return { ok: false, error: cleanMessage(err) };
  }

  return { ok: true, evaluate: makeEvaluator(code, scope) };
}

/**
 * @param {import('../interfaces/types.js').SliderItem} slider
 * @param {import('../interfaces/types.js').SliderItem[]} allSliders
 * @returns {string | null} an error message, or null if the slider is valid
 */
export function validateSlider(slider, allSliders) {
  const name = slider.name;
  if (!name) return 'Name is required.';
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return 'Use letters, digits or _ (not starting with a digit).';
  if (name === 'x' || name === 'y') return `"${name}" is reserved.`;
  if (name in math) return `"${name}" is a built-in name.`;
  if (allSliders.some((other) => other.id !== slider.id && other.name === name)) {
    return `"${name}" is already used by another slider.`;
  }
  if (!(slider.min < slider.max)) return 'Min must be less than max.';
  if (!(slider.step > 0)) return 'Step must be greater than 0.';
  return null;
}
