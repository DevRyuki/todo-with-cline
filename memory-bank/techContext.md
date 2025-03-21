# 技術コンテキスト

## 技術スタック

### フロントエンド
- **Next.js**: App Router使用
- **React**: UIライブラリ
- **Tailwind CSS**: ユーティリティCSS
- **Shadcn/UI**: 再利用可能なUIコンポーネント
- **TypeScript**: 静的型付け

### バックエンド
- **Next.js API Routes**: サーバーサイドAPI
- **Drizzle ORM**: SQLクエリビルダー
- **PostgreSQL**: データベース
- **NextAuth.js**: 認証
- **Resend**: メール送信
- **bcrypt**: パスワードハッシュ化
- **Zod**: バリデーション

### 開発ツール
- **Docker**: 開発環境
- **ESLint**: コード品質
- **Jest**: テストフレームワーク
- **ts-jest**: TypeScript対応
- **React Testing Library**: UIテスト
- **Playwright**: E2Eテスト
- **Supertest**: APIテスト
- **MSW**: APIリクエストのモック
- **jest-mock-extended**: 型安全なモック作成

## 開発環境セットアップ

### 必要条件
- Node.js
- Docker と Docker Compose
- npm または yarn

### 環境変数
`.env.local`に設定：
- DB接続情報
- NextAuth設定（URL, SECRET）
- Resend設定（API_KEY, APP_URL）

### 開発サーバー起動
```bash
npm install
docker-compose up -d
npm run db:migrate
npm run dev
```

## データベース

### 主要スキーマ
- **Todos**: id, title, description, completed, userId, projectId, timestamps
- **Projects**: id, name, description, userId, workspaceId, timestamps
- **Workspaces**: id, name, description, userId, timestamps
- **Users**: NextAuth標準
- **Accounts**: OAuth連携
- **Sessions**: ユーザーセッション
- **VerificationTokens**: メール検証
- **Passwords**: パスワード管理

### マイグレーション
- `npm run db:generate` - マイグレーションファイル生成
- `npm run db:migrate` - マイグレーション実行
- `npm run db:reset` - データベースリセットとマイグレーション実行

### データベース接続設定
- PostgreSQL接続設定:
  - ホスト: localhost
  - ポート: 5432
  - ユーザー: postgres
  - パスワード: postgres
  - データベース名: postgres
  - SSL: false（開発環境）

