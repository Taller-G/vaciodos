/**
 * Counter persistence module.
 * UMD: usable both via <script> in the browser (exposes window.CounterStore)
 * and via require() in Node tests.
 */
;(function (root, factory) {
  const api = factory()
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api
  } else {
    root.CounterStore = api
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const STORAGE_KEY = 'counter:value'

  function load(storage) {
    let raw
    try {
      raw = storage.getItem(STORAGE_KEY)
    } catch (_err) {
      return 0
    }
    if (raw === null || raw === undefined || raw === '') return 0
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }

  function save(storage, value) {
    const n = Number(value)
    storage.setItem(STORAGE_KEY, Number.isFinite(n) ? String(n) : '0')
  }

  function clear(storage) {
    storage.removeItem(STORAGE_KEY)
  }

  return { STORAGE_KEY, load, save, clear }
})
