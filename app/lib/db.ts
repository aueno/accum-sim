export interface SimulationItem {
  id?: number;
  timestamp: number;
  title: string;
  type: 'forward' | 'inverse';
  inputs: {
    monthlyContribution: number;   // 毎月の積立額 (円)
    annualRate: number;            // 年利 (%)
    durationYears: number;         // 運用期間 (年)
    targetAmount?: number;         // 目標額 (円)
    inverseTargetType?: 'monthlyContribution' | 'annualRate' | 'durationYears'; // 逆算する値の種類
  };
  results: {
    finalAmount: number;           // 将来の積立総額 (円)
    totalPrincipal: number;        // 元本総額 (円)
    totalInterest: number;         // 運用益 (円)
    calculatedValue?: number;      // 逆算された値 (円, % または 年)
  };
}

const DB_NAME = 'AccumSimDB';
const STORE_NAME = 'history';
const DB_VERSION = 1;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is only available in the browser'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export async function saveHistory(item: SimulationItem): Promise<number> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(transaction.objectStoreNames[0]);
    const request = store.add(item);

    request.onsuccess = () => {
      resolve(request.result as number);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getHistory(): Promise<SimulationItem[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort by timestamp descending
      const results = request.result as SimulationItem[];
      results.sort((a, b) => b.timestamp - a.timestamp);
      resolve(results);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteHistoryItem(id: number): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function clearHistory(): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