### マイグレーションプロセス
- Drizzle ORMのmigrateとDrizzle Kitのpushを組み合わせて使用
- マイグレーションの流れ:
  1. スキーマ定義（src/features/*/schemas/schema.ts）
  2. マイグレーションファイル生成（drizzle-kit generate）
  3. マイグレーション実行（drizzle-orm migrate）
  4. スキーマ適用（drizzle-kit push）

## アプリケーション構造

### ディレクトリ構造
```
src/
├── app/              # Next.js App Router
│   ├── api/          # APIエンドポイント
│   │   ├── auth/     # 認証API
│   │   └── todos/    # Todo API
├── db/               # DB設定
├── types/            # 型定義
├── test/             # テストヘルパー
└── features/         # 機能モジュール
    ├── auth/         # 認証
    ├── todos/        # Todo
    ├── projects/     # プロジェクト
    └── workspaces/   # ワークスペース
```

### フィーチャーモジュール
```
features/[feature]/
├── components/       # UI
├── fetchers/         # データ取得
├── handlers/         # イベント処理
├── hooks/            # Reactフック
├── schemas/          # データ定義
└── services/         # ビジネスロジック
```

## 技術的考慮事項

### パフォーマンス
- SSR/CSRの適切な使い分け
- DBクエリ最適化
- 再レンダリング防止

### スケーラビリティ
- モジュール設計
- ステートレスAPI
- 機能の独立性

### セキュリティ
- 入力検証（Zod）
- 認証・認可
- SQLインジェクション対策
- パスワードハッシュ化
- JWT管理

## テスト環境

### テスト種別
- **単体テスト**: 個別関数・メソッドのテスト（Jest）
- **統合テスト**: 複数コンポーネント・サービス間の連携テスト
- **APIテスト**: エンドポイントの動作検証（Supertest）
- **コンポーネントテスト**: UI要素の検証（React Testing Library）
- **E2Eテスト**: ユーザー操作シミュレーション（Playwright）

### Jest設定
- **jest.config.ts**: テスト設定ファイル
  - `preset: 'ts-jest'` - TypeScriptサポート
  - `testEnvironment: 'jsdom'` - DOM環境
  - `moduleNameMapper` - モジュールパスエイリアス
  - `transform` - ファイル変換設定
  - `extensionsToTreatAsEsm` - ESモジュール対応
  - `testPathIgnorePatterns` - Playwrightテスト除外

- **jest.setup.ts**: テスト環境セットアップ
  - Next.js環境のモック
    - MockRequest/MockResponse/MockHeadersクラス実装
  - TextEncoder/TextDecoderのポリフィル
  - @testing-library/jest-domの拡張

### テスト実行
```bash
# 単体・統合テスト
npm test

# テスト監視モード
npm run test:watch

# コンポーネントテスト
npm run test:components

# サービステスト
npm run test:services

# ハンドラーテスト
npm run test:handlers

# フックテスト
npm run test:hooks

# フェッチャーテスト
npm run test:fetchers

# E2Eテスト
npm run test:e2e

# E2EテストのUIモード
npm run test:e2e:ui

# E2Eテストのデバッグモード
npm run test:e2e:debug
```

## 主要依存パッケージ
- Next.js, React
- Drizzle ORM, PostgreSQL
- NextAuth, bcrypt
- Tailwind CSS, Shadcn/UI
- TypeScript, Zod
- Jest, ESLint, Playwright
- MSW, jest-mock-extended

## 開発ワークフロー

### 機能開発フロー
```mermaid
flowchart TD
    Test[テスト作成] --> Schema[スキーマ定義]
    Schema --> Service[サービス実装]
    Service --> Handler[ハンドラー実装]
    Handler --> API[APIエンドポイント]
    API --> Fetcher[フェッチャー実装]
    Fetcher --> Hook[カスタムフック]
    Hook --> Component[UIコンポーネント]
```

### テスト駆動開発
```mermaid
flowchart LR
    Red[赤: テスト失敗] --> Green[緑: テスト成功]
    Green --> Refactor[リファクタリング]
    Refactor --> Red
```

### デプロイメントフロー
```mermaid
flowchart TD
    Dev[開発] --> Test[テスト]
    Test --> Build[ビルド]
    Build --> Deploy[デプロイ]
```

## テスト環境の改善

### JSX変換エラー解決
- 問題: `SyntaxError: Unexpected token '<'`
- 原因: `"type": "module"`と`"jsx": "preserve"`の設定がJestと競合
- 解決策:
  - ts-jestの設定調整
    - useESM: true
    - tsconfig: { jsx: 'react-jsx' }
  - extensionsToTreatAsEsmで.tsと.tsxファイルをESモジュールとして扱う

### Next.js環境エラー解決
- 問題: `ReferenceError: Request is not defined`
- 原因: Next.jsのグローバルオブジェクトがテスト環境で未定義
- 解決策:
  - jest.setup.tsでNext.js環境のモック
    - MockRequest/MockResponse/MockHeadersクラス実装
  - NextRequest/NextResponseのモック実装

### TextEncoder未定義エラー解決
- 問題: `ReferenceError: TextEncoder is not defined`
- 原因: Node.jsのTextEncoderがテスト環境で未定義
- 解決策:
  - jest.setup.tsでTextEncoder/TextDecoderのポリフィル追加
  - utilモジュールからインポート

### Playwrightテストの分離
- 問題: PlaywrightテストがJestで実行される
- 原因: テストファイルの拡張子が同じ
- 解決策:
  - testPathIgnorePatternsでPlaywrightテストを除外
  - `npm run test:e2e`でPlaywrightテストを実行

### モックライブラリの導入
- 問題: 型安全なモックの作成が困難
- 原因: Jestのモック機能の制限
- 解決策:
  - jest-mock-extendedの導入
  - 型安全なモックの作成
  - AuthServiceのモック問題を解決

### MSWの導入
- 問題: APIリクエストのモックが困難
- 原因: フェッチャーのテストにおけるネットワークリクエストの扱い
- 解決策:
  - MSWの導入
  - APIリクエストのモック
  - フェッチャーのテストの改善

### テストヘルパー関数の作成
- 問題: テストコードの重複
- 原因: 共通のテスト設定の繰り返し
- 解決策:
  - src/test/helpers.tsの作成
  - createMockAuthService()
  - createMockRequest()
  - expectJsonResponse()
  - テストコードの簡素化と標準化

### NextResponseのモック簡素化
- 問題: NextResponseのモックが複雑
- 原因: NextResponseの実装の複雑さ
- 解決策:
  - jest.setup.tsでNextResponseのモック簡素化
  - @ts-expect-errorディレクティブの使用
  - モジュールのモック化（jest.mock('next/server', ...)）

## 残りの課題

### テスト環境
- NextRequest/NextResponseのモック実装の完全対応
- ハンドラーテストの構文エラー修正
- 認証関連テストのインポートエラー解消
- テスト実行スクリプトの分離と最適化

### フロントエンド
- ページタイトルの修正
- Todoリスト表示コンポーネント実装
- 認証UI実装
- Todo作成・編集フォーム実装
- ページレイアウト改善

### バックエンド
- Projects/Workspaces API実装
- リレーションシップ最適化
- エラーハンドリング改善

### セキュリティ
- パスワード強度ポリシー
- ユーザー列挙攻撃対策
- レート制限/HTTPS/CSP
