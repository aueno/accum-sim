'use client';

import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import Calculate from '@mui/icons-material/Calculate';
import TrackChanges from '@mui/icons-material/TrackChanges';
import History from '@mui/icons-material/History';
import { useTheme } from '@mui/material/styles';

interface FooterNavigationProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function FooterNavigation({ value, onChange }: FooterNavigationProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: { xs: 12, sm: 20 },
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: 'calc(100% - 24px)', sm: '550px' },
        zIndex: 1200,
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(5, 41, 225, 0.08)',
        bgcolor: isDark ? 'rgba(14, 19, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        backgroundImage: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDark
          ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          : '0 8px 32px 0 rgba(5, 41, 225, 0.08)',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        showLabels
        sx={{
          height: 72,
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            transition: 'all 0.2s ease-in-out',
            py: 1,
            minWidth: 0,
            '&.Mui-selected': {
              color: 'primary.main',
              transform: 'scale(1.05)',
              fontWeight: 'bold',
              '& .MuiSvgIcon-root': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s',
              }
            },
            '&:hover': {
              color: 'primary.main',
              opacity: 0.85,
            }
          },
          '& .MuiSvgIcon-root': {
            fontSize: 24,
            mb: 0.5,
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            fontFamily: 'inherit',
            fontWeight: 600,
            '&.Mui-selected': {
              fontSize: '0.8rem',
            }
          }
        }}
      >
        <BottomNavigationAction
          label="積立計算"
          icon={<Calculate />}
        />
        <BottomNavigationAction
          label="目標逆算"
          icon={<TrackChanges />}
        />
        <BottomNavigationAction
          label="履歴一覧"
          icon={<History />}
        />
      </BottomNavigation>
    </Paper>
  );
}
