'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', nextMode);
          return nextMode;
        });
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#0529e1' : '#5d76f6',
            light: mode === 'light' ? '#eef2ff' : '#1e254d',
          },
          secondary: {
            main: '#00e676',
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#070a13',
            paper: mode === 'light' ? '#ffffff' : '#0e1327',
          },
          text: {
            primary: mode === 'light' ? '#0f172a' : '#f1f5f9',
            secondary: mode === 'light' ? '#475569' : '#94a3b8',
          },
          divider: mode === 'light' ? 'rgba(5, 41, 225, 0.08)' : 'rgba(255, 255, 255, 0.08)',
        },
        typography: {
          fontFamily: 'var(--font-geist-sans), "Noto Sans JP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
          h1: { fontWeight: 800, letterSpacing: '-0.02em' },
          h2: { fontWeight: 800, letterSpacing: '-0.02em' },
          h3: { fontWeight: 700, letterSpacing: '-0.01em' },
          h4: { fontWeight: 700, letterSpacing: '-0.01em' },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          subtitle1: { fontWeight: 500 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: '10px 20px',
                fontSize: '0.95rem',
                boxShadow: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(5, 41, 225, 0.15)',
                  transform: 'translateY(-1px)',
                },
              },
            },
            variants: [
              {
                props: { variant: 'contained', color: 'secondary' },
                style: {
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 230, 118, 0.25)',
                  },
                },
              },
            ],
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                backgroundImage: 'none',
                boxShadow: mode === 'light' 
                  ? '0px 4px 20px rgba(15, 23, 42, 0.03), 0px 1px 3px rgba(15, 23, 42, 0.02)' 
                  : '0px 4px 20px rgba(0, 0, 0, 0.25), 0px 1px 3px rgba(0, 0, 0, 0.15)',
                border: '1px solid',
                borderColor: mode === 'light' ? 'rgba(5, 41, 225, 0.06)' : 'rgba(255, 255, 255, 0.06)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              },
            },
          },
          MuiSlider: {
            styleOverrides: {
              root: {
                height: 6,
              },
              thumb: {
                width: 20,
                height: 20,
                border: '3px solid currentColor',
                backgroundColor: '#fff',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(5, 41, 225, 0.16)',
                },
              },
              track: {
                borderRadius: 3,
              },
              rail: {
                borderRadius: 3,
                opacity: 0.3,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  '& fieldset': {
                    borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'light' ? 'rgba(5, 41, 225, 0.5)' : 'rgba(93, 118, 246, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: 2,
                  },
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  // Avoid hydration mismatch by rendering children only after mounting on the client
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden', minHeight: '100vh', background: mode === 'light' ? '#f8fafc' : '#070a13' }}>
        {children}
      </div>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
