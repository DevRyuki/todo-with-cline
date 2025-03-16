# 進捗状況

## 完了した項目

### データベース
- ✅ PostgreSQL設定（Docker）
- ✅ Drizzle ORM設定
- ✅ スキーマ定義
  - ✅ Todos, Projects, Workspaces
  - ✅ 認証関連（users, accounts, sessions等）
  - ✅ パスワード管理
- ✅ マイグレーション設定

### バックエンド
- ✅ Next.js APIルート
- ✅ Todos API
  - ✅ CRUD操作エンドポイント
- ✅ 認証API
  - ✅ NextAuth, 登録, パスワードリセット
- ✅ フィーチャーベース構造

### プロジェクト設定
- ✅ Next.js初期化
- ✅ TypeScript/ESLint設定
- ✅ Docker環境
- ✅ 環境変数設定
- ✅ 型定義ファイル

## 進行中の項目

### テスト環境改善（優先度：高）
- ✅ テスト環境基本設定
- ✅ ESLint/Jest連携
- 🔄 テスト実行時のエラー解消
  - ✅ テストファイルの構文エラー修正
    - ✅ 関数宣言の括弧の欠落修正
    - ✅ カンマの欠落修正
    - ✅ `async` キーワードの欠落修正
  - ✅ JSX変換エラー解消（`SyntaxError: Unexpected token '<'`）
  - ✅ TextEncoder未定義エラー解消（`ReferenceError: TextEncoder is not defined`）
  - ✅ Next.js環境エラーの一部解消（Request, Response, Headersクラスのモック）
  - 🔄 モックライブラリの導入と活用
    - ✅ jest-mock-extendedの導入（型安全なモック作成）
    - 🔄 next-test-api-route-handlerの導入（APIルートテスト）
    - 🔄 MSWの導入検討（APIリクエストのモック）
  - 🔄 auth.handler.tsファイルのコンソールエラー修正（カンマの欠落）
  - ✅ ハンドラーテストの構文エラー修正
  - ✅ 認証関連テストのインポートエラー解消
  - ✅ モジュールパスエイリアス設定 - jest.config.tsで設定済み
- 🔄 Jest設定の最適化
  - ✅ next/jest使用 - jest.config.tsで設定済み
  - ✅ JSX変換設定 - ts-jestでuseESM: trueとjsx: 'react-jsx'を設定
  - ✅ Next.js環境のモック設定 - jest.setup.tsでモッククラス実装
  - ✅ Playwrightテストの分離 - testPathIgnorePatternsで除外
  - 🔄 テスト実行スクリプトの分離（コンポーネント/サービス/ハンドラー）
- ✅ モック型定義改善
- ✅ E2Eテスト基本実装
- ✅ setupTests.js と setupTests.cjs の重複解消 - jest.setup.tsへの移行
- ✅ TodoListコンポーネントのエラーメッセージ修正

### フロントエンド（優先度：高）
- ✅ データフェッチング
  - ✅ フェッチャー実装（APIとの通信）
  - ✅ カスタムフック実装
  - ✅ エラーハンドリング
  - ✅ ローディング状態管理
- 🔄 フロントエンド実装
  - 🔄 ページタイトルの修正（現在は "Create Next App"）
  - 🔄 Todoリスト表示コンポーネント実装（data-testid="todo-list"が見つからない）
  - 🔄 認証UI実装（signin-form, signup-form, forgot-password-formが見つからない）
- 🔄 Todo作成・編集フォーム
  - 🔄 基本フォームコンポーネント（Shadcn/UI使用）
  - 🔄 フォームバリデーション
  - 🔄 フォームモーダル実装
  - 🔄 メインページ統合
- 🔄 ページレイアウト
  - 🔄 基本レイアウト構造
  - 🔄 ナビゲーション実装
  - 🔄 レスポンシブデザイン対応
  - 🔄 テーマ・スタイリング調整
