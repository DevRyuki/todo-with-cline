// テスト用の型定義
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeChecked(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toHaveFocus(): R;
      toHaveStyle(style: Record<string, unknown>): R;
      toHaveValue(value: string | string[] | number): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
      toBeEmpty(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toHaveDescription(text: string | RegExp): R;
    }
  }
}

// React Testing Libraryの型定義
declare module '@testing-library/react' {
  export * from '@testing-library/react';
}

// Jest DOMの型定義
declare module '@testing-library/jest-dom' {
  export {};
}
