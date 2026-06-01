'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Slider,
  InputAdornment,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import TrackChanges from '@mui/icons-material/TrackChanges';
import History from '@mui/icons-material/History';
import { useTheme } from '@mui/material/styles';

interface InverseSimulationFormProps {
  inverseTarget: number;
  setInverseTarget: (val: number) => void;
  inverseTargetType: 'monthlyContribution' | 'annualRate' | 'durationYears';
  setInverseTargetType: (val: 'monthlyContribution' | 'annualRate' | 'durationYears') => void;
  inverseContribution: number;
  setInverseContribution: (val: number) => void;
  inverseRate: number;
  setInverseRate: (val: number) => void;
  inverseDuration: number;
  setInverseDuration: (val: number) => void;
  applyPreset: (preset: 'preset3' | 'preset4') => void;
  handleSaveHistory: () => void;
}

export default function InverseSimulationForm({
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
  applyPreset,
  handleSaveHistory,
}: InverseSimulationFormProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrackChanges color="secondary" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          目標金額からの逆算条件
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
              label="目標2000万を20年で"
              onClick={() => applyPreset('preset3')}
              clickable
              color="secondary"
              variant="outlined"
              size="small"
              sx={{
                color: isDark ? '#f88213' : '#00c853',
                borderColor: 'secondary.main',
              }}
            />
            <Chip
              label="目標1000万への期間"
              onClick={() => applyPreset('preset4')}
              clickable
              color="secondary"
              variant="outlined"
              size="small"
              sx={{
                color: isDark ? '#f88213' : '#00c853',
                borderColor: 'secondary.main',
              }}
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 2, opacity: 0.5 }} />

        <Stack spacing={3}>
          {/* Target Amount */}
          <Box>
            <TextField
              id="outlined-basic-inverse-target"
              label="目標設定金額"
              variant="outlined"
              type="number"
              value={inverseTarget}
              onChange={(e) => setInverseTarget(Math.max(0, parseFloat(e.target.value) || 0))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">万円</InputAdornment>,
                }
              }}
              fullWidth
              sx={{ mb: 1.5 }}
            />
            <Slider
              value={inverseTarget}
              min={10}
              max={10000}
              step={10}
              onChange={(e, val) => setInverseTarget(val as number)}
              color="secondary"
            />
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: -0.5 }}>
              <Typography variant="caption" color="text.secondary">10万円</Typography>
              <Typography variant="caption" color="text.secondary">1億円 (10,000万円)</Typography>
            </Stack>
          </Box>

          {/* Inverse Calculation Target Type */}
          <FormControl fullWidth size="small">
            <InputLabel id="inverse-target-label" sx={{ fontWeight: 600 }}>逆算して求める項目</InputLabel>
            <Select
              labelId="inverse-target-label"
              value={inverseTargetType}
              label="逆算して求める項目"
              onChange={(e) => setInverseTargetType(e.target.value as any)}
              sx={{ borderRadius: 3 }}
            >
              <MenuItem value="monthlyContribution">毎月の必要な積立額</MenuItem>
              <MenuItem value="annualRate">必要な年利 (想定利回り)</MenuItem>
              <MenuItem value="durationYears">必要な積立期間 (運用年数)</MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 1, opacity: 0.3 }} />

          {/* Variable Inputs depending on selection */}
          {inverseTargetType !== 'monthlyContribution' && (
            <Box>
              <TextField
                id="outlined-basic-inverse-contribution"
                label="毎月の積立額 (固定)"
                variant="outlined"
                type="number"
                value={inverseContribution}
                onChange={(e) => setInverseContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">万円</InputAdornment>,
                  }
                }}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <Slider
                value={inverseContribution}
                min={0.1}
                max={30}
                step={0.1}
                onChange={(e, val) => setInverseContribution(val as number)}
                color="secondary"
              />
              <Stack direction="row" sx={{ justifyContent: 'space-between', mt: -0.5 }}>
                <Typography variant="caption" color="text.secondary">0.1万円 (1,000円)</Typography>
                <Typography variant="caption" color="text.secondary">30万円</Typography>
              </Stack>
            </Box>
          )}

          {inverseTargetType !== 'annualRate' && (
            <Box>
              <TextField
                id="outlined-basic-inverse-rate"
                label="想定年利 (固定)"
                variant="outlined"
                type="number"
                value={inverseRate}
                onChange={(e) => setInverseRate(Math.max(0, Math.min(20, parseFloat(e.target.value) || 0)))}
                slotProps={{
                  htmlInput: { step: 0.1 },
                  input: {
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }
                }}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <Slider
                value={inverseRate}
                min={0}
                max={20}
                step={0.1}
                onChange={(e, val) => setInverseRate(val as number)}
                color="secondary"
              />
              <Stack direction="row" sx={{ justifyContent: 'space-between', mt: -0.5 }}>
                <Typography variant="caption" color="text.secondary">0%</Typography>
                <Typography variant="caption" color="text.secondary">20%</Typography>
              </Stack>
            </Box>
          )}

          {inverseTargetType !== 'durationYears' && (
            <Box>
              <TextField
                id="outlined-basic-inverse-duration"
                label="積立期間 (固定)"
                variant="outlined"
                type="number"
                value={inverseDuration}
                onChange={(e) => setInverseDuration(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">年</InputAdornment>,
                  }
                }}
                fullWidth
                sx={{ mb: 1.5 }}
              />
              <Slider
                value={inverseDuration}
                min={1}
                max={50}
                step={1}
                onChange={(e, val) => setInverseDuration(val as number)}
                color="secondary"
              />
              <Stack direction="row" sx={{ justifyContent: 'space-between', mt: -0.5 }}>
                <Typography variant="caption" color="text.secondary">1年</Typography>
                <Typography variant="caption" color="text.secondary">50年</Typography>
              </Stack>
            </Box>
          )}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          color="secondary"
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
