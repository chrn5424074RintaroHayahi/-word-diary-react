import React, { useState, useEffect } from 'react';
import './App.css';
import WordInput from './components/WordInput';
import DiaryResult from './components/DiaryResult';
import { useDraft } from './hooks/useDraft';
import useSpeech from './hooks/useSpeech';
import { generateDiary } from './utils/api';

const App = () => {
  const [wordCount, setWordCount] = useState(3);
  const [words, setWords] = useState(['', '', '']);
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { saveDraft, loadDraft, clearDraft } = useDraft();
  const { speak, stop, isSpeaking } = useSpeech();

  useEffect(() => {
    setWords(Array(wordCount).fill(''));
  }, [wordCount]);

  const handleWordChange = (index, value) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleWordCountChange = (e) => {
    const count = Number(e.target.value);
    setWordCount(count);
    setStatus('');
  };

  const handleGenerate = async () => {
    const filledWords = words.filter(w => w.trim().length > 0);
    
    if (filledWords.length !== wordCount) {
      setStatus(`単語を${wordCount}個すべて入力して。`);
      return;
    }

    setIsGenerating(true);
    setStatus('生成中...');

    try {
      const text = await generateDiary(filledWords);
      setResult(text);
      setStatus(text.trim().length === 0 ? '生成は成功したが、本文が空。' : '生成完了。');
    } catch (error) {
      setStatus('生成でエラー（Functions未起動／ネットワーク）。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    const text = result.trim();
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setStatus('コピーした。');
    } catch {
      setStatus('コピーに失敗した。');
    }
  };

  const handleSpeak = () => {
    const text = result.trim();
    if (!text) return;
    
    speak(text);
    setStatus('読み上げ中...');
  };

  const handleStop = () => {
    stop();
    setStatus('読み上げを停止した。');
  };

  const handleSaveDraft = () => {
    saveDraft(wordCount, words, result);
    setStatus('下書きを保存した。');
  };

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (!draft) {
      setStatus('下書きがない。');
      return;
    }

    const count = Number(draft.count);
    if (count === 3 || count === 5 || count === 7) {
      setWordCount(count);
    }
    
    setWords(Array.isArray(draft.words) ? draft.words : Array(count).fill(''));
    setResult(typeof draft.result === 'string' ? draft.result : '');
    setStatus('下書きを復元した。');
  };

  const handleClearDraft = () => {
    clearDraft();
    setStatus('下書きを削除した。');
  };

  const hasText = result.trim().length > 0;
  const canCopy = hasText && navigator.clipboard;
  const canSpeak = hasText && ('speechSynthesis' in window);

  return (
    <div className="app">
      <header className="wrap">
        <h1>単語日記</h1>
        <p className="muted">単語を 3 / 5 / 7 個入れて日記を書く</p>
      </header>

      <main className="wrap grid">
        <section className="card">
          <h2>1) 単語数を選ぶ</h2>

          <div className="row">
            <label className="muted small">単語数</label>
            <select value={wordCount} onChange={handleWordCountChange}>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </select>

            <button onClick={handleSaveDraft} className="secondary">下書き保存</button>
            <button onClick={handleLoadDraft} className="secondary">下書き復元</button>
            <button onClick={handleClearDraft} className="secondary">下書き削除</button>
          </div>

          <div className="words">
            {words.map((word, index) => (
              <WordInput
                key={index}
                index={index}
                value={word}
                onChange={handleWordChange}
              />
            ))}
          </div>

          <div className="row">
            <button onClick={handleGenerate} disabled={isGenerating}>
              日記を作る
            </button>
            <button onClick={handleCopy} className="secondary" disabled={!canCopy}>
              コピー
            </button>
            <button onClick={handleSpeak} className="secondary" disabled={!canSpeak}>
              読み上げ
            </button>
            <button onClick={handleStop} className="secondary" disabled={!isSpeaking}>
              停止
            </button>
          </div>

          <DiaryResult result={result} setResult={setResult} />

          <p className="muted small">{status}</p>
        </section>
      </main>
    </div>
  );
};

export default App;