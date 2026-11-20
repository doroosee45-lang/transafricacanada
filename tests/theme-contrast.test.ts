import {test} from 'node:test';
import assert from 'node:assert/strict';
import {colors} from '../src/theme';

function luminance(hex: string): number {
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(first: string, second: string): number {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('texte courant et boutons conservent un contraste d’au moins 4,5:1', () => {
  for (const [foreground, background] of [
    [colors.white, colors.accent],
    [colors.white, colors.blue],
    [colors.mutedSoft, colors.background],
  ]) {
    assert.ok(contrast(foreground, background) >= 4.5, `${foreground} / ${background}`);
  }
});
