'use client';

import React, { useState, useEffect } from 'react';
import { saveHistory, getHistory, deleteHistoryItem, clearHistory, SimulationItem } from '../lib/db';

export function useSimulation() {
  // Navigation Tab Index (0: Forward Sim, 1: Inverse Sim, 2: History)
  const [tabIndex, setTabIndex] = useState(0);

  // --- Forward Sim State ---
  const [forwardContribution, setForwardContribution] = useState<number>(3.0); // 万円/月
  const [forwardRate, setForwardRate] = useState<number>(5.0); // %
  const [forwardDuration, setForwardDuration] = useState<number>(20); // 年

  // --- Inverse Sim State ---
  const [inverseTarget, setInverseTarget] = useState<number>(1000.0); // 万円
  const [inverseTargetType, setInverseTargetType] = useState<'monthlyContribution' | 'annualRate' | 'durationYears'>('monthlyContribution');
  const [inverseContribution, setInverseContribution] = useState<number>(3.0); // 万円 (年利・期間を逆算する時)
  const [inverseRate, setInverseRate] = useState<number>(5.0); // % (積立額・期間を逆算する時)
  const [inverseDuration, setInverseDuration] = useState<number>(20); // 年 (積立額・年利を逆算する時)

  // --- Common Calculation Results ---
  const [results, setResults] = useState<{
    finalAmount: number;
    totalPrincipal: number;
    totalInterest: number;
    yearlyData: Array<{
      year: number;
      principal: number;
      interest: number;
      total: number;
    }>;
  }>({
    finalAmount: 0,
    totalPrincipal: 0,
    totalInterest: 0,
    yearlyData: []
  });

  // Inverse result display
  const [inverseCalculatedResult, setInverseCalculatedResult] = useState<number | null>(null);

  // --- History & IndexedDB ---
  const [history, setHistory] = useState<SimulationItem[]>([]);
  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [tablePage, setTablePage] = useState(1);

  // --- Snackbar/Alert ---
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // --- PWA Installation ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Load history list on mount, and handle PWA setup
  useEffect(() => {
    // Register PWA service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Initial database load
    loadHistoryList();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Recalculate results whenever inputs change
  useEffect(() => {
    calculateSimulation();
    setTablePage(1); // Reset table page to 1 on parameter change
  }, [
    tabIndex,
    forwardContribution, forwardRate, forwardDuration,
    inverseTarget, inverseTargetType, inverseContribution, inverseRate, inverseDuration
  ]);

  const loadHistoryList = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted install prompt');
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  // --- Simulation Mathematics ---
  const calculateSimulation = () => {
    // Determine active calculation based on tab index (0 for Forward, 1 for Inverse)
    if (tabIndex === 0) {
      // Forward Calculation
      const M = forwardContribution * 10000;
      const r = forwardRate;
      const Y = forwardDuration;
      const n = Y * 12;
      const i = r / 12 / 100;

      let balance = 0;
      const yearlyData = [];

      for (let month = 1; month <= n; month++) {
        if (r === 0) {
          balance += M;
        } else {
          // Beginning of month compounding formula: (balance + M) * (1 + i)
          balance = (balance + M) * (1 + i);
        }

        if (month % 12 === 0) {
          const currentYear = month / 12;
          const principal = M * 12 * currentYear;
          const interest = Math.max(0, Math.round(balance - principal));
          yearlyData.push({
            year: currentYear,
            principal: principal,
            interest: interest,
            total: Math.round(balance)
          });
        }
      }

      const totalPrincipal = M * 12 * Y;
      const finalAmount = Math.round(balance);
      const totalInterest = Math.max(0, finalAmount - totalPrincipal);

      setResults({
        finalAmount,
        totalPrincipal,
        totalInterest,
        yearlyData
      });
      setInverseCalculatedResult(null);
    } else if (tabIndex === 1) {
      // Inverse Calculation
      const T = inverseTarget * 10000;
      let calculatedValue = 0;
      let calculatedMonthly = inverseContribution * 10000;
      let calculatedRate = inverseRate;
      let calculatedDuration = inverseDuration;

      if (inverseTargetType === 'monthlyContribution') {
        // Calculate required monthly contribution M
        const r = inverseRate;
        const Y = inverseDuration;
        const n = Y * 12;
        const i = r / 12 / 100;

        if (r === 0) {
          calculatedMonthly = Math.round(T / n);
        } else {
          calculatedMonthly = Math.round((T * i) / ((1 + i) * (Math.pow(1 + i, n) - 1)));
        }
        calculatedValue = calculatedMonthly;
        setInverseCalculatedResult(calculatedMonthly);
      }
      else if (inverseTargetType === 'annualRate') {
        // Calculate required annual rate r
        const M = inverseContribution * 10000;
        const Y = inverseDuration;
        const n = Y * 12;

        if (M * n >= T) {
          calculatedRate = 0;
        } else {
          // Binary search for monthly rate i
          let low = 0;
          let high = 10; // Extremely high upper bound
          for (let iter = 0; iter < 50; iter++) {
            const mid = (low + high) / 2;
            const val = M * (1 + mid) * ((Math.pow(1 + mid, n) - 1) / mid);
            if (val > T) {
              high = mid;
            } else {
              low = mid;
            }
          }
          calculatedRate = parseFloat((low * 12 * 100).toFixed(2));
        }
        calculatedValue = calculatedRate;
        setInverseCalculatedResult(calculatedRate);
      }
      else if (inverseTargetType === 'durationYears') {
        // Calculate required duration Y
        const M = inverseContribution * 10000;
        const r = inverseRate;
        const i = r / 12 / 100;

        if (r === 0) {
          calculatedDuration = parseFloat((T / (M * 12)).toFixed(1));
        } else {
          const numerator = Math.log(1 + (T * i) / (M * (1 + i)));
          const denominator = Math.log(1 + i);
          const totalMonths = numerator / denominator;
          calculatedDuration = parseFloat((totalMonths / 12).toFixed(1));
        }
        calculatedValue = calculatedDuration;
        setInverseCalculatedResult(calculatedDuration);
      }

      // Now compute full year-by-year curve based on computed params
      const M = inverseTargetType === 'monthlyContribution' ? calculatedMonthly : (inverseContribution * 10000);
      const r = inverseTargetType === 'annualRate' ? calculatedRate : inverseRate;
      const Y = Math.ceil(inverseTargetType === 'durationYears' ? calculatedDuration : inverseDuration);
      const n = Y * 12;
      const i = r / 12 / 100;

      let balance = 0;
      const yearlyData = [];

      for (let month = 1; month <= n; month++) {
        if (r === 0) {
          balance += M;
        } else {
          balance = (balance + M) * (1 + i);
        }

        if (month % 12 === 0) {
          const currentYear = month / 12;
          const principal = M * 12 * currentYear;
          const interest = Math.max(0, Math.round(balance - principal));
          yearlyData.push({
            year: currentYear,
            principal: principal,
            interest: interest,
            total: Math.round(balance)
          });
        }
      }

      // If duration is fractional, append final fractional year point
      if (inverseTargetType === 'durationYears' && calculatedDuration % 1 !== 0) {
        const principal = M * 12 * calculatedDuration;
        yearlyData.push({
          year: calculatedDuration,
          principal: Math.round(principal),
          interest: Math.max(0, Math.round(T - principal)),
          total: T
        });
      }

      const totalPrincipal = Math.round(M * 12 * (inverseTargetType === 'durationYears' ? calculatedDuration : inverseDuration));
      const finalAmount = inverseTargetType === 'durationYears' ? T : Math.round(balance);
      const totalInterest = Math.max(0, finalAmount - totalPrincipal);

      setResults({
        finalAmount,
        totalPrincipal,
        totalInterest,
        yearlyData
      });
    }
  };

  // --- Save Simulation to History ---
  const handleSaveHistory = async () => {
    try {
      const timestamp = Date.now();
      let title = '';
      let inputs: SimulationItem['inputs'];
      let res: SimulationItem['results'];

      if (tabIndex === 0) {
        title = `積立: 月${forwardContribution.toLocaleString()}万円 / ${forwardRate}% / ${forwardDuration}年`;
        inputs = {
          monthlyContribution: forwardContribution * 10000,
          annualRate: forwardRate,
          durationYears: forwardDuration
        };
        res = {
          finalAmount: results.finalAmount,
          totalPrincipal: results.totalPrincipal,
          totalInterest: results.totalInterest
        };
      } else {
        const typeLabel =
          inverseTargetType === 'monthlyContribution' ? '積立額逆算' :
            inverseTargetType === 'annualRate' ? '年利逆算' : '期間逆算';

        title = `逆算 [${typeLabel}]: 目標${inverseTarget.toLocaleString()}万円`;
        inputs = {
          monthlyContribution: inverseContribution * 10000,
          annualRate: inverseRate,
          durationYears: inverseDuration,
          targetAmount: inverseTarget * 10000,
          inverseTargetType: inverseTargetType
        };
        res = {
          finalAmount: results.finalAmount,
          totalPrincipal: results.totalPrincipal,
          totalInterest: results.totalInterest,
          calculatedValue: inverseCalculatedResult ?? undefined
        };
      }

      const newItem: SimulationItem = {
        timestamp,
        title,
        type: tabIndex === 0 ? 'forward' : 'inverse',
        inputs,
        results: res
      };

      await saveHistory(newItem);
      setSnackbar({
        open: true,
        message: 'シミュレーション履歴を保存しました。',
        severity: 'success'
      });
      loadHistoryList();
    } catch (e) {
      console.error(e);
      setSnackbar({
        open: true,
        message: '履歴の保存に失敗しました。',
        severity: 'error'
      });
    }
  };

  // --- Load Simulation from History ---
  const handleLoadHistory = (item: SimulationItem) => {
    if (item.type === 'forward') {
      setTabIndex(0);
      setForwardContribution(item.inputs.monthlyContribution / 10000);
      setForwardRate(item.inputs.annualRate);
      setForwardDuration(item.inputs.durationYears);
    } else {
      setTabIndex(1);
      if (item.inputs.targetAmount) setInverseTarget(item.inputs.targetAmount / 10000);
      if (item.inputs.inverseTargetType) setInverseTargetType(item.inputs.inverseTargetType);
      setInverseContribution(item.inputs.monthlyContribution / 10000);
      setInverseRate(item.inputs.annualRate);
      setInverseDuration(item.inputs.durationYears);
    }

    setSnackbar({
      open: true,
      message: 'シミュレーションパラメータを読み込みました。',
      severity: 'info'
    });
  };

  // --- Delete History Item ---
  const handleDeleteItem = async (id: number) => {
    try {
      await deleteHistoryItem(id);
      setSnackbar({
        open: true,
        message: '履歴を削除しました。',
        severity: 'info'
      });
      loadHistoryList();
    } catch (e) {
      console.error(e);
    }
  };

  // --- Clear All History ---
  const handleClearAllHistory = async () => {
    try {
      await clearHistory();
      setSnackbar({
        open: true,
        message: 'すべての履歴をクリアしました。',
        severity: 'success'
      });
      setOpenClearDialog(false);
      loadHistoryList();
    } catch (e) {
      console.error(e);
    }
  };

  // Preset Handlers
  const applyPreset = (preset: 'preset1' | 'preset2' | 'preset3' | 'preset4') => {
    if (preset === 'preset1') {
      setTabIndex(0);
      setForwardContribution(3.0);
      setForwardRate(5);
      setForwardDuration(20);
    } else if (preset === 'preset2') {
      setTabIndex(0);
      setForwardContribution(5.0);
      setForwardRate(7);
      setForwardDuration(30);
    } else if (preset === 'preset3') {
      setTabIndex(1);
      setInverseTarget(2000.0);
      setInverseTargetType('monthlyContribution');
      setInverseRate(5);
      setInverseDuration(20);
    } else if (preset === 'preset4') {
      setTabIndex(1);
      setInverseTarget(1000.0);
      setInverseTargetType('durationYears');
      setInverseContribution(5.0);
      setInverseRate(6);
    }

    setSnackbar({
      open: true,
      message: 'プリセットを適用しました。',
      severity: 'info'
    });
  };

  return {
    tabIndex,
    setTabIndex,
    forwardContribution,
    setForwardContribution,
    forwardRate,
    setForwardRate,
    forwardDuration,
    setForwardDuration,
    inverseTarget,
    setInverseTarget,
    inverseTargetType,
    setInverseTargetType,
    inverseContribution,
    setInverseContribution,
    inverseRate,
    setInverseRate,
    inverseDuration,
    setInverseDuration,
    results,
    inverseCalculatedResult,
    history,
    openClearDialog,
    setOpenClearDialog,
    tablePage,
    setTablePage,
    snackbar,
    setSnackbar,
    showInstallBtn,
    handleInstallClick,
    handleSaveHistory,
    handleLoadHistory,
    handleDeleteItem,
    handleClearAllHistory,
    applyPreset
  };
}
