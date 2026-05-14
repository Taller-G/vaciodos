// Initialize counter variable
let count = 0;

// Define increment function
function increment() {
  count++;
  document.getElementById('counterDisplay').innerText = count;
  document.getElementById('incrementButton').addEventListener('click', increment);
}

// Define decrement function
function decrement() {
  if(count > 0) {
    count--;
  }
  document.getElementById('counterDisplay').innerText = count;
  document.getElementById('decrementButton').addEventListener('click', decrement);
}
