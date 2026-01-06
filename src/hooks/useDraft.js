const DRAFT_KEY = "word-diary-draft-v1";

export const useDraft = () => {
  const saveDraft = (wordCount, words, result) => {
    const payload = {
      count: Number(wordCount),
      words: words,
      result: result,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  };

  const loadDraft = () => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;

    return JSON.parse(raw);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  return { saveDraft, loadDraft, clearDraft };
};