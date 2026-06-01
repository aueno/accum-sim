'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Pagination,
} from '@mui/material';

const formatYenToManValue = (yen: number): string => {
  const roundedMan = Math.round(yen / 1000) / 10;
  return roundedMan.toLocaleString('ja-JP', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

interface ResultTableProps {
  yearlyData: Array<{
    year: number;
    principal: number;
    interest: number;
    total: number;
  }>;
  tablePage: number;
  setTablePage: (page: number) => void;
}

const rowsPerPage = 10;

export default function ResultTable({ yearlyData, tablePage, setTablePage }: ResultTableProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
          シミュレーション推移表 (年度別)
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>経過年</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>元本総額</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>運用益 (累計)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>資産合計</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yearlyData
                .slice((tablePage - 1) * rowsPerPage, tablePage * rowsPerPage)
                .map((row) => (
                  <TableRow key={row.year} hover>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>{row.year}年目</TableCell>
                    <TableCell align="right">{formatYenToManValue(row.principal)} 万円</TableCell>
                    <TableCell align="right" sx={{ color: '#ee7009', fontWeight: 600 }}>
                      +{formatYenToManValue(row.interest)} 万円
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatYenToManValue(row.total)} 万円</TableCell>
                  </TableRow>
                ))}
              {yearlyData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    データがありません。パラメータを入力してください。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table pagination */}
        {yearlyData.length > rowsPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5 }}>
            <Pagination
              count={Math.ceil(yearlyData.length / rowsPerPage)}
              page={tablePage}
              onChange={(e, val) => setTablePage(val)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
