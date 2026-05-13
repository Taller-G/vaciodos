/**
 * HTML structure tests for the counter page.
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

describe('counter HTML structure', () => {
  test('has a numeric input field for the number', () => {
    const inputMatch = html.match(/<input\b[^>]*>/i)
    assert.ok(inputMatch, 'expected at least one <input> element')

    const inputTag = inputMatch[0]
    assert.match(
      inputTag,
      /type\s*=\s*"number"/i,
      'input must be type="number" so the user can enter a numeric value'
    )
    assert.match(
      inputTag,
      /id\s*=\s*"numero"/i,
      'input must have a stable id ("numero") so JS can read its value later'
    )
  })

  test('has one button to sum and another to subtract', () => {
    const sumarMatch = html.match(/<button\b[^>]*id\s*=\s*"btn-sumar"[^>]*>([^<]*)<\/button>/i)
    const restarMatch = html.match(/<button\b[^>]*id\s*=\s*"btn-restar"[^>]*>([^<]*)<\/button>/i)

    assert.ok(sumarMatch, 'expected a button with id="btn-sumar"')
    assert.ok(restarMatch, 'expected a button with id="btn-restar"')

    assert.match(sumarMatch[1].trim(), /sumar/i, 'sum button must be labelled "Sumar"')
    assert.match(restarMatch[1].trim(), /restar/i, 'subtract button must be labelled "Restar"')

    const buttonCount = (html.match(/<button\b/gi) || []).length
    assert.ok(buttonCount >= 2, `expected at least 2 buttons, found ${buttonCount}`)
  })

  test('layout is simple and clear (single main region, labeled input, grouped actions)', () => {
    assert.match(html, /<main\b/i, 'page should have a single <main> region for clarity')
    assert.match(html, /<label\b[^>]*for\s*=\s*"numero"/i, 'input should be paired with a <label for="numero"> for clarity')
    assert.match(html, /class\s*=\s*"counter__actions"/i, 'sum and subtract buttons should be grouped in a single actions container')
    assert.match(html, /<!DOCTYPE html>/i, 'page should declare HTML5 doctype')
    assert.match(html, /<title>[^<]*Contador[^<]*<\/title>/i, 'page should have a descriptive <title>')
  })
})
