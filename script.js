let array = [];
let shouldStop = false;

// Generate new array
function generateArray() {
  array = [];
  shouldStop = false;
  const size = document.getElementById('size').value;
  const container = document.getElementById('bars-container');
  container.innerHTML = '';
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 300) + 10;
    array.push(value);
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}px`;
    container.appendChild(bar);
  }
}

// Delay function
function sleep(ms) {
  const fastMode = document.getElementById("fast-mode").checked;
  return new Promise(resolve => setTimeout(resolve, fastMode ? 0 : ms));
}

// Stop sorting
function stopSort() {
  shouldStop = true;
}

// Start sorting based on selected algorithm
async function startSort() {
  shouldStop = false;
  const algorithm = document.getElementById('algorithm').value;
  const speed = document.getElementById('speed').value;

  switch (algorithm) {
    case 'bubble': await bubbleSort(speed); break;
    case 'selection': await selectionSort(speed); break;
    case 'insertion': await insertionSort(speed); break;
    case 'merge': await mergeSort(0, array.length - 1, speed); break;
    case 'quick': await quickSort(0, array.length - 1, speed); break;
    case 'heap': await heapSort(speed); break;
  }
}

// Swap helper
async function swap(i, j) {
  [array[i], array[j]] = [array[j], array[i]];
  const bars = document.getElementsByClassName('bar');
  bars[i].style.height = `${array[i]}px`;
  bars[j].style.height = `${array[j]}px`;
}

// Bubble Sort
async function bubbleSort(delay) {
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].style.backgroundColor = 'red';
      bars[j + 1].style.backgroundColor = 'red';
      await sleep(delay);
      if (shouldStop) return;

      if (array[j] > array[j + 1]) await swap(j, j + 1);

      bars[j].style.backgroundColor = 'teal';
      bars[j + 1].style.backgroundColor = 'teal';
    }
    bars[array.length - i - 1].style.backgroundColor = 'green';
  }
}

// Selection Sort
async function selectionSort(delay) {
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    let min = i;
    bars[min].style.backgroundColor = 'yellow';
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.backgroundColor = 'red';
      await sleep(delay);
      if (shouldStop) return;

      if (array[j] < array[min]) {
        bars[min].style.backgroundColor = 'teal';
        min = j;
        bars[min].style.backgroundColor = 'yellow';
      } else {
        bars[j].style.backgroundColor = 'teal';
      }
    }
    if (min !== i) await swap(i, min);
    bars[i].style.backgroundColor = 'green';
  }
}

// Insertion Sort
async function insertionSort(delay) {
  const bars = document.getElementsByClassName('bar');
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = 'red';
    await sleep(delay);
    if (shouldStop) return;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1]}px`;
      j--;
      await sleep(delay);
      if (shouldStop) return;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[i].style.backgroundColor = 'teal';
  }
}

// Merge Sort
async function mergeSort(start, end, delay) {
  if (start >= end || shouldStop) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid, delay);
  await mergeSort(mid + 1, end, delay);
  await merge(start, mid, end, delay);
}

async function merge(start, mid, end, delay) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;
  const bars = document.getElementsByClassName('bar');

  while (i < left.length && j < right.length) {
    bars[k].style.backgroundColor = 'purple';
    await sleep(delay);
    if (shouldStop) return;

    if (left[i] <= right[j]) {
      array[k] = left[i++];
    } else {
      array[k] = right[j++];
    }
    bars[k].style.height = `${array[k]}px`;
    bars[k].style.backgroundColor = 'teal';
    k++;
  }

  while (i < left.length) {
    bars[k].style.backgroundColor = 'purple';
    await sleep(delay);
    if (shouldStop) return;
    array[k] = left[i++];
    bars[k].style.height = `${array[k]}px`;
    bars[k].style.backgroundColor = 'teal';
    k++;
  }

  while (j < right.length) {
    bars[k].style.backgroundColor = 'purple';
    await sleep(delay);
    if (shouldStop) return;
    array[k] = right[j++];
    bars[k].style.height = `${array[k]}px`;
    bars[k].style.backgroundColor = 'teal';
    k++;
  }
}

// Quick Sort
async function quickSort(low, high, delay) {
  if (low < high && !shouldStop) {
    const pi = await partition(low, high, delay);
    await quickSort(low, pi - 1, delay);
    await quickSort(pi + 1, high, delay);
  }
}

async function partition(low, high, delay) {
  const pivot = array[high];
  const bars = document.getElementsByClassName('bar');
  bars[high].style.backgroundColor = 'orange';
  let i = low - 1;

  for (let j = low; j < high; j++) {
    bars[j].style.backgroundColor = 'red';
    await sleep(delay);
    if (shouldStop) return high;

    if (array[j] < pivot) {
      i++;
      await swap(i, j);
    }
    bars[j].style.backgroundColor = 'teal';
  }

  await swap(i + 1, high);
  bars[high].style.backgroundColor = 'teal';
  return i + 1;
}

// Heap Sort
async function heapSort(delay) {
  const bars = document.getElementsByClassName('bar');
  let n = array.length;

  for (let i = Math.floor(n / 2 - 1); i >= 0; i--) {
    await heapify(n, i, delay);
    if (shouldStop) return;
  }

  for (let i = n - 1; i > 0; i--) {
    await swap(0, i);
    bars[i].style.backgroundColor = 'green';
    await heapify(i, 0, delay);
    if (shouldStop) return;
  }
  bars[0].style.backgroundColor = 'green';
}

async function heapify(n, i, delay) {
  const bars = document.getElementsByClassName('bar');
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) largest = left;
  if (right < n && array[right] > array[largest]) largest = right;

  if (largest !== i) {
    await swap(i, largest);
    await sleep(delay);
    if (shouldStop) return;
    await heapify(n, largest, delay);
  }
}

// Generate default array on load
generateArray();
