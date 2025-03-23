'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type AuthButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
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
  variant = 'default',
  className = '',
}: AuthButtonProps) => {
  // ボタンのタイプに基づいてdata-testidを設定
  let testId = '';
  if (type === 'submit') {
    // フォームのコンテキストに基づいてボタンのdata-testidを推測
    if (children === 'ログイン') {
      testId = 'signin-button';
    } else if (children === '登録する' || children === 'アカウント作成') {
      testId = 'signup-button';
    } else {
      testId = 'submit-button';
    }
  } else if (variant === 'link' && children === 'ログアウト') {
    testId = 'signout-button';
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant}
      className={className}
      data-testid={testId || undefined}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? '処理中...' : children}
    </Button>
  );
};
