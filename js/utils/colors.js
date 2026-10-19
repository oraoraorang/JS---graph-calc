export const PALETTE = ['#c74440', '#2d70b3', '#388c46', '#6042a6', '#fa7e19', '#000000'];

/**
 * Picks the first palette color that no existing expression uses yet.
 * Once every color is taken, it cycles through the palette again.
 * @param {string[]} usedColors colors already assigned
 */
export function pickColor(usedColors) {
  const used = usedColors.map((c) => c.toLowerCase());
  const free = PALETTE.find((color) => !used.includes(color));
  return free ?? PALETTE[usedColors.length % PALETTE.length];
}
