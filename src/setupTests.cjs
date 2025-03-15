// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// グローバルなモックの設定
global.fetch = jest.fn();

// React 18のエラー抑制
// https://github.com/facebook/react/issues/20756
global.IS_REACT_ACT_ENVIRONMENT = true;
