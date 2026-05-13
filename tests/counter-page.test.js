/**
 * Tests for the counter page wiring using fake DOM + fake Storage.
 * Run with: npm test
 */
const { test, describe } = require('node:test')
const assert = require('node:assert/strict')

const CounterStore = require('../src/interfaces/web/public/scripts/counter-store.js')
const { setupCounterPage } = require('../src/interfaces/web/public/scripts/counter-page.js')

function makeFakeElement(initial) {
  const handlers = {}
  return {
    value: initial !== undefined ? String(initial) : '',
    addEventListener(eventName, handler) {
      ;(handlers[eventName] = handlers[eventName] || []).push(handler)
    },
    dispatchEvent(ev) {
      const type = typeof ev === 'string' ? ev : ev && ev.type
      ;(handlers[type] || []).forEach((h) => h())
    },
    _trigger(eventName) {
      ;(handlers[eventName] || []).forEach((h) => h())
    },
    _handlerCount(eventName) {
      return (handlers[eventName] || []).length
    }
  }
}

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

function makeFixture(initialStorage) {
  const input = makeFakeElement(0)
  const btnSumar = makeFakeElement()
  const btnRestar = makeFakeElement()
  const btnReset = makeFakeElement()
  const document = {
    getElementById(id) {
      return {
        numero: input,
        'btn-sumar': btnSumar,
        'btn-restar': btnRestar,
        'btn-reset': btnReset
      }[id] || null
    }
  }
  const storage = makeFakeStorage(initialStorage)
  setupCounterPage({ document, storage })
  return { input, btnSumar, btnRestar, btnReset, storage }
}

describe('setupCounterPage wiring', () => {
  test('AC-1: clicking Sumar persists the new value to localStorage', () => {
    const { input, btnSumar, storage } = makeFixture()
    btnSumar._trigger('click')
    assert.equal(input.value, '1')
    assert.equal(storage.getItem(CounterStore.STORAGE_KEY), '1')
  })

  test('AC-1: clicking Restar persists the new value to localStorage', () => {
    const { input, btnRestar, storage } = makeFixture({ [CounterStore.STORAGE_KEY]: '5' })
    btnRestar._trigger('click')
    assert.equal(input.value, '4')
    assert.equal(storage.getItem(CounterStore.STORAGE_KEY), '4')
  })

  test('AC-1: manual input change persists to localStorage', () => {
    const { input, storage } = makeFixture()
    input.value = '17'
    input._trigger('change')
    assert.equal(storage.getItem(CounterStore.STORAGE_KEY), '17')
  })

  test('AC-2: input is initialised from a previously stored value', () => {
    const { input } = makeFixture({ [CounterStore.STORAGE_KEY]: '42' })
    assert.equal(input.value, '42')
  })

  test('AC-3: input defaults to 0 when localStorage is empty', () => {
    const { input } = makeFixture()
    assert.equal(input.value, '0')
  })

  test('AC-4: clicking Resetear sets the input to 0 and removes the key from localStorage', () => {
    const { input, btnReset, storage } = makeFixture({ [CounterStore.STORAGE_KEY]: '13' })
    assert.equal(input.value, '13', 'sanity: hydrated from storage')
    btnReset._trigger('click')
    assert.equal(input.value, '0')
    assert.equal(storage.getItem(CounterStore.STORAGE_KEY), null)
  })

  test('AC-4: after reset, a fresh load behaves as if there was no previous data', () => {
    const { btnReset, storage } = makeFixture({ [CounterStore.STORAGE_KEY]: '99' })
    btnReset._trigger('click')
    assert.equal(CounterStore.load(storage), 0)
  })
})
