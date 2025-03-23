'use client';

import React, { forwardRef } from 'react';

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
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
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
            w-full px-3 py-2 border rounded-md shadow-sm
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
            focus:outline-none focus:ring-2
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

// コンポーネント名を設定
AuthInput.displayName = 'AuthInput';
