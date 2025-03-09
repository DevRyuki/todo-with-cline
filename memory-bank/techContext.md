# 技術コンテキスト

## 技術スタック

### フロントエンド
- **Next.js**: Reactフレームワーク（App Router使用）
- **React**: UIライブラリ
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- **TypeScript**: 静的型付け言語

### バックエンド
- **Next.js API Routes**: サーバーサイドAPI実装
- **Drizzle ORM**: TypeScript用SQLクエリビルダー
- **PostgreSQL**: リレーショナルデータベース
- **NextAuth.js**: 認証システム
- **Resend**: メール送信サービス
- **bcrypt**: パスワードハッシュ化
- **Zod**: スキーマバリデーション

### 開発ツール
- **Docker**: コンテナ化された開発環境
- **ESLint**: コード品質管理
- **TypeScript**: 型チェックとコード補完
- **Jest**: JavaScript/TypeScriptテストフレームワーク
- **ts-jest**: TypeScriptのJestサポート
- **@jest/globals**: Jestのグローバル関数と型定義
- **React Testing Library**: Reactコンポーネントのテスト
- **Supertest**: APIエンドポイントのテスト

## 開発環境セットアップ

### 必要条件
- Node.js
- Docker と Docker Compose
- npm または yarn

### 環境変数
`.env.local`ファイルに以下の環境変数を設定：
- データベース接続情報
- アプリケーション設定
- NextAuth設定
  - `NEXTAUTH_URL`: アプリケーションのURL
  - `NEXTAUTH_SECRET`: セッション暗号化用のシークレットキー
- Resend設定
  - `RESEND_API_KEY`: Resend APIキー
  - `NEXT_PUBLIC_APP_URL`: アプリケーションの公開URL

### 開発サーバー起動
```bash
# 依存関係のインストール
npm install

# データベースコンテナの起動
docker-compose up -d

# マイグレーションの実行
npm run db:migrate

# 開発サーバーの起動
npm run dev
```

## データベース

### スキーマ
主要なデータモデル：
- **Todos**: タスク管理
  - id, title, description, completed, userId, projectId, createdAt, updatedAt
- **Projects**: プロジェクト管理
  - id, name, description, userId, workspaceId, createdAt, updatedAt
- **Workspaces**: ワークスペース管理
  - id, name, description, userId, createdAt, updatedAt
- **Users**: ユーザー管理（NextAuth）
  - id, name, email, emailVerified, image
- **Accounts**: OAuth連携アカウント（NextAuth）
  - userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
- **Sessions**: ユーザーセッション（NextAuth）
  - sessionToken, userId, expires
- **VerificationTokens**: メール検証トークン（NextAuth）
  - identifier, token, expires
- **Passwords**: パスワード管理（カスタム）
  - userId, hash, updatedAt

### マイグレーション
Drizzle ORMを使用したマイグレーション管理：
- `npm run db:generate` - マイグレーションファイルの生成
- `npm run db:migrate` - マイグレーションの実行

## アプリケーション構造

### ディレクトリ構造
```
src/
├── app/              # Next.js App Router
│   ├── api/          # APIエンドポイント
│   │   ├── auth/     # 認証関連API
│   │   │   ├── [...nextauth]/    # NextAuth設定
│   │   │   ├── register/         # ユーザー登録
│   │   │   ├── forgot-password/  # パスワードリセットリクエスト
│   │   │   └── reset-password/   # パスワードリセット
│   │   └── todos/    # Todo関連API
│   │       ├── route.ts          # Todoリスト操作
│   │       └── [id]/route.ts     # 個別Todo操作
│   └── ...           # ページコンポーネント
├── db/               # データベース設定
│   ├── index.ts      # DB接続設定
│   ├── migrate.js    # マイグレーションスクリプト
│   ├── reset.js      # DB初期化スクリプト
│   └── schema.ts     # スキーマ定義
├── types/            # 型定義
│   ├── next-auth.d.ts # NextAuth型拡張
│   └── jest.d.ts     # Jest型定義
└── features/         # 機能モジュール
    ├── _example/     # 例示用モジュール
    ├── auth/         # 認証機能
    │   ├── handlers/       # 認証ハンドラー
    │   ├── schemas/        # 認証スキーマ
    │   └── services/       # 認証サービス
    ├── todos/        # Todoタスク機能
    ├── projects/     # プロジェクト機能
    └── workspaces/   # ワークスペース機能
```

### フィーチャーモジュール構造
各機能モジュールは以下のコンポーネントを含む：
```
features/[feature]/
├── components/       # UIコンポーネント
├── fetchers/         # データフェッチングロジック
├── handlers/         # イベント処理ロジック
│   └── __tests__/    # ハンドラーのテスト
├── hooks/            # Reactカスタムフック
├── schemas/          # データスキーマ
└── services/         # ビジネスロジック
    └── __tests__/    # サービスのテスト
```

## 技術的制約

### パフォーマンス考慮事項
- サーバーサイドレンダリングとクライアントサイドレンダリングの適切な使い分け
- データベースクエリの最適化
- 不必要な再レンダリングの防止

### スケーラビリティ
- マイクロサービスへの将来的な移行を考慮したモジュール設計
- 水平スケーリングを可能にするステートレスなAPI設計
- フィーチャーベースの構造による機能の独立性確保

### セキュリティ
- 入力バリデーション（Zodによるスキーマ検証）
- APIエンドポイントの適切な認証と認可
- SQLインジェクション対策（Drizzle ORMによる）
- パスワードの安全なハッシュ化（bcryptによる）
- JWTを使用したセッション管理

## 依存関係
主要な依存パッケージ（package.jsonより）：
- **フレームワーク**: Next.js, React
- **データベース**: Drizzle ORM, PostgreSQL
- **認証**: NextAuth.js, @auth/drizzle-adapter, bcrypt
- **スタイリング**: Tailwind CSS
- **型システム**: TypeScript
- **バリデーション**: Zod
- **メール送信**: Resend
- **テスト**: Jest, ts-jest, @jest/globals
- **開発ツール**: ESLint, Docker
