import { useState, useEffect, useRef } from 'react'
import './App.css'

const ALGO_INFO = {
  general: {
    title: "Как это работает ?",
    desc: "Это визуализатор алгоритмов сортировки. Сортировка — это способ упорядочить набор данных (наши столбики) от меньшего к большему. Здесь ты можешь увидеть 'мыслительный процесс' компьютера.",
    complexity: "Выберите алгоритм, чтобы узнать сложность",
    legend: [
      { color: 'var(--bar-default)', label: 'Ожидание' },
      { color: 'var(--bar-sorted)', label: 'Готово (Отсортировано)' }
    ]
  },
  bubble: {
    title: "Bubble Sort (Пузырьковая)",
    desc: "Самый простой, но медленный алгоритм. Он проходит по массиву много раз, сравнивая двух соседей. Если левый больше правого — они меняются местами. Большие элементы 'всплывают' в конец списка, как пузырьки воздуха в воде.",
    complexity: "Сложность: O(n²) — Очень медленно 🐢",
    legend: [
      { color: 'var(--bar-active)', label: 'Сравнение соседей' },
      { color: 'var(--bar-sorted)', label: 'Отсортированная часть' }
    ]
  },
  quick: {
    title: "Quick Sort (Быстрая)",
    desc: "Стратегия 'Разделяй и Властвуй'. Алгоритм выбирает 'Опорный элемент' (Pivot). Все, что меньше него, кидает влево, все что больше — вправо. Затем повторяет это для левой и правой части. Это стандарт индустрии.",
    complexity: "Сложность: O(n log n) — Очень быстро ⚡",
    legend: [
      { color: 'var(--bar-pivot)', label: 'Pivot (Опорный)' },
      { color: 'var(--bar-active)', label: 'Сканирование (Поиск)' },
      { color: 'var(--bar-sorted)', label: 'Отсортировано' }
    ]
  },
  merge: {
    title: "Merge Sort (Слиянием)",
    desc: "Идеально сбалансированный алгоритм. Он рекурсивно делит массив пополам, пока не останутся кусочки по 1 элементу. Затем он начинает 'сшивать' (сливать) эти кусочки обратно, сразу расставляя элементы по порядку.",
    complexity: "Сложность: O(n log n) — Быстро и стабильно ⚖️",
    legend: [
      { color: 'var(--bar-active)', label: 'Перезапись (Слияние)' },
      { color: 'var(--bar-sorted)', label: 'Отсортировано' }
    ]
  }
}

