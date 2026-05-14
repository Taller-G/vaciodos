/**
 * CounterStore – persistence helpers for the counter value.
 * Interfaces layer: browser-side storage abstraction.
 *
 * UMD wrapper so this module works both in the browser (window.CounterStore)
 * and in Node.js tests (require('./counter-store')).
 */
;(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory()
  } else {
    root.CounterStore = factory()
  }
}(typeof self !== 'undefined' ? self : this, function () {
  const STORAGE_KEY = 'counter:value'

  /**
   * Load the persisted counter value from storage.
   * Returns 0 when there is no saved value or the saved value is invalid.
   * @param {Storage} storage – any object with getItem / setItem / removeItem
   * @returns {number}
   */
  function load (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY)
      if (raw === null || raw === undefined || raw === '') return 0
      const parsed = Number(raw)
      return Number.isFinite(parsed) ? parsed : 0
    } catch (_) {
      return 0
    }
  }

  /**
   * Persist the counter value to storage.
   * @param {Storage} storage
   * @param {number} value
   */
  function save (storage, value) {
    const n = Number(value)
    storage.setItem(STORAGE_KEY, String(Number.isFinite(n) ? n : 0))
  }

  /**
   * Remove the counter value from storage.
   * @param {Storage} storage
   */
  function clear (storage) {
    storage.removeItem(STORAGE_KEY)
  }

  return { STORAGE_KEY, load, save, clear }
}))
