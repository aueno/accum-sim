'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import LibraryBooks from '@mui/icons-material/LibraryBooks';
import WarningAmber from '@mui/icons-material/WarningAmber';

export default function TermsDialog() {
  const [open, setOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if the user has already agreed to the terms
    const agreed = localStorage.getItem('termsAgreed');
    if (agreed !== 'true') {
      setOpen(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('termsAgreed', 'true');
    setOpen(false);
  };

  const handleDisagree = () => {
    setShowWarning(true);
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Prevent closing the modal by clicking outside or pressing Escape
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 1.5,
            maxWidth: '500px',
            width: '100%',
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <LibraryBooks color="primary" />
        利用規約・免責事項
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
            本サービスは，将来の資産成長を保証するものではありません．
          </Typography>

          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
            本サービスを利用したことに起因するあらゆる損害について，当方では一切責任を負いかねます． 実際の運用及び投資判断は，ご自身の責任において行ってください．
          </Typography>

          <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
            本シミュレーション結果は，あくまで目安としてご利用ください．
            <br />
            本シミュレーションは，税金を考慮していません．
          </Typography>

          <Divider />

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, lineHeight: 1.5 }}>
            「同意する」ボタンをクリックすることで，上記の利用規約に同意いただいたものとみなします．
          </Typography>

          {showWarning && (
            <Alert 
              severity="warning" 
              icon={<WarningAmber fontSize="small" />}
              sx={{ mt: 1, borderRadius: 2, fontWeight: 'bold' }}
            >
              本サービスをご利用いただくには、利用規約に同意いただく必要があります。
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={handleDisagree} 
          variant="outlined" 
          color="error" 
          sx={{ borderRadius: 3, px: 3 }}
        >
          同意しない
        </Button>
        <Button 
          onClick={handleAgree} 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 3, px: 4, color: '#fff' }}
        >
          同意する
        </Button>
      </DialogActions>
    </Dialog>
  );
}
