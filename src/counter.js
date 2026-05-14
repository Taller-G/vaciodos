// Counter logic with UMD wrapper so the same module powers both the
// browser page and node:test unit tests (no jsdom).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Counter = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  function createCounter(deps) {
    const doc = (deps && deps.document) || (typeof document !== 'undefined' ? document : null);
    let count = (deps && typeof deps.initial === 'number') ? deps.initial : 0;

    function render() {
      if (!doc) return;
      const display = doc.getElementById('counterDisplay');
      if (display) display.innerText = String(count);
    }

    function getValue() {
      return count;
    }

    function increment() {
      count++;
      render();
      return count;
    }

    function decrement() {
      if (count > 0) count--;
      render();
      return count;
    }

    function multiply(multiplier) {
      const factor = Number(multiplier);
      if (!Number.isFinite(factor)) return count;
      count = count * factor;
      render();
      return count;
    }

    render();
    return { increment, decrement, multiply, getValue };
  }

  return { createCounter };
});

// Browser auto-wire: when loaded as a <script>, bind buttons to the API.
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    const api = window.Counter.createCounter({ document: document });
    const incBtn = document.getElementById('incrementButton');
    const decBtn = document.getElementById('decrementButton');
    const mulBtn = document.getElementById('multiplyButton');
    const mulInput = document.getElementById('multiplierInput');
    if (incBtn) incBtn.addEventListener('click', api.increment);
    if (decBtn) decBtn.addEventListener('click', api.decrement);
    if (mulBtn && mulInput) {
      mulBtn.addEventListener('click', function () {
        api.multiply(mulInput.value);
      });
    }
  });
}
