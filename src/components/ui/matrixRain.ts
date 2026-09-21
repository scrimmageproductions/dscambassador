// Shared digit-rain constants/helpers used by both MatrixTransition (the
// Hero's scroll-driven ambient rain) and BootLoader (the boot screen's own
// ambient rain background) -- kept in their own module, rather than
// exported from either component file, so the two canvases render an
// identical look for a seamless handoff, and so neither component file
// mixes non-component exports into its Fast Refresh boundary.

// Character pool restricted to digits + dollar sign only -- no Katakana, no
// Latin letters, on brand for a finance-culture club rather than a generic
// hacker aesthetic.
export const CHARS = '$0123456789'.split('')
export const FONT_SIZE = 16
// Time between simulation ticks, decoupled from the render loop's frame
// rate -- this is what keeps the fall "moderate" and refined instead of
// hyperactive regardless of a 60Hz vs. 120Hz display.
export const STEP_MS = 130
export const ROWS_PER_STEP = 0.45
// "Atmospheric background motion, not a dense wall of text": only this many
// of the available column slots ever have an active stream at once.
export const MAX_COLUMNS = 26
// #E8E4D9, the exact cream requested for these characters.
export const CREAM_RGB = '232, 228, 217'
export const HEAD_ALPHA_MIN = 0.32
export const HEAD_ALPHA_MAX = 0.55
// Per-tick multiplier applied to every trailing glyph's own alpha (a slower
// decay = a longer-lived tail).
export const TRAIL_DECAY_BASE = 0.85
export const MIN_ALPHA = 0.02

export function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}
