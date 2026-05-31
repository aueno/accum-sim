'use client';

import { useState, useEffect } from 'react';
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
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import { useSimulation } from '@/app/hooks/useSimulation';
import Notifications from '@mui/icons-material/Notifications';
import Delete from '@mui/icons-material/Delete';
import Drafts from '@mui/icons-material/Drafts';
import MarkEmailRead from '@mui/icons-material/MarkEmailRead';
import HelpOutline from '@mui/icons-material/HelpOutlined';
import DateRange from '@mui/icons-material/DateRange';
import LinkIcon from '@mui/icons-material/Link';
import { useTheme } from '@mui/material/styles';
import { NotificationItem } from '../lib/db';

interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: number) => void;
  onDeleteItem: (id: number) => void;
  onClearAll: () => void;
  openClearDialog: boolean;
  setOpenClearDialog: (open: boolean) => void;
}

export default function NotificationList({
  notifications,
  onMarkAsRead,
  onDeleteItem,
  onClearAll,
  openClearDialog,
  setOpenClearDialog,
}: NotificationListProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // 通知許可設定
  const { setSnackbar, snackbar } = useSimulation();
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

  // ✅ メインstate
  const [notificationsState, setNotifications] =
    useState<NotificationItem[]>(notifications);

  // ✅ props → state同期（重要）
  useEffect(() => {
    setNotifications(notifications);
  }, [notifications]);

  // ✅ SWからリアルタイム受信
  useEffect(() => {
    if (!navigator.serviceWorker) return;

    const handler = (event: MessageEvent) => {
      const data = event.data;

      if (data?.type === 'NEW_NOTIFICATION') {
        setNotifications((prev) => {
          // ✅ 重複防止
          const exists = prev.some(
            (n) =>
              n.timestamp === data.payload.timestamp &&
              n.title === data.payload.title
          );

          if (exists) return prev;

          return [data.payload, ...prev];
        });
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handler);
    };
  }, []);

  // ✅ 未読数
  const unreadCount = notificationsState.filter((n) => !n.read).length;


  // ✅ 変化した「未読数」をネイティブバッジに動的反映（追加コード）
  useEffect(() => {
    if (!('setAppBadge' in navigator)) return;

    const updateNativeBadge = async () => {
      try {
        if (unreadCount > 0) {
          await navigator.setAppBadge(unreadCount);
        } else {
          await navigator.clearAppBadge(); // 未読が0になったらバッジを消去
        }
      } catch (error) {
        console.error("ネイティブバッジの更新に失敗しました:", error);
      }
    };

    updateNativeBadge();
  }, [unreadCount]); // 未読数が変わるたびに自動実行される

  return (
    <Card sx={{ width: '100%', mb: 4 }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: { xs: '100%', sm: 260 }, marginBottom: 3 }}
          onClick={handleRequestNotification}
        >
          通知を許可する
        </Button>

        {/* ===== Header ===== */}
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
            <Notifications color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              お知らせ
            </Typography>

            {unreadCount > 0 && (
              <Badge badgeContent={unreadCount} color="error" />
            )}
          </Stack>

          {notificationsState.length > 0 && (
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

        {/* ===== Empty ===== */}
        {notificationsState.length === 0 ? (
          <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <HelpOutline sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              通知はまだありません
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: '380px' }}>
              新しいお知らせが届くとここに表示されます。
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {notificationsState.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>

                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: item.read ? 'divider' : 'primary.main',
                    bgcolor: isDark
                      ? item.read
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(93,118,246,0.08)'
                      : item.read
                        ? 'rgba(0,0,0,0.01)'
                        : 'rgba(5,41,225,0.05)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: 'primary.main',
                      boxShadow: isDark
                        ? '0 6px 20px rgba(93,118,246,0.12)'
                        : '0 6px 20px rgba(5,41,225,0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>

                    <Box>
                      {/* ===== Top info ===== */}
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip
                          icon={item.read ? <Drafts sx={{ fontSize: '1rem !important' }} /> : <Notifications sx={{ fontSize: '1rem !important' }} />}
                          label={item.read ? '既読' : '未読'}
                          size="small"
                          color={item.read ? 'default' : 'primary'}
                          variant="outlined"
                          sx={{ fontWeight: 'bold', fontSize: '0.75rem', height: 24 }}
                        />

                        <Stack direction="row" sx={{ alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                          <DateRange sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {new Date(item.timestamp).toLocaleDateString('ja-JP', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* ===== Title */}
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                        {item.title}
                      </Typography>

                      {/* ===== Body */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.body}
                      </Typography>

                      {/* URL */}
                      {item.url && (
                        <Stack direction="row" sx={{ spacing: 1, alignItems: "center", mb: 2 }}>
                          <LinkIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption" color="primary">
                            {item.url}
                          </Typography>
                        </Stack>
                      )}
                    </Box>

                    {/* ===== Actions */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>

                      {!item.read && item.id && (
                        <Button
                          fullWidth
                          size="small"
                          startIcon={<MarkEmailRead />}
                          variant="contained"
                          onClick={() => {
                            onMarkAsRead(item.id!);

                            // ✅ 即UI反映
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.id === item.id ? { ...n, read: true } : n
                              )
                            );
                          }}
                          sx={{
                            py: 1,
                            fontSize: '0.8rem',
                            borderRadius: 2.5,
                            boxShadow: 'none',
                            color: '#fff',
                          }}
                        >
                          既読にする
                        </Button>
                      )}

                      <Tooltip title="削除">
                        <IconButton
                          color="error"
                          onClick={() => {
                            if (!item.id) return;

                            onDeleteItem(item.id);

                            // ✅ 即削除反映
                            setNotifications((prev) =>
                              prev.filter((n) => n.id !== item.id)
                            );
                          }}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2.5,
                            width: 38,
                            height: 38,
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

      {/* Toast Notification message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity || 'info'}
          variant="filled" //
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ===== Dialog */}
      <Dialog
        open={openClearDialog}
        onClose={() => setOpenClearDialog(false)}
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          通知をすべて削除しますか？
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            保存されているすべての通知が削除され、復元はできません。
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenClearDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            キャンセル
          </Button>

          <Button
            onClick={onClearAll}
            variant="contained"
            color="error"
            sx={{ borderRadius: 3, color: '#fff' }}
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}