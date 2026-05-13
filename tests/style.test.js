/**
 * Style tests for the counter page.
 *
 * AC-1: All elements must be black and white only.
 * AC-2: Design must be clean and simple.
 *
 * Uses Node's built-in test runner (node --test) so no extra deps are needed.
 */
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const HTML_PATH = path.join(
  __dirname,
  '..',
  'src',
  'interfaces',
  'web',
  'public',
  'index.html'
)

const html = fs.readFileSync(HTML_PATH, 'utf8')

const styleMatch = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i)
assert.ok(styleMatch, 'expected an embedded <style> block in index.html')
const css = styleMatch[1]

// --- helpers ---------------------------------------------------------------

// A color literal is "B&W safe" if it is:
//  - the keyword `black`, `white`, `transparent`, `inherit`, `currentColor`, `unset`, `initial`
//  - a #rrggbb or #rgb hex with all channels equal (i.e. grayscale, e.g. #000, #fff, #ccc)
//  - rgb()/rgba() with r=g=b
//  - hsl()/hsla() with saturation === 0
function isGrayscaleColor (token) {
  const t = token.trim().toLowerCase()

  if (['black', 'white', 'transparent', 'inherit', 'currentcolor', 'unset', 'initial', 'none'].includes(t)) {
    return true
  }

  const hex6 = t.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/)
  if (hex6) return hex6[1] === hex6[2] && hex6[2] === hex6[3]

  const hex3 = t.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/)
  if (hex3) return hex3[1] === hex3[2] && hex3[2] === hex3[3]

  const rgb = t.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/)
  if (rgb) return rgb[1] === rgb[2] && rgb[2] === rgb[3]

  const hsl = t.match(/^hsla?\(\s*\d+\s*,\s*(\d+)\s*%\s*,\s*\d+\s*%\s*(?:,\s*[\d.]+\s*)?\)$/)
  if (hsl) return hsl[1] === '0'

  // A named color we don't allow (red, blue, gray etc.) — fail safe: not grayscale.
  if (/^[a-z]+$/.test(t)) return false

  return false
}

