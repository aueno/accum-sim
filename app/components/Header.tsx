'use client';

import React from 'react';
import { Box, Stack, Typography, Button, IconButton } from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import GetApp from '@mui/icons-material/GetApp';
import LightMode from '@mui/icons-material/LightMode';
import DarkMode from '@mui/icons-material/DarkMode';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../ThemeRegistry';

interface HeaderProps {
  showInstallBtn: boolean;
  handleInstallClick: () => void;
}

export default function Header({ showInstallBtn, handleInstallClick }: HeaderProps) {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: 2,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrendingUp sx={{ color: '#fff', fontSize: 26 }} />
        </Box>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
            つみたてNavi
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            資産形成シミュレーション & 逆算プランナー
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        {showInstallBtn && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<GetApp />}
            onClick={handleInstallClick}
            sx={{ borderRadius: 8 }}
          >
            アプリをインストール
          </Button>
        )}
        <IconButton
          onClick={toggleColorMode}
          color="primary"
          sx={{ border: 1, borderColor: 'divider' }}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Stack>
    </Box>
  );
}
