/**
 * CSS Style Tests
 * Validates that the counter page (index.html) uses only black-and-white colors
 * and follows a clean, simple design (no gradients, animations, shadows, etc.)
 */

const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const HTML_PATH = path.join(__dirname, '..', 'src', 'interfaces', 'web', 'public', 'index.html')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract the content of the first <style> block in the HTML file.
 * Returns an empty string if no <style> block is found.
 */
function extractStyleBlock(html) {
  const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
  return match ? match[1] : ''
}

/**
 * Returns true when every color value found in a CSS string is strictly
 * black, white, or a grayscale tone (all three channels equal).
 *
 * Accepted forms:
 *   - Keywords  : black | white | transparent | inherit | currentColor | currentcolor
 *   - Hex       : #rgb or #rrggbb where r==g==b  (e.g. #000, #fff, #333, #aaa)
 *   - rgb/rgba  : rgb(n,n,n) or rgba(n,n,n,a) where all three channel values are equal
 *   - hsl/hsla  : hsl(h,s%,l%) or hsla(h,s%,l%,a) where saturation === 0%
 */
function isGrayscaleCSS(css) {
  // Remove comments first
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '')

  // Collect every colour-like token
  const colorTokens = [
    ...stripped.matchAll(/#([0-9a-fA-F]{3,8})\b/g),
    ...stripped.matchAll(/rgba?\s*\([^)]+\)/gi),
    ...stripped.matchAll(/hsla?\s*\([^)]+\)/gi),
    ...stripped.matchAll(/\b(black|white|transparent|inherit|currentColor|currentcolor)\b/gi),
  ]

  for (const match of colorTokens) {
    const token = match[0]

    // Grayscale keywords — always OK
    if (/^(black|white|transparent|inherit|currentColor|currentcolor)$/i.test(token)) continue

    // Hex colors
    if (token.startsWith('#')) {
      const hex = token.slice(1)
      if (hex.length === 3 || hex.length === 4) {
        // Short form #rgb[a] — grayscale when r==g==b
        const [r, g, b] = [hex[0], hex[1], hex[2]]
        if (r !== g || g !== b) return false
      } else if (hex.length === 6 || hex.length === 8) {
        // Long form #rrggbb[aa] — grayscale when rr==gg==bb
        const r = hex.slice(0, 2)
        const g = hex.slice(2, 4)
        const b = hex.slice(4, 6)
        if (r !== g || g !== b) return false
      }
      continue
    }

    // rgb() / rgba()
    const rgbMatch = token.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number)
      if (r !== g || g !== b) return false
      continue
    }

    // hsl() / hsla() — grayscale when saturation is 0%
    const hslMatch = token.match(/hsla?\s*\(\s*[\d.]+\s*,\s*([\d.]+)%/i)
    if (hslMatch) {
      const saturation = parseFloat(hslMatch[1])
      if (saturation !== 0) return false
      continue
    }
  }

  return true
}

/**
 * Returns true when the CSS does NOT use any "decorative complexity" patterns:
 * gradients, transitions, animations, filters, background images, text-shadow,
 * or more than one font-family declaration.
 */
function isCleanAndSimple(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '')

  const forbidden = [
    /linear-gradient/i,
    /radial-gradient/i,
    /conic-gradient/i,
    /\btransition\b/i,
    /\banimation\b/i,
    /@keyframes/i,
    /\bfilter\b/i,
    /background-image\s*:\s*url\(/i,
    /text-shadow/i,
  ]

  for (const pattern of forbidden) {
    if (pattern.test(stripped)) return false
  }

  // Allow at most one font-family declaration
  const fontFamilyCount = (stripped.match(/font-family\s*:/gi) || []).length
  if (fontFamilyCount > 1) return false

  return true
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Counter page CSS styles', () => {
  let html
  let styleCSS

  test('index.html exists', () => {
    assert.ok(fs.existsSync(HTML_PATH), `Expected file to exist at ${HTML_PATH}`)
    html = fs.readFileSync(HTML_PATH, 'utf8')
  })

  test('index.html contains an embedded <style> block', () => {
    if (!html) html = fs.readFileSync(HTML_PATH, 'utf8')
    styleCSS = extractStyleBlock(html)
    assert.ok(styleCSS.length > 0, 'Expected a non-empty <style> block inside index.html')
  })

  test('all CSS colors are black, white, or grayscale', () => {
    if (!html) html = fs.readFileSync(HTML_PATH, 'utf8')
    if (!styleCSS) styleCSS = extractStyleBlock(html)
    assert.ok(
      isGrayscaleCSS(styleCSS),
      'Found non-grayscale color values in the embedded CSS. Only black, white, and grayscale tones are allowed.'
    )
  })

  test('CSS design is clean and simple (no gradients, animations, shadows, etc.)', () => {
    if (!html) html = fs.readFileSync(HTML_PATH, 'utf8')
    if (!styleCSS) styleCSS = extractStyleBlock(html)
    assert.ok(
      isCleanAndSimple(styleCSS),
      'Found disallowed CSS features (gradient, transition, animation, filter, text-shadow, background-image url, or multiple font-family declarations).'
    )
  })

  test('DOM contract: input#numero exists', () => {
    if (!html) html = fs.readFileSync(HTML_PATH, 'utf8')
    assert.match(html, /id=["']numero["']/, 'Expected an element with id="numero"')
  })

  test('DOM contract: button#btn-sumar exists', () => {
    if (!html) html = fs.readFileSync(HTML_PATH, 'utf8')
    assert.match(html, /id=["']btn-sumar["']/, 'Expected a button with id="btn-sumar"')
  })

  test('DOM contract: button#btn-restar exists', () => {
    if (!html) html = fs.readFileSync(HTML_PATH, 'utf8')
    assert.match(html, /id=["']btn-restar["']/, 'Expected a button with id="btn-restar"')
  })

  test('DOM contract: main.counter exists', () => {
    if (!html) html = fs.readFileSync(HTML_PATH, 'utf8')
    assert.match(html, /class=["'][^"']*counter[^"']*["']/, 'Expected a main element with class "counter"')
  })

  test('DOM contract: .counter__actions exists', () => {
    if (!html) html = fs.readFileSync(HTML_PATH, 'utf8')
    assert.match(html, /counter__actions/, 'Expected an element with class "counter__actions"')
  })
})