export default function App() {

  const [arraySize, setArraySize] = useState(50);
  const [isSorting, setIsSorting] = useState(false);

  const [array, setArray] = useState([]);
  const [activeBars, setActiveBars] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  const speedRef = useRef(50);

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const resetArray = () => {
    if (isSorting) return;

    setSortedIndices([]);
    setActiveBars([]);
    setPivotIndex(null);
    setActiveTab('general');

    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(randomIntFromInterval(10, 400));
    }
    setArray(newArray);
  };

  // ФУНКЦИЯ ЗАДЕРЖКИ
  const sleep = () => {
    return new Promise((resolve) => setTimeout(resolve, speedRef.current));
  };

  // --- BUBBLE SORT ---
  const bubbleSort = async () => {
    setActiveTab('bubble');
    setIsSorting(true);
    setSortedIndices([]);
    const arr = [...array];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveBars([j, j + 1]);
        await sleep();
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep();
        }
      }
    }

    await runVictoryAnimation();
  };

  // --- QUICK SORT ---
  const quickSort = async () => {
    setActiveTab('quick');
    setIsSorting(true);
    setSortedIndices([]);
    const arr = [...array];

    await quickSortHelper(arr, 0, arr.length - 1);

    setPivotIndex(null);
    await runVictoryAnimation();
  };

  const quickSortHelper = async (arr, start, end) => {
    if (start >= end) return;

    const index = await partition(arr, start, end);

    await quickSortHelper(arr, start, index - 1);
    await quickSortHelper(arr, index + 1, end);
  };

  // --- MERGE SORT ---
  const mergeSort = async () => {
    setActiveTab('merge');
    setIsSorting(true);
    setSortedIndices([]);
    const arr = [...array];

    await mergeSortHelper(arr, 0, arr.length - 1);
    await runVictoryAnimation();
  }

  const mergeSortHelper = async (arr, start, end) => {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    await mergeSortHelper(arr, start, mid);
    await mergeSortHelper(arr, mid + 1, end);
    await merge(arr, start, mid, end);
  };

  const merge = async (arr, start, mid, end) => {
    const leftArr = arr.slice(start, mid + 1);
    const rightArr = arr.slice(mid + 1, end + 1);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < leftArr.length && j < rightArr.length) {
      setActiveBars([k]);
      await sleep();

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      setArray([...arr]);
      k++;
    }

    while (i < leftArr.length) {
      setActiveBars([k]);
      await sleep();
      arr[k] = leftArr[i];
      setArray([...arr]);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      setActiveBars([k]);
      await sleep();
      arr[k] = rightArr[j];
      setArray([...arr]);
      j++;
      k++;
    }
  };

  const partition = async (arr, start, end) => {
    const pivotValue = arr[end];
    setPivotIndex(end);

    let pivotIdx = start;

    for (let i = start; i < end; i++) {
      setActiveBars([i, pivotIdx]);
      await sleep();
      if (arr[i] < pivotValue) {
        [arr[i], arr[pivotIdx]] = [arr[pivotIdx], arr[i]];
        setArray([...arr]);
        pivotIdx++;
      }
    }

    [arr[pivotIdx], arr[end]] = [arr[end], arr[pivotIdx]];
    setArray([...arr]);
    await sleep();
    return pivotIdx;
  };

  const runVictoryAnimation = async () => {

    setActiveBars([]);
    setPivotIndex(null);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const victorySpeed = 20;

    for (let i = 0; i < array.length; i++) {
      setSortedIndices((prev) => [...prev, i]);

      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    setIsSorting(false);
  };

  return (
    <div className='app-container'>
      <header>
        <h1>Sorting Visualizer</h1>
        <div className='controls'>
          <div className='sliders-container'>
            <div className='slider-group'>
              <label>Size: {arraySize}</label>
              <input
                type='range'
                min="10" max="100"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                disabled={isSorting}
              />
            </div>

            <div className='slider-group'>
              <label>Speed</label>
              <input
                type='range'
                min='1' max='200'
                defaultValue={50}
                onChange={(e) => {
                  speedRef.current = 201 - Number(e.target.value);
                }}
              />
            </div>
          </div>

          <div className='buttons-group'>
            <button onClick={resetArray} disabled={isSorting}>New Array</button>
            <button className='run-btn' onClick={bubbleSort} disabled={isSorting}>Bubble Sort</button>
            <button className='run-btn' onClick={quickSort} disabled={isSorting}>Quick Sort</button>
            <button className='run-btn' onClick={mergeSort} disabled={isSorting}>Merge Sort</button>
          </div>
        </div>
      </header>

      <div className='array-container'>
        {array.map((value, idx) => {
          const isSorted = sortedIndices.includes(idx);
          const isActive = activeBars.includes(idx);
          const isPivot = pivotIndex === idx;

          let barColor = 'var(--bar-default)';
          let barShadow = 'none';

          if (isSorted) {
            barColor = 'var(--bar-sorted)';
            barShadow = '0 0 10px var(--bar-sorted), 0 0 20px var(--bar-sorted)';
          } else if (isPivot) {
            barColor = 'var(--bar-pivot)';
            barShadow = '0 0 10px var(--bar-pivot), 0 0 20px var(--bar-pivot)';
          } else if (isActive) {
            barColor = 'var(--bar-active)';
            barShadow = '0 0 15px var(--bar-active), 0 0 30px var(--bar-active)';
          }

          return (
            <div
              className='array-bar'
              key={idx}
              style={{
                height: `${value}px`,
                backgroundColor: barColor,
                boxShadow: barShadow,
                transition: 'height 0.1s ease, background-color 0.1s ease'
              }}
            ></div>
          );
        })}
      </div>

      <div className='info-section'>
        <div className="info-sidebar">
          <div>
            <div className="sidebar-header">
              <span className="terminal-icon">_</span> CONTROL_PANEL
            </div>

            <button
              className={`info-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              Общая информация
            </button>
            <button
              className={`info-tab-btn ${activeTab === 'bubble' ? 'active' : ''}`}
              onClick={() => setActiveTab('bubble')}
            >
              Bubble Sort
            </button>
            <button
              className={`info-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
              onClick={() => setActiveTab('quick')}
            >
              Quick Sort
            </button>
            <button
              className={`info-tab-btn ${activeTab === 'merge' ? 'active' : ''}`}
              onClick={() => setActiveTab('merge')}
            >
              Merge Sort
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="footer-label">DEVELOPED BY</div>
            <a href="https://github.com/AxM133" target="_blank" rel="noreferrer" className="author-link">
              Azim (AxM133)
            </a>
            <div className="version">v 1.0.0</div>
          </div>

        </div>

        <div className='info-content'>
          <h2>{ALGO_INFO[activeTab].title}</h2>

          <div className='complexity-badge'>
            {ALGO_INFO[activeTab].complexity}
          </div>

          <div className='info-desc'>
            {ALGO_INFO[activeTab].desc}
          </div>

          <div className='legend-container'>
            {ALGO_INFO[activeTab].legend.map((item, idx) => (
              <div key={idx} className='legend-item'>
                <div
                  className='color-box'
                  style={{ backgroundColor: item.color, color: item.color }}
                ></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}