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

export interface NotificationItem {
  id?: number;
  timestamp: number;
  title: string;
  body: string;
  read: boolean;
  url?: string;
  tag?: string;
  unreadCount?: number;
}

const DB_NAME = 'AccumSimDB';
const STORE_NAME = 'history';
const NOTIFICATION_STORE = 'notifications';
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

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains(NOTIFICATION_STORE)) {
        db.createObjectStore(NOTIFICATION_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
}

export async function saveHistory(item: SimulationItem): Promise<number> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
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

export async function saveNotification(item: NotificationItem): Promise<number> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readwrite');
    const store = tx.objectStore(NOTIFICATION_STORE);
    const request = store.add(item);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readonly');
    const store = tx.objectStore(NOTIFICATION_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const data = request.result as NotificationItem[];
      data.sort((a, b) => b.timestamp - a.timestamp);
      resolve(data);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function getUnreadCount(): Promise<number> {
  const list = await getNotifications();
  return list.filter(n => !n.read).length;
}

export async function markAsRead(id: number): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readwrite');
    const store = tx.objectStore(NOTIFICATION_STORE);

    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const item = getReq.result;
      if (!item) return resolve();

      item.read = true;

      const putReq = store.put(item);

      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };

    getReq.onerror = () => reject(getReq.error);
  });
}

export async function deleteNotificationItem(id: number): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readwrite');
    const store = tx.objectStore(NOTIFICATION_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearNotifications(): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readwrite');
    const store = tx.objectStore(NOTIFICATION_STORE);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function markAllAsRead(): Promise<void> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOTIFICATION_STORE, 'readwrite');
    const store = tx.objectStore(NOTIFICATION_STORE);

    const request = store.openCursor();

    request.onsuccess = (e: any) => {
      const cursor = e.target.result;
      if (!cursor) {
        resolve();
        return;
      }

      const item = cursor.value;
      item.read = true;
      cursor.update(item);
      cursor.continue();
    };

    request.onerror = () => reject(request.error);
  });
}