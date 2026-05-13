/**
 * HTML structural assertions for the counter page.
 * Mirrors the contract established by the sibling HTML task and adds the
 * AC-4 requirement that a reset button is present and wired.
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

describe('counter HTML structure', () => {
  test('has a numeric input field with id="numero"', () => {
    const inputMatch = html.match(/<input\b[^>]*>/i)
    assert.ok(inputMatch, 'expected at least one <input> element')
    assert.match(inputMatch[0], /type\s*=\s*"number"/i)
    assert.match(inputMatch[0], /id\s*=\s*"numero"/i)
  })

  test('has sum and subtract buttons (btn-sumar, btn-restar)', () => {
    assert.match(html, /<button\b[^>]*id\s*=\s*"btn-sumar"[^>]*>/i)
    assert.match(html, /<button\b[^>]*id\s*=\s*"btn-restar"[^>]*>/i)
  })

  test('AC-4: has a reset button with id="btn-reset"', () => {
    const resetMatch = html.match(/<button\b[^>]*id\s*=\s*"btn-reset"[^>]*>([^<]*)<\/button>/i)
    assert.ok(resetMatch, 'expected a button with id="btn-reset" to clear the counter')
    assert.match(
      resetMatch[1].trim(),
      /reset/i,
      'reset button label should contain the word "reset" (e.g. "Resetear")'
    )
  })

  test('loads the counter scripts that wire localStorage', () => {
    assert.match(html, /<script\b[^>]*src\s*=\s*"[^"]*counter-store\.js"/i)
    assert.match(html, /<script\b[^>]*src\s*=\s*"[^"]*counter-page\.js"/i)
    assert.match(html, /setupCounterPage\s*\(/i)
    assert.match(html, /window\.localStorage/i)
  })
})
