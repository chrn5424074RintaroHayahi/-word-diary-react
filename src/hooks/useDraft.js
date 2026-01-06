// LocalStorageを使った下書き保存機能
// 参考: https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage

const DRAFT_KEY = "word-diary-draft-v1";

export const useDraft = () => {
  // 下書きを保存する関数
  const saveDraft = (wordCount, words, result) => {
    // オブジェクトにまとめる
    const payload = {
      count: Number(wordCount),
      words: words,
      result: result,
    };
    // LocalStorageに保存するにはJSON文字列に変換する必要がある
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  };

  // 下書きを読み込む関数
  const loadDraft = () => {
    // LocalStorageから取得
    const raw = localStorage.getItem(DRAFT_KEY);
    // データがなかったらnullを返す
    if (!raw) return null;

    // JSON文字列をオブジェクトに戻す
    return JSON.parse(raw);
  };

  // 下書きを削除する関数
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  return { saveDraft, loadDraft, clearDraft };
};