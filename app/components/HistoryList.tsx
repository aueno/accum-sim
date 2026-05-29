'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import History from '@mui/icons-material/History';
import Delete from '@mui/icons-material/Delete';
import Refresh from '@mui/icons-material/Refresh';
import HelpOutline from '@mui/icons-material/HelpOutlined';
import DateRange from '@mui/icons-material/DateRange';
import Calculate from '@mui/icons-material/Calculate';
import TrackChanges from '@mui/icons-material/TrackChanges';
import { useTheme } from '@mui/material/styles';
import { SimulationItem } from '../lib/db';

const formatYenToManValue = (yen: number): string => {
  const roundedMan = Math.round(yen / 1000) / 10;
  return roundedMan.toLocaleString('ja-JP', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

interface HistoryListProps {
  history: SimulationItem[];
  onLoadHistory: (item: SimulationItem) => void;
  onDeleteItem: (id: number) => void;
  onClearAllHistory: () => void;
  openClearDialog: boolean;
  setOpenClearDialog: (open: boolean) => void;
}

export default function HistoryList({
  history,
  onLoadHistory,
  onDeleteItem,
  onClearAllHistory,
  openClearDialog,
  setOpenClearDialog,
}: HistoryListProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card sx={{ width: '100%', mb: 4 }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <History color="primary" sx={{ fontSize: 28 }} />
            シミュレーション履歴
          </Typography>
          {history.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setOpenClearDialog(true)}
              sx={{ borderRadius: 3, px: 2 }}
            >
              すべてクリア
            </Button>
          )}
        </Stack>

        {history.length === 0 ? (
          <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HelpOutline sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              履歴が見つかりません
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: '380px', px: 2 }}>
              積立計算や目標逆算を行い、「計算結果を履歴に保存」ボタンを押すと、こちらにシミュレーションが記録されます。
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {history.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: isDark
                        ? '0 6px 20px rgba(93, 118, 246, 0.12)'
                        : '0 6px 20px rgba(5, 41, 225, 0.06)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      {/* Badge / Type tag */}
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip
                          icon={item.type === 'forward' ? <Calculate sx={{ fontSize: '1rem !important' }} /> : <TrackChanges sx={{ fontSize: '1rem !important' }} />}
                          size="small"
                          label={item.type === 'forward' ? '積立計算' : '目標逆算'}
                          color={item.type === 'forward' ? 'primary' : 'secondary'}
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            height: 24,
                            px: 0.5,
                            color: item.type === 'inverse' && !isDark ? '#00c853' : undefined,
                            borderColor: item.type === 'inverse' && !isDark ? '#00e676' : undefined,
                            variant: 'outlined',
                          }}
                          variant="outlined"
                        />
                        <Stack direction="row" sx={{ alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                          <DateRange sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {new Date(item.timestamp).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Title */}
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2.5, lineHeight: 1.4 }}>
                        {item.title}
                      </Typography>

                      {/* Output Summary Badge details */}
                      <Stack spacing={1.2} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', p: 1, borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">将来の積立金額</Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'extrabold', color: 'primary.main' }}>
                            {formatYenToManValue(item.results.finalAmount)}万円
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', p: 1, borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">積立元本</Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {formatYenToManValue(item.results.totalPrincipal)}万円
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', p: 1, borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">運用益</Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#00c853' }}>
                            +{formatYenToManValue(item.results.totalInterest)}万円
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={() => onLoadHistory(item)}
                        sx={{
                          py: 1,
                          fontSize: '0.8rem',
                          borderRadius: 2.5,
                          boxShadow: 'none',
                          color: '#fff',
                        }}
                      >
                        パラメータを復元
                      </Button>
                      <Tooltip title="履歴から削除">
                        <IconButton
                          color="error"
                          onClick={() => item.id && onDeleteItem(item.id)}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2.5,
                            width: 38,
                            height: 38,
                            p: 0,
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>

      {/* Clear Dialog */}
      <Dialog
        open={openClearDialog}
        onClose={() => setOpenClearDialog(false)}
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>履歴をすべてクリアしますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            保存されているすべてのシミュレーション履歴が削除され、復元することはできません。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenClearDialog(false)} variant="outlined" color="primary" sx={{ borderRadius: 3 }}>
            キャンセル
          </Button>
          <Button onClick={onClearAllHistory} variant="contained" color="error" autoFocus sx={{ borderRadius: 3, color: '#fff' }}>
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