- 🔄 UIコンポーネント設計
  - ✅ Shadcn/UI採用決定
  - 🔄 共通UIコンポーネント実装
  - 🔄 機能別コンポーネント実装
  - 🔄 フォームベースコンポーネント実装

### バックエンド（優先度：中）
- ✅ 認証API/パスワードリセット
- 🔄 Projects/Workspaces API
- 🔄 リレーションシップ実装
- 🔄 エラーハンドリング改善
- ✅ APIルートのパス修正

## 未着手の項目

### フロントエンド
- ❌ Todo高度な機能（フィルタリング、ソート、検索）
- ❌ プロジェクト/ワークスペース管理UI
- ❌ レスポンシブデザイン

### バックエンド
- ❌ 高度なクエリ/ページネーション/検索

### セキュリティ
- ❌ パスワード強度ポリシー
- ❌ ユーザー列挙攻撃対策
- ❌ レート制限/HTTPS/CSP
- ❌ アカウントロックアウト/2FA

### テスト/デプロイ
- ✅ 統合テスト
- ✅ E2Eテスト基本実装
- 🔄 E2Eテスト拡充
- ❌ セキュリティテスト
- ❌ 本番環境/CI/CD設定

## 既知の問題
- テスト環境の問題
  - NextRequest/NextResponseのモック実装が不完全
  - ✅ AuthServiceのモックメソッド（mockResolvedValue、mockRejectedValue）の問題解決済み
  - auth.handler.tsファイルにコンソールエラーメッセージのカンマ欠落
  - Playwrightテストの実行方法（`npm run test:e2e`で実行する必要あり）
- フロントエンド実装の不足
  - ページタイトルが未設定（現在は "Create Next App"）
  - Todoリスト表示コンポーネントが未実装（data-testid="todo-list"が見つからない）
  - 認証UI（signin-form, signup-form, forgot-password-formが見つからない）
  - Todo作成・編集フォームが未実装
  - ページレイアウトが未実装
- DBリレーションシップ最適化
- E2Eテスト
  - すべてのE2Eテストが失敗（UIコンポーネントが実装されていないため）

## 優先タスク（2025/3/16現在）

1. **テスト環境の根本的改善**
   - ✅ モックライブラリの導入（jest-mock-extended）
     - ✅ 型安全なモックを簡単に作成
     - ✅ AuthServiceのモック問題を解決
   - ✅ テストヘルパー関数の作成（src/test/helpers.ts）
     - ✅ createMockAuthService()
     - ✅ createMockRequest()
     - ✅ expectJsonResponse()
   - 🔄 auth.handler.tsファイルのカンマ欠落修正
   - ✅ NextResponseのモック簡素化（jest.setup.tsの修正）

2. **フロントエンド実装**
   - Todoリスト表示コンポーネントの実装
   - Todo作成・編集フォーム実装
   - ページタイトルの修正

3. **Projects/Workspaces API実装**
   - スキーマ定義の確認
   - APIエンドポイント実装
   - サービス層実装

## 次のマイルストーン
1. **テスト環境の根本的改善**（1-2日）
   - モックライブラリの導入
   - テストヘルパー関数の作成
   - auth.handler.tsファイルの修正
   - NextResponseのモック簡素化

2. **Todoリスト機能の完成**（2-3日）
   - Todoリスト表示コンポーネント実装
   - Todo作成・編集フォーム実装
   - Todoリスト機能のE2Eテスト修正

3. **Projects機能の実装**（3-4日）
   - Projects API実装
   - Projectsフロントエンド実装
   - Projects機能のテスト

4. **Workspaces機能の実装**（2-3日）
   - Workspaces API実装
   - Workspacesフロントエンド実装
   - Workspaces機能のテスト

5. **UI/UX改善**（2-3日）
   - ページレイアウト改善
   - レスポンシブデザイン対応
   - テーマ・スタイリング調整

6. **セキュリティ強化**（1-2日）
   - パスワード強度ポリシー
   - ユーザー列挙攻撃対策

7. **デプロイ準備**（1-2日）
   - 本番環境設定
   - CI/CD設定
