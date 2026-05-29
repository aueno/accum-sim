'use client';

import React from 'react';
import { Card, CardContent, Stack, Typography, Chip, Box } from '@mui/material';
import Analytics from '@mui/icons-material/Analytics';
import { useTheme } from '@mui/material/styles';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  Legend,
  Filler
);

interface ResultChartProps {
  yearlyData: Array<{
    year: number;
    principal: number;
    interest: number;
    total: number;
  }>;
}

export default function ResultChart({ yearlyData }: ResultChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const chartLabels = yearlyData.map((d) => `${d.year}年目`);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: '元本総額',
        data: yearlyData.map((d) => Math.round(d.principal / 1000) / 10), // 万単位
        backgroundColor: isDark ? 'rgba(93, 118, 246, 0.7)' : 'rgba(5, 41, 225, 0.7)',
        borderColor: isDark ? '#5d76f6' : '#0529e1',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'Stack 0'
      },
      {
        label: '運用益',
        data: yearlyData.map((d) => Math.round(d.interest / 1000) / 10), // 万単位
        backgroundColor: 'rgba(0, 230, 118, 0.7)',
        borderColor: '#00e676',
        borderWidth: 1,
        borderRadius: 4,
        stack: 'Stack 0'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#94a3b8' : '#475569',
          font: { family: 'Noto Sans JP', weight: 'bold' as any }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} 万円`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: isDark ? '#94a3b8' : '#475569' }
      },
      y: {
        stacked: true,
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          color: isDark ? '#94a3b8' : '#475569',
          callback: (value: any) => `${value.toLocaleString()}万`
        }
      }
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Analytics color="primary" /> 資産額の推移
          </Typography>
          <Chip
            size="small"
            label="毎年表示"
            color="primary"
            sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold' }}
          />
        </Stack>
        <Box sx={{ height: 320, width: '100%', position: 'relative' }}>
          {yearlyData.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">計算結果がありません</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
