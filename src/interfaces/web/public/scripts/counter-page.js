/**
 * Counter page wiring.
 * UMD: in the browser, depends on a global CounterStore loaded earlier.
 * In Node tests, CounterStore is required directly and injected via opts.store.
 */
;(function (root, factory) {
  const api = factory(function () {
    if (typeof module !== 'undefined' && module.exports) {
      return require('./counter-store.js')
    }
    return root.CounterStore
  })
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api
  } else {
    root.CounterPage = api
  }
})(typeof self !== 'undefined' ? self : this, function (resolveStore) {
  function setupCounterPage(opts) {
    const doc = opts.document
    const storage = opts.storage
    const store = opts.store || resolveStore()

    const input = doc.getElementById('numero')
    const btnSumar = doc.getElementById('btn-sumar')
    const btnRestar = doc.getElementById('btn-restar')
    const btnReset = doc.getElementById('btn-reset')

    function read() {
      const n = Number(input.value)
      return Number.isFinite(n) ? n : 0
    }

    function write(value) {
      input.value = String(value)
    }

    function persist() {
      store.save(storage, read())
    }

    write(store.load(storage))

    btnSumar.addEventListener('click', function () {
      write(read() + 1)
      persist()
    })

    btnRestar.addEventListener('click', function () {
      write(read() - 1)
      persist()
    })

    btnReset.addEventListener('click', function () {
      write(0)
      store.clear(storage)
    })

    input.addEventListener('change', persist)
    input.addEventListener('input', persist)

    return {
      increment: function () { btnSumar.dispatchEvent(new Event('click')) },
      decrement: function () { btnRestar.dispatchEvent(new Event('click')) },
      reset: function () { btnReset.dispatchEvent(new Event('click')) },
      getValue: read
    }
  }

  return { setupCounterPage: setupCounterPage }
})
