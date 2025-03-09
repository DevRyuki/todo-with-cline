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
