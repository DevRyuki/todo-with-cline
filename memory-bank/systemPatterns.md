# システムパターン

## アーキテクチャ概要
Next.jsを使用したフルスタックアプリケーション：

```mermaid
flowchart TD
    Client[クライアント] --> NextJS[Next.js App Router]
    NextJS --> API[API Routes]
    NextJS --> Pages[ページコンポーネント]
    API --> Services[サービス層]
    Pages --> Hooks[React Hooks]
    Hooks --> Fetchers[データフェッチャー]
    Services --> DB[Drizzle ORM]
    Fetchers --> API
    DB --> Postgres[(PostgreSQL)]
```

## フィーチャーベース構造
各フィーチャーは以下を含む：
- **スキーマ**: データモデル定義
- **コンポーネント**: UI
- **フェッチャー**: データ取得ロジック
- **ハンドラー**: イベント処理
- **フック**: Reactカスタムフック
- **サービス**: ビジネスロジック
- **ミドルウェア**: リクエスト処理中間層

## データフロー
```mermaid
flowchart LR
    UI[UIコンポーネント] --> Hooks[Reactフック]
    Hooks --> Fetchers[フェッチャー]
    Fetchers --> API[APIルート]
    API --> Handlers[ハンドラー]
    Handlers --> Services[サービス]
    Services --> DB[Drizzle ORM]
    DB --> Postgres[(PostgreSQL)]
```

### フォームデータフロー
```mermaid
flowchart LR
    Form[フォームコンポーネント] --> Validation[バリデーション]
    Validation --> Hook[カスタムフック]
    Hook --> Fetcher[フェッチャー]
    Fetcher --> API[APIエンドポイント]
    API --> Handler[ハンドラー]
    Handler --> Service[サービス]
    Service --> DB[データベース]
```

## 設計パターン
- **リポジトリパターン**: DrizzleORMによるデータアクセス抽象化
- **サービス層パターン**: ビジネスロジック分離
- **フック抽象化**: UIからデータフェッチング分離
- **フィーチャーモジュール**: 機能ごとのコード整理
- **フォームコンポーネントパターン**: 再利用可能なフォーム構築
  - 制御されたコンポーネント
  - バリデーション分離
  - 送信ハンドラー抽象化
- **UIコンポーネントパターン**: Shadcn/UIによるコンポーネント構築
  - アクセシビリティ対応
  - カスタマイズ可能
  - コンポジション重視

## テスト駆動開発（TDD）
```mermaid
flowchart LR
    Red[赤: テスト失敗] --> Green[緑: テスト成功]
    Green --> Refactor[リファクタリング]
    Refactor --> Red
```

### TDDサイクル
1. **赤**: 失敗するテスト作成
2. **緑**: 最小限のコード実装
3. **リファクタリング**: 品質向上

### TDD例外
- スキーマファイル（`schema.ts`）はTDD対象外
- マイグレーションで検証

### テストファイルのESLintエラー解消
```mermaid
flowchart TD
    TestFile[テスト作成] --> TypeDef[型定義]
    TypeDef --> MockSetup[モック設定]
    MockSetup --> TypeAssertion[型アサーション]
    TypeAssertion --> TestImpl[テスト実装]
```

1. **型定義ファイル作成**
2. **適切な型アサーション**
3. **@ts-expect-errorの適切使用**
4. **tsconfig.json設定**

### テスト戦略
```mermaid
flowchart TD
    Unit[単体テスト] --> Integration[統合テスト]
    Integration --> Component[コンポーネントテスト]
    Component --> E2E[E2Eテスト]
    
    Unit --> Jest[Jest]
    Integration --> Jest
    Component --> RTL[React Testing Library]
    E2E --> Playwright[Playwright]
```

#### E2Eテスト（Playwright）
```mermaid
flowchart LR
    Setup[環境セットアップ] --> Reset[DBリセット]
    Reset --> TestData[テストデータ作成]
    TestData --> Run[テスト実行]
    Run --> Report[レポート生成]
```

1. **環境セットアップ**: グローバルセットアップでテスト環境準備
   - `tests/global-setup.ts`でテスト前の環境初期化
   - `playwright.config.ts`で設定（ブラウザ、タイムアウト、並列実行等）
   - ウェブサーバー自動起動（`npm run dev`）

2. **データベースリセット**: テスト前にDBをクリーンな状態に
   - `tests/helpers/setup-db.ts`でDB操作
   - `resetTestDatabase()`でDBリセット
   - `createTestData()`でテストデータ作成

3. **テストシナリオ**: ユーザー操作を模倣したテスト
   - 認証フロー（`tests/auth.spec.ts`）
   - Todoアプリ操作（`tests/todo-app.spec.ts`）
   - データテスト属性（`data-testid`）を使用したセレクタ

4. **テスト実行モード**:
   - 標準実行: `npm run test:e2e`
   - UI表示モード: `npm run test:e2e:ui`
   - デバッグモード: `npm run test:e2e:debug`

5. **並列実行**: 複数ブラウザでの同時テスト
   - Chromium, Firefox, WebKitでのクロスブラウザテスト
   - `fullyParallel: true`で並列実行

## 技術選定
- **Next.js App Router**: ルーティング・SSR・API統合
- **Drizzle ORM**: 型安全SQLクエリビルダー
- **Docker**: 開発環境一貫性確保
- **フィーチャーベース構造**: メンテナンス性・拡張性向上
- **Shadcn/UI**: 再利用可能なUIコンポーネント
  - Radix UIベース
  - Tailwind CSSスタイリング
  - 高いカスタマイズ性

## 認証システム（NextAuth）
```mermaid
flowchart TD
    Login[ログイン] --> NextAuth[NextAuth]
    NextAuth --> AuthService[認証サービス]
    AuthService --> DB[データベース]
    
    Reset[パスワードリセット] --> Token[トークン]
    Token --> Email[メール送信]
    
    Register[登録] --> Validate[検証]
    Validate --> Hash[ハッシュ化]
    Hash --> CreateUser[ユーザー作成]
```

- **NextAuthアダプター**: Drizzle連携
- **認証ロジック**: パスワード管理・トークン処理
- **APIルート分離**: 標準・カスタムエンドポイント
- **パスワード管理分離**: 独立テーブル使用
