'use client';

import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

/* ------------------------------------------------------------------ */
/* 数値入力用 TextField                                                 */
/*  - 整数: inputMode="numeric"（0〜9 のみのテンキー）                    */
/*  - 小数: inputMode="decimal"（0〜9 + 小数点のテンキー）                */
/*  - 入力途中の文字列（"1." や "" など）を保持するため内部で string 管理   */
/* ------------------------------------------------------------------ */
type NumericTextFieldProps = Omit<TextFieldProps, 'value' | 'onChange' | 'type'> & {
  value: number;
  onValueChange: (val: number) => void;
  min: number;
  max: number;
  allowDecimal?: boolean;
  unit?: string;
};

const toHalfWidth = (s: string) =>
  s
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[．。]/g, '.');

export default function NumericTextField({
  value,
  onValueChange,
  min,
  max,
  allowDecimal = false,
  unit,
  onBlur,
  ...rest
}: NumericTextFieldProps) {
  const [draft, setDraft] = React.useState<string>(String(value));

  // スライダーやプリセットで外部から値が変わったときに表示を同期
  React.useEffect(() => {
    setDraft((prev) => (prev !== '' && Number(prev) === value ? prev : String(value)));
  }, [value]);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let next = toHalfWidth(e.target.value);

    if (allowDecimal) {
      next = next.replace(/[^0-9.]/g, '');
      const firstDot = next.indexOf('.');
      if (firstDot !== -1) {
        // 小数点は 1 つだけ許可
        next = next.slice(0, firstDot + 1) + next.slice(firstDot + 1).replace(/\./g, '');
      }
    } else {
      next = next.replace(/[^0-9]/g, '');
    }

    setDraft(next);

    if (next === '' || next === '.') return; // 入力途中は親へ反映しない
    const parsed = Number(next);
    if (!Number.isNaN(parsed)) onValueChange(clamp(parsed));
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    // フォーカスが外れたら確定値で表示を整える（"1." → "1", "" → 現在値）
    setDraft(String(value));
    onBlur?.(e);
  };

  return (
    <TextField
      {...rest}
      type="text"
      value={draft}
      onChange={handleChange}
      onBlur={handleBlur}
      slotProps={{
        htmlInput: allowDecimal
          ? { inputMode: 'decimal', pattern: '[0-9]*[.]?[0-9]*' }
          : { inputMode: 'numeric', pattern: '[0-9]*' },
        input: unit
          ? { endAdornment: <InputAdornment position="end">{unit}</InputAdornment> }
          : undefined,
      }}
    />
  );
}