/**
 * Counter – core counter logic with optional localStorage persistence.
 * Interfaces layer: browser-side script (also usable from Node.js tests via UMD).
 *
 * Usage (browser, auto-wired):
 *   Just include this script after counter-store.js; the counter bootstraps
 *   itself on DOMContentLoaded using window.localStorage.
 *
 * Usage (tests / manual):
 *   const Counter = require('./counter')
 *   const api = Counter.createCounter({ document: fakeDoc, storage: fakeStorage })
 */
;(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory()
  } else {
    root.Counter = factory()
  }
}(typeof self !== 'undefined' ? self : this, function () {
  /**
   * Create a counter instance wired to the given document and storage.
   *
   * @param {object}  opts
   * @param {Document} [opts.document]  – DOM document (optional; omit in pure-logic tests)
   * @param {Storage}  [opts.storage]   – Web Storage instance for persistence
   * @param {object}   [opts.store]     – CounterStore module (defaults to window.CounterStore)
   * @param {number}   [opts.initial]   – Initial value when no persisted value exists (default 0)
   * @returns {{ increment, decrement, reset, getValue }}
   */
  function createCounter (opts) {
    opts = opts || {}

    const doc = opts.document || null
    const storage = opts.storage || null
    const store = opts.store ||
      (typeof CounterStore !== 'undefined' ? CounterStore : null) // eslint-disable-line no-undef
    const fallbackInitial = typeof opts.initial === 'number' ? opts.initial : 0

    // Hydrate from storage when available, otherwise use fallbackInitial
    let count = (storage && store) ? store.load(storage) : fallbackInitial

    function _updateDisplay () {
      if (doc) {
        const el = doc.getElementById('counterDisplay')
        if (el) el.innerText = String(count)
      }
    }

    function _persist () {
      if (storage && store) {
        store.save(storage, count)
      }
    }

    function increment () {
      count++
      _persist()
      _updateDisplay()
      return count
    }

    function decrement () {
      if (count > 0) count--
      _persist()
      _updateDisplay()
      return count
    }

    function reset () {
      count = 0
      if (storage && store) {
        store.clear(storage)
      }
      _updateDisplay()
      return count
    }

    function getValue () {
      return count
    }

    // Render initial value to the DOM straight away
    _updateDisplay()

    return { increment, decrement, reset, getValue }
  }

  // ─── Browser auto-wire ─────────────────────────────────────────────────────
  // Only run when we are actually in a browser context with a real document.
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      const store = (typeof CounterStore !== 'undefined' ? CounterStore : null) // eslint-disable-line no-undef
      const counter = createCounter({
        document: document,
        storage: window.localStorage,
        store: store
      })

      const btnIncrement = document.getElementById('incrementButton')
      const btnDecrement = document.getElementById('decrementButton')
      const btnReset = document.getElementById('resetButton')

      if (btnIncrement) btnIncrement.addEventListener('click', counter.increment)
      if (btnDecrement) btnDecrement.addEventListener('click', counter.decrement)
      if (btnReset) btnReset.addEventListener('click', counter.reset)
    })
  }

  return { createCounter }
}))
