import { setupTestEnvironment } from './helpers/setup-db';

/**
 * Playwrightのグローバルセットアップ
 * すべてのテストの実行前に一度だけ実行される
 */
async function globalSetup() {
  console.log('グローバルセットアップを開始します...');

  // テスト環境をセットアップ
  try {
    await setupTestEnvironment();
    console.log('グローバルセットアップが完了しました');
  } catch (error) {
    console.error('グローバルセットアップ中にエラーが発生しました:', error);
    throw error;
  }
}

export default globalSetup;
