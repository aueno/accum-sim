'use client';

import React from 'react';
import { Box, Container, Grid, Stack, Snackbar, Alert, Typography } from '@mui/material';
import { useSimulation } from './hooks/useSimulation';
import Header from './components/Header';
import FooterNavigation from './components/FooterNavigation';
import ForwardSimulationForm from './components/ForwardSimulationForm';
import InverseSimulationForm from './components/InverseSimulationForm';
import ResultCard from './components/ResultCard';
import ResultChart from './components/ResultChart';
import ResultTable from './components/ResultTable';
import HistoryList from './components/HistoryList';
import TermsDialog from './components/TermsDialog';

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

      {/* Main content container */}
      <Container maxWidth="xl" sx={{ mt: 4, flexGrow: 1 }}>
        {/* Dynamic page title based on current tab */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800 }}>
            {tabIndex === 0 && '将来の資産形成をシミュレーション'}
            {tabIndex === 1 && '目標金額から資産計画を逆算'}
            {tabIndex === 2 && 'シミュレーション履歴一覧'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {tabIndex === 0 && '毎月の積立額、想定利回り、期間を入力して将来の資産額を計算します。'}
            {tabIndex === 1 && '目標金額を達成するために必要な積立額・利回り・期間を逆算します。'}
            {tabIndex === 2 && '過去に計算し保存したシミュレーションを復元・比較できます。'}
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
      </Container>

      {/* Floating Bottom Navigation for PWA style menu */}
      <FooterNavigation value={tabIndex} onChange={setTabIndex} />

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
