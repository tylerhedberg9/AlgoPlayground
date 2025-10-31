let data = [];
let isSorting = false;

const barContainer = document.getElementById("barContainer");
const algoSelect = document.getElementById("algoSelect");
const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");
const generateBtn = document.getElementById("generateBtn");
const runBtn = document.getElementById("runBtn");
const algoTitle = document.getElementById("algoTitle");
const algoDesc = document.getElementById("algoDesc");

const algoDescriptions = {
  bubble: "Repeatedly compares adjacent elements and swaps them if out of order.",
  insertion: "Builds the sorted array one item at a time by inserting items into their correct position.",
  selection: "Selects the smallest element from the unsorted part and swaps it into the sorted part.",
  merge: "A divide-and-conquer algorithm that splits the array and merges sorted halves.",
  quick: "Picks a pivot, partitions elements around it, then sorts the subarrays (divide-and-conquer).",
  heap: "Builds a max heap and repeatedly extracts the largest element to the end.",
  counting: "Counts how many times each value appears, then rebuilds the array in order (integers only).",
  radix: "Sorts numbers by digit (ones, tens, hundreds) using a stable sub-sort (integers only)."
};

function randomData(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10);
  }
  return arr;
}

function renderBars(arr, activeIndices = []) {
  barContainer.innerHTML = "";
  arr.forEach((val, idx) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = val * 2 + "px";
    if (activeIndices.includes(idx)) {
      bar.classList.add("active");
    }
    barContainer.appendChild(bar);
  });
}

function setAlgoInfo(key) {
  const titles = {
    bubble: "Bubble Sort",
    insertion: "Insertion Sort",
    selection: "Selection Sort",
    merge: "Merge Sort",
    quick: "Quick Sort",
    heap: "Heap Sort",
    counting: "Counting Sort",
    radix: "Radix Sort"
  };
  algoTitle.textContent = titles[key];
  algoDesc.textContent = algoDescriptions[key];
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// ------------------------------------------------------------------
// 1. Bubble Sort
// ------------------------------------------------------------------
async function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      renderBars(arr, [j, j + 1]);
      await sleep(speedSlider.value);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        renderBars(arr, [j, j + 1]);
        await sleep(speedSlider.value);
      }
    }
  }
  renderBars(arr);
}

// ------------------------------------------------------------------
// 2. Insertion Sort
// ------------------------------------------------------------------
async function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      renderBars(arr, [j, j + 1]);
      await sleep(speedSlider.value);
      j = j - 1;
    }
    arr[j + 1] = key;
    renderBars(arr, [j + 1]);
    await sleep(speedSlider.value);
  }
  renderBars(arr);
}

// ------------------------------------------------------------------
// 3. Selection Sort
// ------------------------------------------------------------------
async function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      renderBars(arr, [minIdx, j]);
      await sleep(speedSlider.value);
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      renderBars(arr, [i, minIdx]);
      await sleep(speedSlider.value);
    }
  }
  renderBars(arr);
}

// ------------------------------------------------------------------
// 4. Merge Sort
// ------------------------------------------------------------------
async function mergeSort(arr) {
  await mergeSortHelper(arr, 0, arr.length - 1);
  renderBars(arr);
}

async function mergeSortHelper(arr, left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSortHelper(arr, left, mid);
  await mergeSortHelper(arr, mid + 1, right);
  await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;

  while (i < leftArr.length && j < rightArr.length) {
    arr[k] = leftArr[i] <= rightArr[j] ? leftArr[i++] : rightArr[j++];
    renderBars(arr, [k]);
    await sleep(speedSlider.value);
    k++;
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i++];
    renderBars(arr, [k]);
    await sleep(speedSlider.value);
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j++];
    renderBars(arr, [k]);
    await sleep(speedSlider.value);
    k++;
  }
}

// ------------------------------------------------------------------
// 5. Quick Sort
// ------------------------------------------------------------------
async function quickSort(arr) {
  await quickSortHelper(arr, 0, arr.length - 1);
  renderBars(arr);
}

async function quickSortHelper(arr, low, high) {
  if (low < high) {
    const p = await partition(arr, low, high);
    await quickSortHelper(arr, low, p - 1);
    await quickSortHelper(arr, p + 1, high);
  }
}

async function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    renderBars(arr, [j, high]);
    await sleep(speedSlider.value);
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      renderBars(arr, [i, j]);
      await sleep(speedSlider.value);
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  renderBars(arr, [i + 1, high]);
  await sleep(speedSlider.value);
  return i + 1;
}

// ------------------------------------------------------------------
// 6. Heap Sort
// ------------------------------------------------------------------
async function heapSort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    renderBars(arr, [0, i]);
    await sleep(speedSlider.value);
    await heapify(arr, i, 0);
  }

  renderBars(arr);
}

async function heapify(arr, n, i) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    renderBars(arr, [i, largest]);
    await sleep(speedSlider.value);
    await heapify(arr, n, largest);
  }
}

// ------------------------------------------------------------------
// 7. Counting Sort (for small positive integers)
// ------------------------------------------------------------------
async function countingSort(arr) {
  const maxVal = Math.max(...arr);
  const count = new Array(maxVal + 1).fill(0);

  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    renderBars(arr, [i]);
    await sleep(speedSlider.value / 2);
  }

  let idx = 0;
  for (let val = 0; val <= maxVal; val++) {
    while (count[val] > 0) {
      arr[idx] = val;
      renderBars(arr, [idx]);
      await sleep(speedSlider.value / 2);
      idx++;
      count[val]--;
    }
  }

  renderBars(arr);
}

// ------------------------------------------------------------------
// 8. Radix Sort (LSD, base 10, for non-negative ints)
// ------------------------------------------------------------------
async function radixSort(arr) {
  const maxVal = Math.max(...arr);
  let exp = 1;

  while (Math.floor(maxVal / exp) > 0) {
    await countingSortByDigit(arr, exp);
    exp *= 10;
  }

  renderBars(arr);
}

async function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    renderBars(arr, [i]);
    await sleep(speedSlider.value / 2);
  }
}

function regenerate() {
  data = randomData(parseInt(sizeSlider.value, 10));
  renderBars(data);
}

generateBtn.addEventListener("click", regenerate);

sizeSlider.addEventListener("input", () => {
  if (isSorting) return;
  regenerate();
});

algoSelect.addEventListener("change", (e) => {
  setAlgoInfo(e.target.value);
});

runBtn.addEventListener("click", async () => {
  if (isSorting) return;
  isSorting = true;
  runBtn.textContent = "Running...";
  runBtn.disabled = true;
  generateBtn.disabled = true;
  sizeSlider.disabled = true;
  algoSelect.disabled = true;

  const algo = algoSelect.value;
  const arrCopy = [...data];

  if (algo === "bubble") await bubbleSort(arrCopy);
  else if (algo === "insertion") await insertionSort(arrCopy);
  else if (algo === "selection") await selectionSort(arrCopy);
  else if (algo === "merge") await mergeSort(arrCopy);
  else if (algo === "quick") await quickSort(arrCopy);
  else if (algo === "heap") await heapSort(arrCopy);
  else if (algo === "counting") await countingSort(arrCopy);
  else if (algo === "radix") await radixSort(arrCopy);

  isSorting = false;
  runBtn.textContent = "Run";
  runBtn.disabled = false;
  generateBtn.disabled = false;
  sizeSlider.disabled = false;
  algoSelect.disabled = false;

  data = arrCopy;
});

// ----- init -----
setAlgoInfo("bubble");
regenerate();