'use client';

import { useEffect } from 'react';

const base = process.env.GITHUB_ACTIONS === "true" ? "/accum-sim" : "";

export default function SWRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${base}/sw.js`);
    }
  }, []);

  return null;
}