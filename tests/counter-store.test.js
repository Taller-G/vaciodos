/**
 * Pure tests for the localStorage-backed counter store.
 * Run with: npm test
 */
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')

const CounterStore = require('../src/interfaces/web/public/scripts/counter-store.js')

function makeFakeStorage(initial) {
  const data = Object.assign({}, initial || {})
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null
    },
    setItem(key, value) {
      data[key] = String(value)
    },
    removeItem(key) {
      delete data[key]
    },
    _data: data
  }
}

describe('CounterStore', () => {
  test('AC-1 save: writes the numeric value under STORAGE_KEY', () => {
    const storage = makeFakeStorage()
    CounterStore.save(storage, 7)
    assert.equal(storage.getItem(CounterStore.STORAGE_KEY), '7')
  })

  test('AC-1 save: round-trips successive updates (auto-persist semantics)', () => {
    const storage = makeFakeStorage()
    CounterStore.save(storage, 1)
    CounterStore.save(storage, 2)
    CounterStore.save(storage, 3)
    assert.equal(storage.getItem(CounterStore.STORAGE_KEY), '3')
  })

  test('AC-2 load: returns the last saved value', () => {
    const storage = makeFakeStorage({ [CounterStore.STORAGE_KEY]: '42' })
    assert.equal(CounterStore.load(storage), 42)
  })

  test('AC-2 load: returns the value after a save-then-load round trip', () => {
    const storage = makeFakeStorage()
    CounterStore.save(storage, -5)
    assert.equal(CounterStore.load(storage), -5)
  })

  test('AC-3 load: returns 0 when no previous data exists', () => {
    const storage = makeFakeStorage()
    assert.equal(CounterStore.load(storage), 0)
  })

  test('AC-3 load: returns 0 when stored value is not numeric', () => {
    const storage = makeFakeStorage({ [CounterStore.STORAGE_KEY]: 'not-a-number' })
    assert.equal(CounterStore.load(storage), 0)
  })

  test('AC-3 load: returns 0 when stored value is empty string', () => {
    const storage = makeFakeStorage({ [CounterStore.STORAGE_KEY]: '' })
    assert.equal(CounterStore.load(storage), 0)
  })

  test('AC-4 clear: removes the key from storage', () => {
    const storage = makeFakeStorage({ [CounterStore.STORAGE_KEY]: '99' })
    CounterStore.clear(storage)
    assert.equal(storage.getItem(CounterStore.STORAGE_KEY), null)
    assert.equal(CounterStore.load(storage), 0)
  })
})
