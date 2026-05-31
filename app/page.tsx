'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Grid, Stack, Snackbar, Alert, Typography, Button } from '@mui/material';
import { useSimulation } from './hooks/useSimulation';
import Header from './components/Header';
import FooterNavigation from './components/FooterNavigation';
import ForwardSimulationForm from './components/ForwardSimulationForm';
import InverseSimulationForm from './components/InverseSimulationForm';
import ResultCard from './components/ResultCard';
import ResultChart from './components/ResultChart';
import ResultTable from './components/ResultTable';
import HistoryList from './components/HistoryList';
import PushList from './components/PushList';
import TermsDialog from './components/TermsDialog';
import useFCM from "@/app/utils/hooks/useFCM";

import {
  getNotifications,
  deleteNotificationItem,
  clearNotifications,
  markAsRead,
  NotificationItem,
} from '@/app/lib/db';


export default function HomePage() {
  const {
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
    applyPreset,
  } = useSimulation();

  const { messages, fcmToken } = useFCM();

  const handleRequestNotification = async () => {
    const permission = await Notification.requestPermission();

    setSnackbar({
      open: true,
      message:
        permission === 'granted'
          ? '通知を許可しました'
          : '通知は許可されませんでした',
      severity: permission === 'granted' ? 'success' : 'error',
    });
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // ✅ 初期ロード（IndexedDB）
  useEffect(() => {
    getNotifications().then(setNotifications);
  }, [messages.length]);

  // ✅ 個別削除
  const handleDelete = async (id: number) => {
    await deleteNotificationItem(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ✅ 全削除
  const handleClearAll = async () => {
    await clearNotifications();
    setNotifications([]);
    setOpenClearDialog(false);
  };

  // ✅ 既読
  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        pb: { xs: 12, sm: 14 }, // Extra padding bottom to prevent bottom navigation bar overlay
      }}
    >
      {/* Header component */}
      <Header
        showInstallBtn={showInstallBtn}
        handleInstallClick={handleInstallClick}
      />
      <p>fcmToken: {fcmToken}</p>
      <p>messages: {JSON.stringify(messages)}</p>
      <Button
        variant="contained"
        color="primary"
        sx={{ width: { xs: '100%', sm: 260 } }}
        onClick={handleRequestNotification}
      >
        通知を許可する
      </Button>


      {/* Main content container */}
      <Container maxWidth="xl" sx={{ mt: 4, flexGrow: 1 }}>
        {/* Dynamic page title based on current tab */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800 }}>
            {tabIndex === 0 && '将来の資産形成をシミュレーション'}
            {tabIndex === 1 && '目標金額から資産計画を逆算'}
            {tabIndex === 2 && 'シミュレーション履歴一覧'}
            {tabIndex === 3 && '通知'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {tabIndex === 0 && '毎月の積立額、想定利回り、期間を入力して将来の資産額を計算します。'}
            {tabIndex === 1 && '目標金額を達成するために必要な積立額・利回り・期間を逆算します。'}
            {tabIndex === 2 && '過去に計算し保存したシミュレーションを復元・比較できます。'}
            {tabIndex === 3 && '過去の通知を確認できます。'}
          </Typography>
        </Box>

        {/* Tab 0: Forward Simulation */}
        {tabIndex === 0 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 4.5 }}>
              <ForwardSimulationForm
                forwardContribution={forwardContribution}
                setForwardContribution={setForwardContribution}
                forwardRate={forwardRate}
                setForwardRate={setForwardRate}
                forwardDuration={forwardDuration}
                setForwardDuration={setForwardDuration}
                applyPreset={applyPreset}
                handleSaveHistory={handleSaveHistory}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 7.5 }}>
              <Stack spacing={4}>
                <ResultCard
                  finalAmount={results.finalAmount}
                  totalPrincipal={results.totalPrincipal}
                  totalInterest={results.totalInterest}
                  isInverse={false}
                />
                <ResultChart yearlyData={results.yearlyData} />
                <ResultTable
                  yearlyData={results.yearlyData}
                  tablePage={tablePage}
                  setTablePage={setTablePage}
                />
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Inverse Simulation */}
        {tabIndex === 1 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 4.5 }}>
              <InverseSimulationForm
                inverseTarget={inverseTarget}
                setInverseTarget={setInverseTarget}
                inverseTargetType={inverseTargetType}
                setInverseTargetType={setInverseTargetType}
                inverseContribution={inverseContribution}
                setInverseContribution={setInverseContribution}
                inverseRate={inverseRate}
                setInverseRate={setInverseRate}
                inverseDuration={inverseDuration}
                setInverseDuration={setInverseDuration}
                applyPreset={applyPreset}
                handleSaveHistory={handleSaveHistory}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 7.5 }}>
              <Stack spacing={4}>
                <ResultCard
                  finalAmount={results.finalAmount}
                  totalPrincipal={results.totalPrincipal}
                  totalInterest={results.totalInterest}
                  isInverse={true}
                  inverseTargetType={inverseTargetType}
                  inverseCalculatedResult={inverseCalculatedResult}
                />
                <ResultChart yearlyData={results.yearlyData} />
                <ResultTable
                  yearlyData={results.yearlyData}
                  tablePage={tablePage}
                  setTablePage={setTablePage}
                />
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* Tab 2: Simulation History */}
        {tabIndex === 2 && (
          <HistoryList
            history={history}
            onLoadHistory={handleLoadHistory}
            onDeleteItem={handleDeleteItem}
            onClearAllHistory={handleClearAllHistory}
            openClearDialog={openClearDialog}
            setOpenClearDialog={setOpenClearDialog}
          />
        )}

        {/* Tab 3: Notifications */}
        {tabIndex === 3 && (
          <PushList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDeleteItem={handleDelete}
            onClearAll={handleClearAll}
            openClearDialog={openClearDialog}
            setOpenClearDialog={setOpenClearDialog}
          />
        )}
      </Container>

      {/* Floating Bottom Navigation for PWA style menu */}
      <FooterNavigation value={tabIndex} onChange={setTabIndex} notifications={notifications} />

      {/* Toast Notification message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 3, fontWeight: 'bold', px: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Terms of Service dialog popup */}
      <TermsDialog />
    </Box>
  );
}
