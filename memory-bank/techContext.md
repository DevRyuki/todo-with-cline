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

### 開発ツール
- **Docker**: コンテナ化された開発環境
- **ESLint**: コード品質管理
- **TypeScript**: 型チェックとコード補完
- **Jest**: JavaScript/TypeScriptテストフレームワーク
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
- Todos: タスク管理
- Projects: プロジェクト管理
- Workspaces: ワークスペース管理

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
│   └── ...           # ページコンポーネント
├── db/               # データベース設定
│   ├── index.ts      # DB接続設定
│   ├── migrate.js    # マイグレーションスクリプト
│   └── schema.ts     # スキーマ定義
└── features/         # 機能モジュール
    ├── _example/     # 例示用モジュール
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
├── hooks/            # Reactカスタムフック
├── schemas/          # データスキーマ
└── services/         # ビジネスロジック
```

## 技術的制約

### パフォーマンス考慮事項
- サーバーサイドレンダリングとクライアントサイドレンダリングの適切な使い分け
- データベースクエリの最適化

### スケーラビリティ
- マイクロサービスへの将来的な移行を考慮したモジュール設計
- 水平スケーリングを可能にするステートレスなAPI設計

### セキュリティ
- 入力バリデーション
- APIエンドポイントの適切な認証と認可
- SQLインジェクション対策（Drizzle ORMによる）

## 依存関係
主要な依存パッケージ（package.jsonより）：
- Next.js
- React
- Drizzle ORM
- TypeScript
- Tailwind CSS
- ESLint
