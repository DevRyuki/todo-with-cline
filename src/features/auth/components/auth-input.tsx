'use client';

import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';

type AuthInputProps = {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * 認証フォーム用の入力フィールドコンポーネント
 */
export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      id,
      name,
      type = 'text',
      label,
      placeholder,
      error,
      required = false,
      disabled = false,
      className = '',
      autoComplete,
      ...props
    },
    ref
  ) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-1"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <Input
          ref={ref}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          data-testid={`${name}-input`}
          className={`
            ${error ? 'border-destructive focus-visible:ring-destructive' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

// コンポーネント名を設定
AuthInput.displayName = 'AuthInput';
