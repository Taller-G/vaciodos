const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { createCounter } = require('../src/counter.js');

const HTML_PATH = path.join(__dirname, '..', 'src', 'interfaces', 'web', 'public', 'counter.html');
const html = fs.readFileSync(HTML_PATH, 'utf8');

function fakeDocument(initialValues) {
  const elements = new Map();
  Object.entries(initialValues || {}).forEach(([id, value]) => {
    elements.set(id, { id, value, innerText: '' });
  });
  return {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { id, value: '', innerText: '' });
      return elements.get(id);
    },
    _all: elements,
  };
}

test('AC1: HTML page exposes a multiplier input field', () => {
  assert.match(html, /<input[^>]*id=["']multiplierInput["'][^>]*type=["']number["']/);
});

test('AC2: HTML page exposes a button to multiply the current value', () => {
  assert.match(html, /<button[^>]*id=["']multiplyButton["'][^>]*>[^<]*Multiplicar[^<]*<\/button>/);
});

test('AC3: multiply() updates the counter display', () => {
  const doc = fakeDocument({ counterDisplay: '0' });
  const counter = createCounter({ document: doc, initial: 5 });
  counter.multiply(3);
  assert.equal(counter.getValue(), 15);
  assert.equal(doc.getElementById('counterDisplay').innerText, '15');
});

test('AC4: multiply() works correctly with positive and negative values', () => {
  const doc1 = fakeDocument({ counterDisplay: '0' });
  const a = createCounter({ document: doc1, initial: 4 });
  a.multiply(3);
  assert.equal(a.getValue(), 12, 'positive * positive');
  assert.equal(doc1.getElementById('counterDisplay').innerText, '12');

  const doc2 = fakeDocument({ counterDisplay: '0' });
  const b = createCounter({ document: doc2, initial: 5 });
  b.multiply(-2);
  assert.equal(b.getValue(), -10, 'positive current * negative multiplier');
  assert.equal(doc2.getElementById('counterDisplay').innerText, '-10');

  const doc3 = fakeDocument({ counterDisplay: '0' });
  const c = createCounter({ document: doc3, initial: -3 });
  c.multiply(4);
  assert.equal(c.getValue(), -12, 'negative current * positive multiplier');
  assert.equal(doc3.getElementById('counterDisplay').innerText, '-12');

  const doc4 = fakeDocument({ counterDisplay: '0' });
  const d = createCounter({ document: doc4, initial: -6 });
  d.multiply(-2);
  assert.equal(d.getValue(), 12, 'negative current * negative multiplier');
  assert.equal(doc4.getElementById('counterDisplay').innerText, '12');
});
