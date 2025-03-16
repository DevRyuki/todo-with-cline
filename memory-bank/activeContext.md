# アクティブコンテキスト

## 現在の作業焦点
- テスト環境の改善と問題解決
- Todo基本機能実装
- フィーチャーモジュール構造確立
- TDD実践とESLint連携
- フロントエンドコンポーネント開発
- Projects/Workspaces API実装

## 最近の変更
- DBスキーマ定義（Drizzle）
- Todos CRUD API実装
- プロジェクト/ワークスペーススキーマ定義
- フィーチャーベース構造導入
- 認証バックエンド実装（NextAuth）
- パスワードリセット機能実装（Resend）
- 認証UI実装（ログイン/登録/リセット）
- コンポーネント適切分離
- モック型定義改善（jest.d.ts）
- TodoListコンポーネント実装
- コンポーネント/API統合テスト実装
- テスト用型定義ファイル作成
- E2Eテスト環境構築（Playwright）
- E2Eテスト実装
  - 認証関連テスト（サインイン/サインアップ/パスワードリセット）
  - Todoアプリ基本機能テスト（表示/完了状態切替）
  - テストデータベースリセット機能
- データフェッチング機能実装
  - Todoフェッチャー実装（APIとの通信）
  - Todoカスタムフック実装（useTodos）
  - エラーハンドリングとローディング状態管理
  - TodoListコンポーネントをカスタムフック使用に更新
- APIルートのインポートパス修正
- Jest設定の最適化（jest.setup.jsの改善）
  - Next.js環境のモック設定強化
  - グローバルオブジェクトの設定
  - Next.jsコンポーネントのモック

## 進行中の作業
- テスト環境の改善（優先度：高）
  - JSX変換エラー解消
  - Next.js環境エラー解消
  - モジュールパスエラー解消
  - Jest設定の最適化
- Todo作成・編集フォーム開発（優先度：中）
  - 基本フォームコンポーネント実装
  - フォームバリデーション
  - モーダル統合
  - メインページ更新
- Projects/Workspaces API実装（優先度：中）
  - スキーマ定義の確認
  - APIエンドポイント実装
  - サービス層実装
  - テスト実装
- ページレイアウト改善（優先度：中）
  - 基本レイアウト構造実装
  - ナビゲーション実装
  - レスポンシブデザイン対応

## 次のステップ
1. **テスト環境の改善**
   - Jest設定の最適化（ESモジュール対応、JSX変換設定）
   - Next.js環境のモック設定
   - モジュールパスエイリアス設定の修正
   - テスト実行スクリプトの分離（コンポーネント/サービス/ハンドラー）
2. **Todo作成・編集フォーム開発**
   - 基本フォームコンポーネント実装
   - フォームバリデーション
   - モーダル統合
   - メインページ更新
3. **Projects/Workspaces API実装**
   - スキーマ定義の確認
   - APIエンドポイント実装
   - サービス層実装
   - テスト実装
4. **ページレイアウト改善**
   - 基本レイアウト構造実装
   - ナビゲーション実装
   - レスポンシブデザイン対応

## アクティブな決定事項
- **TDD**: テスト→実装→リファクタリングサイクル
- **フィーチャーベース構造**: 機能ごとのコード整理
- **Drizzle ORM**: 型安全SQLクエリビルダー
- **Next.js App Router**: ルーティング/API統合
- **コンポーネント分離**: UI/データ/ロジック分離
- **NextAuth**: 認証システム
- **Resend**: メール送信
- **テスト戦略**: 単体テスト、統合テスト、コンポーネントテスト、E2Eテストの組み合わせ
- **E2Eテスト**: Playwrightを使用したブラウザテスト
- **UIコンポーネント**: Shadcn/UIを使用したコンポーネントライブラリ
- **Jest設定の最適化**: 
  - プロジェクト分割（components, hooks, services, handlers）
  - ESモジュールサポート
  - Next.js環境のモック

## 現在の課題
- テスト環境の問題
  - JSX変換エラー（`SyntaxError: Unexpected token '<'`）
  - Next.js環境エラー（`ReferenceError: Request is not defined`）
  - モジュールパスエラー（`Could not locate module @/features/auth/schemas/password.schema`）
  - Playwrightテストの実行方法（`npm run test:e2e`で実行する必要あり）
- DBリレーションシップ最適設計
- パフォーマンス最適化
- スケーラビリティ確保
- 認証セキュリティ強化
  - パスワード強度ポリシー
  - ユーザー列挙攻撃対策
- コンポーネントとAPIの連携テスト拡充
- E2Eテスト環境の安定性向上
  - テストデータの一貫性確保
  - テスト間の独立性維持
  - テスト実行速度の最適化
- テスト環境の重複ファイル（setupTests.js と setupTests.cjs）の整理

## 検討中の代替案
- 状態管理: Context vs Redux vs Zustand
- フォーム: React Hook Form vs Formik
- テスト環境改善:
  - Jest設定の見直し vs Vitest導入
  - ts-jestの設定調整 vs babel-jestへの移行
  - Next.js環境のモック方法
  - setupTests.js と setupTests.cjs の統合

## 重要なメモ
- APIパターン: `/api/[resource]`
- フィーチャーモジュールは独立開発可能に
- UIはレスポンシブ設計
- 認証API:
  - `/api/auth/[...nextauth]`
  - `/api/auth/register`
  - `/api/auth/forgot-password`
  - `/api/auth/reset-password`
- モック型定義は`jest.d.ts`で管理
- パスワードは独立テーブルで管理
- テスト環境の問題:
  - JSXテスト: `"type": "module"`と`"jsx": "preserve"`の設定がJestと競合
  - Next.jsテスト: テスト環境でNext.jsのグローバルオブジェクトが正しく定義されていない
  - モジュールパス: `@/`エイリアスの解決設定が不完全
- E2Eテスト:
  - Playwrightフレームワーク使用
  - `npm run test:e2e`でテスト実行
  - `npm run test:e2e:ui`でUI表示モード
  - `npm run test:e2e:debug`でデバッグモード
  - テスト前にデータベースリセット（`tests/helpers/setup-db.ts`）
  - グローバルセットアップ（`tests/global-setup.ts`）
  - テストデータ自動生成
  - データテスト属性（`data-testid`）を使用したセレクタ
- Jest設定:
  - jest.config.jsでプロジェクト分割（components, hooks, services, handlers）
  - jest.setup.jsでNext.js環境のモック設定
  - setupTests.jsとsetupTests.cjsの重複（整理が必要）
