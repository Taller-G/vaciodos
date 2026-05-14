'use strict'

/**
 * Tests for src/interfaces/web/public/index.html
 *
 * Validates:
 *  1. Required DOM elements / IDs are present
 *  2. Embedded CSS uses only grayscale (B&W) colors
 *  3. Forbidden CSS properties / values are absent
 */

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

// ── Load the HTML file ──────────────────────────────────────────────────────
const HTML_PATH = path.join(__dirname, '..', 'src', 'interfaces', 'web', 'public', 'index.html')
const html = fs.readFileSync(HTML_PATH, 'utf8')

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract the text content of the first <style> block.
 * Returns '' if none found.
 */
function extractStyle(source) {
  const match = source.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
  return match ? match[1] : ''
}

/**
 * Returns true when every colour token found in `css` is a greyscale value.
 *
 * Allowed forms:
 *   - named keywords: black, white, transparent, inherit, currentColor
 *   - hex  #rgb or #rrggbb where r===g===b
 *   - rgb(r,g,b) / rgba(r,g,b,a) where r===g===b
 *   - hsl(h,s%,l%) / hsla(h,s%,l%,a) where s===0
 *   - CSS variables (--xxx) — cannot be statically analysed, so we allow them
 */
function isGreyscaleCSS(css) {
  // Named non-greyscale keyword check (very broad safety net)
  const namedColorRe =
    /\b(red|green|blue|yellow|orange|pink|purple|violet|cyan|magenta|lime|teal|navy|maroon|olive|coral|gold|silver(?!\s*;))\b/i
  if (namedColorRe.test(css)) return false

  // hex colors
  const hexRe = /#([0-9a-fA-F]{3,8})\b/g
  let m
  while ((m = hexRe.exec(css)) !== null) {
    const h = m[1]
    if (h.length === 3) {
      if (!(h[0] === h[1] && h[1] === h[2])) return false
    } else if (h.length === 6) {
      const r = h.slice(0, 2)
      const g = h.slice(2, 4)
      const b = h.slice(4, 6)
      if (!(r === g && g === b)) return false
    }
    // 4- or 8-char (with alpha) — we only check rgb channels
    else if (h.length === 8) {
      const r = h.slice(0, 2)
      const g = h.slice(2, 4)
      const b = h.slice(4, 6)
      if (!(r === g && g === b)) return false
    }
    // other lengths → skip (e.g. CSS variable fallback) — leave as pass
  }

  // rgb() / rgba()
  const rgbRe = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g
  while ((m = rgbRe.exec(css)) !== null) {
    if (!(m[1] === m[2] && m[2] === m[3])) return false
  }

  // hsl() / hsla()  — saturation must be 0
  const hslRe = /hsla?\(\s*[\d.]+\s*,\s*([\d.]+)%/g
  while ((m = hslRe.exec(css)) !== null) {
    if (parseFloat(m[1]) !== 0) return false
  }

  return true
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('index.html — DOM contract', () => {
  it('has a <main> element with class "counter"', () => {
    assert.match(html, /<main[^>]*class="[^"]*counter[^"]*"/)
  })

  it('has an <input> with id="numero"', () => {
    assert.match(html, /id="numero"/)
  })

  it('input#numero is of type number', () => {
    // Find the element that has id="numero" and confirm type=number nearby
    const inputRe = /<input[^>]*id="numero"[^>]*>/i
    const match = html.match(inputRe)
    assert.ok(match, '<input id="numero"> not found')
    assert.match(match[0], /type="number"/i)
  })

  it('has a <label> for "numero"', () => {
    assert.match(html, /for="numero"/)
  })

  it('has a button with id="btn-sumar"', () => {
    assert.match(html, /id="btn-sumar"/)
  })

  it('has a button with id="btn-restar"', () => {
    assert.match(html, /id="btn-restar"/)
  })

  it('has a button with id="btn-multiplicar"', () => {
    assert.match(html, /id="btn-multiplicar"/)
  })

  it('has an input for the multiplication factor (id="numero2")', () => {
    assert.match(html, /id="numero2"/)
  })

  it('has a result display element (id="resultado")', () => {
    assert.match(html, /id="resultado"/)
  })

  it('has a reset button (id="btn-reset")', () => {
    assert.match(html, /id="btn-reset"/)
  })

  it('contains .counter__field class', () => {
    assert.match(html, /class="[^"]*counter__field[^"]*"/)
  })

  it('contains .counter__actions class', () => {
    assert.match(html, /class="[^"]*counter__actions[^"]*"/)
  })

  it('page title is set', () => {
    assert.match(html, /<title>[^<]+<\/title>/)
  })

  it('has lang attribute set to "es"', () => {
    assert.match(html, /<html[^>]*lang="es"/)
  })
})

describe('index.html — embedded CSS: grayscale enforcement', () => {
  const css = extractStyle(html)

  it('has an embedded <style> block', () => {
    assert.ok(css.length > 0, 'No <style> block found')
  })

  it('uses only greyscale colors', () => {
    assert.ok(isGreyscaleCSS(css), 'Non-greyscale color found in embedded <style>')
  })

  it('does not use linear-gradient or radial-gradient', () => {
    assert.doesNotMatch(css, /linear-gradient|radial-gradient|conic-gradient/i)
  })

  it('does not use CSS animations or transitions', () => {
    assert.doesNotMatch(css, /\banimation\b|\btransition\b|@keyframes/i)
  })

  it('does not use text-shadow', () => {
    assert.doesNotMatch(css, /text-shadow/i)
  })

  it('does not use background-image with url()', () => {
    assert.doesNotMatch(css, /background-image\s*:[^;]*url\(/i)
  })

  it('does not declare more than one font-family', () => {
    const fontFamilyMatches = css.match(/font-family\s*:/gi) || []
    assert.ok(fontFamilyMatches.length <= 1, `Expected at most 1 font-family declaration, found ${fontFamilyMatches.length}`)
  })
})
