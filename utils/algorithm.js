/**
 * 快速排序
 * @param {*} arr Array
 * @returns {Array}
 */

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}


/**
 * 归并排序
 * @param {*} arr Array
 * @returns {Array}
 */
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);//取整
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    const result = [];

    while (left.length && right.length) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    return [...result, ...left, ...right];
}


/**
 * 计数排序
 * @param {*} arr Array
 * @returns {Array}
 */

function countingSort(arr) {
    const max = Math.max(...arr);//最大值
    const counts = new Array(max + 1).fill(0);

    for (let i = 0; i < arr.length; i++) {
        counts[arr[i]]++;
    }

    let result = [];

    for (let i = 0; i < counts.length; i++) {
        for (let j = 0; j < counts[i]; j++) {
            result.push(i);
        }
    }

    return result;
}

/**
 * 冒泡排序
 * @param {*} arr Array
 * @returns {Array}
 */
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }

    return arr;
}

/**
 * 桶排序
 * @param {*} arr Array
 * @param {*} bucketSize number
 * @returns {Array}
 */
function bucketSort(arr, bucketSize = 5) {
    if (arr.length === 0) {
        return arr;
    }

    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = new Array(bucketCount);

    for (let i = 0; i < buckets.length; i++) {
        buckets[i] = [];
    }

    for (let i = 0; i < arr.length; i++) {
        const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
        buckets[bucketIndex].push(arr[i]);
    }

    let result = [];

    for (let i = 0; i < buckets.length; i++) {
        if (buckets[i].length > 0) {
            const sortedBucket = bucketSort(buckets[i], bucketSize);
            result.push(...sortedBucket);
        }
    }

    return result;
}

/**
 * 基数排序
 * @param {*} arr Array
 * @returns {Array}
 */
function radixSort(arr) {
    const max = Math.max(...arr);
    const digitCount = Math.floor(Math.log10(max)) + 1;

    let buckets = new Array(10).fill().map(() => []);

    for (let i = 0; i < digitCount; i++) {
        for (let j = 0; j < arr.length; j++) {
            const digit = Math.floor(arr[j] / Math.pow(10, i)) % 10;
            buckets[digit].push(arr[j]);
        }

        arr = buckets.flat();
        buckets = new Array(10).fill().map(() => []);
    }

    return arr;
}


/**
 * 堆排序
 * @param {*} Array
 * @returns {Array}
 */
function heapSort(arr) {
    buildMaxHeap(arr);

    for (let i = arr.length - 1; i > 0; i--) {
        swap(arr, 0, i);
        heapify(arr, 0, i);
    }

    return arr;
}

function buildMaxHeap(arr) {
    const lastParentIndex = Math.floor((arr.length - 2) / 2);

    for (let i = lastParentIndex; i >= 0; i--) {
        heapify(arr, i, arr.length);
    }
}

function heapify(arr, parentIndex, heapSize) {
    const leftChildIndex = 2 * parentIndex + 1;
    const rightChildIndex = 2 * parentIndex + 2;
    let largestIndex = parentIndex;

    if (leftChildIndex < heapSize && arr[leftChildIndex] > arr[largestIndex]) {
        largestIndex = leftChildIndex;
    }

    if (rightChildIndex < heapSize && arr[rightChildIndex] > arr[largestIndex]) {
        largestIndex = rightChildIndex;
    }

    if (largestIndex !== parentIndex) {
        swap(arr, parentIndex, largestIndex);
        heapify(arr, largestIndex, heapSize);
    }
}

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

/**
 * 选择排序
 * @param {*} arr Array
 * @returns {Array}
 */
function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            swap(arr, i, minIndex);
        }
    }

    return arr;
}

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}


/**
 * 插入排序
 * @param {*} arr Array
 * @returns {Array}
 */
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = current;
    }

    return arr;
}


/**
 * 希尔排序
 * @param {*} arr Array
 * @returns {Array}
 */
function shellSort(arr) {
    let gap = Math.floor(arr.length / 2);

    while (gap > 0) {
        for (let i = gap; i < arr.length; i++) {
            const current = arr[i];
            let j = i - gap;

            while (j >= 0 && arr[j] > current) {
                arr[j + gap] = arr[j];
                j -= gap;
            }

            arr[j + gap] = current;
        }

        gap = Math.floor(gap / 2);
    }

    return arr;
}
