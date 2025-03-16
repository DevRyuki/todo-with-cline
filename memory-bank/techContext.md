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
- `npm run db:generate` - 生成
- `npm run db:migrate` - 実行

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
- **jest.config.js**: テスト設定ファイル
  - `preset: 'ts-jest'` - TypeScriptサポート
  - `testEnvironment: 'jsdom'` - DOM環境
  - `moduleNameMapper` - モジュールパスエイリアス
  - `transform` - ファイル変換設定
  - `extensionsToTreatAsEsm` - ESモジュール対応
  - `projects` - テスト実行プロジェクト分割

- **jest.setup.js**: テスト環境セットアップ
  - Next.js環境のモック
  - グローバルオブジェクトの設定
  - Next.jsコンポーネントのモック

- **setupTests.js/cjs**: テスト環境追加設定
  - jest-dom拡張
  - グローバルモック設定
  - React 18対応

### テスト実行
```bash
# 単体・統合テスト
npm test

# テスト監視モード
npm run test:watch

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

## 現在のテスト環境の課題

### JSX変換エラー
- 問題: `SyntaxError: Unexpected token '<'`
- 原因: `"type": "module"`と`"jsx": "preserve"`の設定がJestと競合
- 対策検討中:
  - ts-jestの設定調整
  - babel-jestへの移行検討

### モジュールパスエラー
- 問題: `Could not locate module @/features/auth/schemas/password.schema`
- 原因: `@/`エイリアスの解決設定が不完全
- 対策検討中:
  - moduleNameMapperの設定見直し
  - パスマッピング設定の調整

### setupTests.js と setupTests.cjs の重複
- 問題: 同様の設定が2つのファイルに存在
- 原因: ESモジュールとCommonJSの混在
- 対策検討中:
  - ファイルの統合
  - 設定の一元化
