'use strict'

const { test } = require('node:test')
const assert = require('node:assert/strict')
const CounterStore = require('../src/interfaces/web/public/scripts/counter-store')
const Counter = require('../src/counter')

// ─── Fake helpers ──────────────────────────────────────────────────────────────

function makeStorage (initial) {
  const data = Object.assign({}, initial)
  return {
    getItem (key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null },
    setItem (key, value) { data[key] = String(value) },
    removeItem (key) { delete data[key] },
    _data () { return data }
  }
}

function makeDocument (initialValue) {
  const el = {
    innerText: String(initialValue === undefined ? 0 : initialValue)
  }
  return {
    getElementById (id) {
      return id === 'counterDisplay' ? el : null
    },
    _display () { return el.innerText }
  }
}

// ─── CounterStore unit tests ───────────────────────────────────────────────────

test('CounterStore.load returns 0 when storage is empty', () => {
  const storage = makeStorage({})
  assert.equal(CounterStore.load(storage), 0)
})

test('CounterStore.load returns 0 when stored value is null', () => {
  const storage = makeStorage({})
  // getItem returns null by default for missing keys
  assert.equal(CounterStore.load(storage), 0)
})

test('CounterStore.load returns 0 when stored value is non-numeric', () => {
  const storage = makeStorage({ [CounterStore.STORAGE_KEY]: 'abc' })
  assert.equal(CounterStore.load(storage), 0)
})

test('CounterStore.load returns 0 when stored value is empty string', () => {
  const storage = makeStorage({ [CounterStore.STORAGE_KEY]: '' })
  assert.equal(CounterStore.load(storage), 0)
})

test('CounterStore.load returns the saved numeric value', () => {
  const storage = makeStorage({ [CounterStore.STORAGE_KEY]: '42' })
  assert.equal(CounterStore.load(storage), 42)
})

test('CounterStore.save persists the value', () => {
  const storage = makeStorage({})
  CounterStore.save(storage, 7)
  assert.equal(storage.getItem(CounterStore.STORAGE_KEY), '7')
})

test('CounterStore.save coerces NaN to 0', () => {
  const storage = makeStorage({})
  CounterStore.save(storage, NaN)
  assert.equal(storage.getItem(CounterStore.STORAGE_KEY), '0')
})

test('CounterStore.clear removes the key', () => {
  const storage = makeStorage({ [CounterStore.STORAGE_KEY]: '5' })
  CounterStore.clear(storage)
  assert.equal(storage.getItem(CounterStore.STORAGE_KEY), null)
})

// ─── Counter persistence tests ─────────────────────────────────────────────────

test('Counter loads persisted value from storage on creation', () => {
  const storage = makeStorage({ [CounterStore.STORAGE_KEY]: '10' })
  const doc = makeDocument(10)
  const counter = Counter.createCounter({ document: doc, storage, store: CounterStore })
  assert.equal(counter.getValue(), 10)
})

test('Counter defaults to 0 when no persisted value exists', () => {
  const storage = makeStorage({})
  const doc = makeDocument(0)
  const counter = Counter.createCounter({ document: doc, storage, store: CounterStore })
  assert.equal(counter.getValue(), 0)
})

test('Counter.increment saves updated value to storage', () => {
  const storage = makeStorage({})
  const doc = makeDocument(0)
  const counter = Counter.createCounter({ document: doc, storage, store: CounterStore })
  counter.increment()
  assert.equal(CounterStore.load(storage), 1)
})

test('Counter.increment updates the display element', () => {
  const storage = makeStorage({})
  const doc = makeDocument(0)
  const counter = Counter.createCounter({ document: doc, storage, store: CounterStore })
  counter.increment()
  assert.equal(doc._display(), '1')
})

test('Counter.decrement saves updated value to storage', () => {
  const storage = makeStorage({ [CounterStore.STORAGE_KEY]: '3' })
  const doc = makeDocument(3)
  const counter = Counter.createCounter({ document: doc, storage, store: CounterStore })
  counter.decrement()
  assert.equal(CounterStore.load(storage), 2)
})

test('Counter.decrement does not go below 0', () => {
  const storage = makeStorage({})
  const doc = makeDocument(0)
  const counter = Counter.createCounter({ document: doc, storage, store: CounterStore })
  counter.decrement()
  assert.equal(counter.getValue(), 0)
  assert.equal(CounterStore.load(storage), 0)
})

test('Counter.reset sets value to 0 and clears storage', () => {
  const storage = makeStorage({ [CounterStore.STORAGE_KEY]: '99' })
  const doc = makeDocument(99)
  const counter = Counter.createCounter({ document: doc, storage, store: CounterStore })
  counter.reset()
  assert.equal(counter.getValue(), 0)
  // After clear the key should not exist (load returns 0)
  assert.equal(CounterStore.load(storage), 0)
})

test('Counter.reset updates the display to 0', () => {
  const storage = makeStorage({ [CounterStore.STORAGE_KEY]: '5' })
  const doc = makeDocument(5)
  const counter = Counter.createCounter({ document: doc, storage, store: CounterStore })
  counter.reset()
  assert.equal(doc._display(), '0')
})

test('Counter persists across simulated page reloads', () => {
  const storage = makeStorage({})
  // First "session"
  const doc1 = makeDocument(0)
  const counter1 = Counter.createCounter({ document: doc1, storage, store: CounterStore })
  counter1.increment()
  counter1.increment()
  counter1.increment()
  assert.equal(counter1.getValue(), 3)

  // Simulate reload: create a new counter instance with the same storage
  const doc2 = makeDocument(0)
  const counter2 = Counter.createCounter({ document: doc2, storage, store: CounterStore })
  assert.equal(counter2.getValue(), 3, 'should restore persisted value after reload')
})