// Extract every color-bearing declaration: any property whose name ends in
// `color` (color, background-color, border-color, outline-color, ...) plus
// `background`, `border`, `outline` (shorthands that may embed a color).
function extractColorTokens (cssText) {
  const decls = []
  // Match `prop: value;` declarations. Comments are stripped first.
  const noComments = cssText.replace(/\/\*[\s\S]*?\*\//g, '')
  const declRegex = /([a-zA-Z-]+)\s*:\s*([^;{}]+)\s*;/g
  let m
  while ((m = declRegex.exec(noComments)) !== null) {
    const prop = m[1].toLowerCase()
    const value = m[2].trim()
    if (prop.endsWith('color') || prop === 'background' || prop === 'border' || prop === 'outline') {
      decls.push({ prop, value })
    }
  }
  return decls
}

function colorLiteralsIn (value) {
  // Pull out hex, rgb()/rgba(), hsl()/hsla(), and bare color keywords.
  const literals = []

  const hex = value.match(/#[0-9a-fA-F]{3,8}/g)
  if (hex) literals.push(...hex)

  const fn = value.match(/(?:rgba?|hsla?)\([^)]*\)/gi)
  if (fn) literals.push(...fn)

  // Strip out hex + fn substrings and look for bare keywords.
  let stripped = value
    .replace(/#[0-9a-fA-F]{3,8}/g, ' ')
    .replace(/(?:rgba?|hsla?)\([^)]*\)/gi, ' ')

  const keywords = stripped.match(/\b[a-zA-Z]+\b/g) || []
  // Filter out non-color keywords like units, css functions, etc.
  const nonColorWords = new Set([
    'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset',
    'thin', 'medium', 'thick', 'px', 'em', 'rem', '%', 'auto', 'none', 'hidden',
    'repeat', 'no-repeat', 'center', 'top', 'bottom', 'left', 'right', 'url',
    'var', 'calc', 'min', 'max', 'clamp'
  ])
  for (const kw of keywords) {
    if (nonColorWords.has(kw.toLowerCase())) continue
    // Only treat as a color literal if it's a known color keyword. We use a
    // generous allowlist for our B&W context; everything else triggers a fail.
    if (/^(black|white|transparent|inherit|currentcolor|unset|initial)$/i.test(kw)) {
      literals.push(kw)
    } else {
      // Unknown bare word in a color-bearing decl: flag as a chromatic
      // candidate (e.g. red, blue, gray, lightgray, ...) so the test fails
      // loudly rather than silently passing.
      literals.push(kw)
    }
  }

  return literals
}

// --- AC-1: black & white only ---------------------------------------------

describe('AC-1: all elements are black and white', () => {
  test('every color-bearing CSS declaration uses only B&W (grayscale) values', () => {
    const decls = extractColorTokens(css)
    assert.ok(decls.length > 0, 'expected at least one color-bearing CSS declaration')

    const offenders = []
    for (const { prop, value } of decls) {
      for (const literal of colorLiteralsIn(value)) {
        if (!isGrayscaleColor(literal)) {
          offenders.push(`${prop}: ${value}  (offending literal: ${literal})`)
        }
      }
    }

    assert.deepEqual(
      offenders,
      [],
      `non-B&W colors detected:\n  ${offenders.join('\n  ')}`
    )
  })

  test('body uses white background and black text', () => {
    const bodyBlock = css.match(/body\s*\{([^}]*)\}/i)
    assert.ok(bodyBlock, 'expected a body { ... } rule')
    const body = bodyBlock[1]
    assert.match(body, /background\s*:\s*#?(?:fff(?:fff)?|ffffff|white)\b/i, 'body background must be white')
    assert.match(body, /color\s*:\s*#?(?:000(?:000)?|000000|black)\b/i, 'body text color must be black')
  })

  test('action buttons use B&W only (no chromatic accent colors)', () => {
    // Sibling branch used #2563eb (blue) for #btn-sumar and #dc2626 (red) for
    // #btn-restar. Guard against regressions by asserting buttons themselves
    // declare only grayscale color/background/border.
    const buttonsBlock = css.match(/\.counter__actions\s+button\s*\{([^}]*)\}/i)
    assert.ok(buttonsBlock, 'expected a .counter__actions button { ... } rule')
    for (const { prop, value } of extractColorTokens(buttonsBlock[1])) {
      for (const literal of colorLiteralsIn(value)) {
        assert.ok(
          isGrayscaleColor(literal),
          `button ${prop} must be B&W, got "${literal}" in "${value}"`
        )
      }
    }
  })
})

// --- AC-2: clean and simple -----------------------------------------------

describe('AC-2: design is clean and simple', () => {
  test('no decorative effects (gradients, transitions, animations, background images)', () => {
    const forbidden = [
      { pattern: /linear-gradient\(/i, label: 'linear-gradient' },
      { pattern: /radial-gradient\(/i, label: 'radial-gradient' },
      { pattern: /conic-gradient\(/i, label: 'conic-gradient' },
      { pattern: /\btransition\s*:/i, label: 'transition' },
      { pattern: /\banimation\s*:/i, label: 'animation' },
      { pattern: /@keyframes\b/i, label: '@keyframes' },
      { pattern: /\bfilter\s*:/i, label: 'filter' },
      { pattern: /background-image\s*:\s*(?!none\b)/i, label: 'background-image' },
      { pattern: /\burl\(/i, label: 'url(...) reference' },
      { pattern: /text-shadow\s*:/i, label: 'text-shadow' }
    ]

    const found = forbidden.filter(({ pattern }) => pattern.test(css)).map(({ label }) => label)
    assert.deepEqual(found, [], `decorative CSS detected — keep it simple: ${found.join(', ')}`)
  })

  test('only one font family declared (consistent typography)', () => {
    const fontDecls = (css.match(/font-family\s*:[^;}]+/gi) || [])
    assert.ok(fontDecls.length <= 1, `expected at most 1 font-family declaration for simplicity, found ${fontDecls.length}`)
  })

  test('layout structure stays minimal (single main, grouped actions, labelled input)', () => {
    assert.match(html, /<main\b/i, 'page should have a single <main> region')
    const mainCount = (html.match(/<main\b/gi) || []).length
    assert.equal(mainCount, 1, `expected exactly 1 <main>, found ${mainCount}`)
    assert.match(html, /<label\b[^>]*for\s*=\s*"numero"/i, 'input must have an associated <label>')
    assert.match(html, /class\s*=\s*"counter__actions"/i, 'sum/subtract buttons must be grouped in a single actions container')
  })

  test('no inline style attributes on elements (styles centralised in <style>)', () => {
    const inlineStyles = html.match(/\sstyle\s*=\s*"/gi) || []
    assert.equal(inlineStyles.length, 0, `inline style="..." attributes break clean separation; found ${inlineStyles.length}`)
  })
})
