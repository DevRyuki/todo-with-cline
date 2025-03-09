'use client';

import React from 'react';

type AuthButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'link';
  className?: string;
};

/**
 * 認証フォーム用のボタンコンポーネント
 */
export const AuthButton = ({
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  children,
  variant = 'primary',
  className = '',
}: AuthButtonProps) => {
  // バリアントに基づくスタイルの設定
  const baseStyles = 'flex justify-center items-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    link: 'text-blue-600 hover:text-blue-800 underline bg-transparent',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${disabled || isLoading ? disabledStyles : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonStyles}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          処理中...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
