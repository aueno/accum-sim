'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Divider, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const formatYenToManValue = (yen: number): string => {
  const roundedMan = Math.round(yen / 1000) / 10;
  return roundedMan.toLocaleString('ja-JP', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

interface ResultCardProps {
  finalAmount: number;
  totalPrincipal: number;
  totalInterest: number;
  isInverse: boolean;
  inverseTargetType?: 'monthlyContribution' | 'annualRate' | 'durationYears';
  inverseCalculatedResult?: number | null;
}

export default function ResultCard({
  finalAmount,
  totalPrincipal,
  totalInterest,
  isInverse,
  inverseTargetType,
  inverseCalculatedResult,
}: ResultCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        background: isDark
          ? 'linear-gradient(135deg, #0c184d 0%, #122896 100%)'
          : 'linear-gradient(135deg, #0529e1 0%, #1545fc 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          : '0 8px 32px 0 rgba(5, 41, 225, 0.15)',
      }}
    >
      {/* Visual background circle decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: 150,
          height: 150,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.06)',
          zIndex: 0,
        }}
      />

      <CardContent sx={{ p: { xs: 3, sm: 4 }, zIndex: 1, position: 'relative' }}>
        {/* Inverse calculation specific display */}
        {isInverse && inverseTargetType && (
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: '0.1em', fontWeight: 'bold' }}>
              逆算シミュレーション結果 ({
                inverseTargetType === 'monthlyContribution' ? '毎月の必要な積立額' :
                inverseTargetType === 'annualRate' ? '必要な利回り' : '必要な運用期間'
              })
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 0.5 }}>
              {inverseTargetType === 'monthlyContribution' && (
                <>
                  <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '2rem', sm: '3rem' } }}>
                    {inverseCalculatedResult ? formatYenToManValue(inverseCalculatedResult) : '0.0'}
                  </Typography>
                  <Typography variant="h6" sx={{ ml: 1, opacity: 0.9 }}>
                    万円 / 月
                  </Typography>
                </>
              )}
              {inverseTargetType === 'annualRate' && (
                <>
                  <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '2rem', sm: '3rem' } }}>
                    {inverseCalculatedResult !== null && inverseCalculatedResult !== undefined
                      ? inverseCalculatedResult.toLocaleString('ja-JP', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
                      : '0.0'}
                  </Typography>
                  <Typography variant="h6" sx={{ ml: 1, opacity: 0.9 }}>
                    % / 年
                  </Typography>
                </>
              )}
              {inverseTargetType === 'durationYears' && (
                <>
                  <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '2rem', sm: '3rem' } }}>
                    {inverseCalculatedResult !== null && inverseCalculatedResult !== undefined
                      ? inverseCalculatedResult
                      : '0.0'}
                  </Typography>
                  <Typography variant="h6" sx={{ ml: 1, opacity: 0.9 }}>
                    年
                  </Typography>
                </>
              )}
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.15)', my: 2 }} />
          </Box>
        )}

        <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: '0.1em', fontWeight: 'bold' }}>
          将来の積立金額 (想定合計)
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mt: 0.5,
            letterSpacing: '-0.02em',
            fontSize: { xs: '2.5rem', sm: '3.75rem' },
          }}
        >
          {formatYenToManValue(finalAmount)}
          <span style={{ fontSize: '1.5rem', marginLeft: '6px', fontWeight: 600 }}>万円</span>
        </Typography>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid size={{ xs: 6 }}>
            <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', borderRadius: 3, p: 2 }}>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5, fontWeight: 'bold' }}>
                積立元本 (合計)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {formatYenToManValue(totalPrincipal)}万円
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box
              sx={{
                bgcolor: 'rgba(230, 169, 0, 0.12)',
                border: '1px solid rgba(230, 157, 0, 0.3)',
                borderRadius: 3,
                p: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: '#f88213', display: 'block', mb: 0.5, fontWeight: 'bold' }}>
                運用益 (利息分)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f88213', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                +{formatYenToManValue(totalInterest)}万円
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
