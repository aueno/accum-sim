'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Slider,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import Calculate from '@mui/icons-material/Calculate';
import History from '@mui/icons-material/History';
import NumericTextField from './NumericTextField';


interface ForwardSimulationFormProps {
  forwardContribution: number;
  setForwardContribution: (val: number) => void;
  forwardRate: number;
  setForwardRate: (val: number) => void;
  forwardDuration: number;
  setForwardDuration: (val: number) => void;
  applyPreset: (preset: 'preset1' | 'preset2') => void;
  handleSaveHistory: () => void;
}

export default function ForwardSimulationForm({
  forwardContribution,
  setForwardContribution,
  forwardRate,
  setForwardRate,
  forwardDuration,
  setForwardDuration,
  applyPreset,
  handleSaveHistory,
}: ForwardSimulationFormProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Calculate color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          積立シミュレーション条件
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Preset Chips */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
            クイックプリセット
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Chip
              label="毎月3万・20年・利回り5%"
              onClick={() => applyPreset('preset1')}
              clickable
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label="毎月5万・30年・利回り7%"
              onClick={() => applyPreset('preset2')}
              clickable
              color="primary"
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 2, opacity: 0.5 }} />

        <Stack spacing={3}>
          {/* Monthly Contribution（小数可） */}
          <Box>
            <NumericTextField
              id="outlined-basic-forward-contribution"
              label="毎月の積立額"
              variant="outlined"
              value={forwardContribution}
              onValueChange={setForwardContribution}
              min={0}
              max={30}
              allowDecimal
              unit="万円"
              fullWidth
              sx={{ mb: 1.5 }}
            />
            <Slider
              value={forwardContribution}
              min={0.1}
              max={30}
              step={0.1}
              onChange={(e, val) => setForwardContribution(val as number)}
              color="primary"
            />
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: -0.5 }}>
              <Typography variant="caption" color="text.secondary">0.1万円 (1,000円)</Typography>
              <Typography variant="caption" color="text.secondary">30万円</Typography>
            </Stack>
          </Box>

          {/* Annual Interest Rate（小数可） */}
          <Box>
            <NumericTextField
              id="outlined-basic-forward-rate"
              label="想定年利 (運用利回り)"
              variant="outlined"
              value={forwardRate}
              onValueChange={setForwardRate}
              min={0}
              max={20}
              allowDecimal
              unit="%"
              fullWidth
              sx={{ mb: 1.5 }}
            />
            <Slider
              value={forwardRate}
              min={0}
              max={20}
              step={0.1}
              onChange={(e, val) => setForwardRate(val as number)}
              color="primary"
            />
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: -0.5 }}>
              <Typography variant="caption" color="text.secondary">0%</Typography>
              <Typography variant="caption" color="text.secondary">20%</Typography>
            </Stack>
          </Box>

          {/* Duration Years（整数のみ） */}
          <Box>
            <NumericTextField
              id="outlined-basic-forward-duration"
              label="積立期間 (運用期間)"
              variant="outlined"
              value={forwardDuration}
              onValueChange={setForwardDuration}
              min={1}
              max={50}
              unit="年"
              fullWidth
              sx={{ mb: 1.5 }}
            />
            <Slider
              value={forwardDuration}
              min={1}
              max={50}
              step={1}
              onChange={(e, val) => setForwardDuration(val as number)}
              color="primary"
            />
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: -0.5 }}>
              <Typography variant="caption" color="text.secondary">1年</Typography>
              <Typography variant="caption" color="text.secondary">50年</Typography>
            </Stack>
          </Box>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSaveHistory}
          startIcon={<History />}
          sx={{ mt: 4, py: 1.5, color: '#fff', fontSize: '1rem' }}
        >
          計算結果を履歴に保存
        </Button>
      </CardContent>
    </Card>
  );
}