// Reactを使って単語日記アプリを作成
// 参考: https://react.dev/learn

import React, { useState, useEffect } from 'react';
import './App.css';
import WordInput from './components/WordInput';
import DiaryResult from './components/DiaryResult';
import { useDraft } from './hooks/useDraft';
import useSpeech from './hooks/useSpeech';
import { generateDiary } from './utils/api';

const App = () => {
  // 状態管理（useState）
  // 参考: https://react.dev/reference/react/useState
  const [wordCount, setWordCount] = useState(3); // 単語の数（3, 5, 7から選択）
  const [words, setWords] = useState(['', '', '']); // 入力された単語の配列
  const [result, setResult] = useState(''); // 生成された日記
  const [status, setStatus] = useState(''); // ステータスメッセージ
  const [isGenerating, setIsGenerating] = useState(false); // 生成中かどうか

  // カスタムフックを使用（自分で作ったフック）
  const { saveDraft, loadDraft, clearDraft } = useDraft();
  const { speak, stop, isSpeaking } = useSpeech();

  // 単語数が変わった時に配列をリセット
  // useEffectは値が変わった時に実行される
  // 参考: https://react.dev/reference/react/useEffect
  useEffect(() => {
    // Array.fill()で指定した数だけ空文字列の配列を作る
    setWords(Array(wordCount).fill(''));
  }, [wordCount]); // wordCountが変わった時だけ実行

  // 単語の入力が変わった時の処理
  const handleWordChange = (index, value) => {
    // スプレッド演算子で配列をコピー（Reactのルール）
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  // 単語数のセレクトボックスが変わった時
  const handleWordCountChange = (e) => {
    const count = Number(e.target.value);
    setWordCount(count);
    setStatus(''); // ステータスをクリア
  };

  // 「日記を作る」ボタンを押した時の処理
  const handleGenerate = async () => {
    // 空でない単語だけをフィルター
    const filledWords = words.filter(w => w.trim().length > 0);
    
    // 単語が足りない場合
    if (filledWords.length !== wordCount) {
      setStatus(`単語を${wordCount}個すべて入力して。`);
      return;
    }

    // 生成中フラグをオン
    setIsGenerating(true);
    setStatus('生成中...');

    // try-catchでエラー処理
    // 参考: MDNのエラーハンドリング
    try {
      // awaitで非同期処理を待つ
      const text = await generateDiary(filledWords);
      setResult(text);
      
      // 結果によってメッセージを変える
      if (text.trim().length === 0) {
        setStatus('生成は成功したが、本文が空。');
      } else {
        setStatus('生成完了。');
      }
    } catch (error) {
      console.log('エラーが発生:', error);
      setStatus('生成でエラー（Functions未起動／ネットワーク）。');
    } finally {
      // 成功でも失敗でも最後に実行される
      setIsGenerating(false);
    }
  };

  // コピーボタンを押した時
  // Clipboard APIを使用
  // 参考: https://developer.mozilla.org/ja/docs/Web/API/Clipboard_API
  const handleCopy = async () => {
    const text = result.trim();
    if (!text) return; // テキストがない場合は何もしない
    
    try {
      // クリップボードにコピー
      await navigator.clipboard.writeText(text);
      setStatus('コピーした。');
    } catch {
      setStatus('コピーに失敗した。');
    }
  };

  // 読み上げボタンを押した時
  const handleSpeak = () => {
    const text = result.trim();
    if (!text) return;
    
    speak(text); // useSpeechフックの関数を使用
    setStatus('読み上げ中...');
  };

  // 停止ボタンを押した時
  const handleStop = () => {
    stop();
    setStatus('読み上げを停止した。');
  };

  // 下書き保存ボタンを押した時
  const handleSaveDraft = () => {
    saveDraft(wordCount, words, result);
    setStatus('下書きを保存した。');
  };

  // 下書き読み込みボタンを押した時
  const handleLoadDraft = () => {
    const draft = loadDraft();
    
    // 下書きがない場合
    if (!draft) {
      setStatus('下書きがない。');
      return;
    }

    // 下書きから値を復元
    const count = Number(draft.count);
    if (count === 3 || count === 5 || count === 7) {
      setWordCount(count);
    }
    
    // 配列かチェックしてから設定
    if (Array.isArray(draft.words)) {
      setWords(draft.words);
    } else {
      setWords(Array(count).fill(''));
    }
    
    // 文字列かチェックしてから設定
    if (typeof draft.result === 'string') {
      setResult(draft.result);
    } else {
      setResult('');
    }
    
    setStatus('下書きを復元した。');
  };

  // 下書き削除ボタンを押した時
  const handleClearDraft = () => {
    clearDraft();
    setStatus('下書きを削除した。');
  };

  // ボタンの有効/無効を判定
  const hasText = result.trim().length > 0;
  const canCopy = hasText && navigator.clipboard; // Clipboard APIが使えるか
  const canSpeak = hasText && ('speechSynthesis' in window); // Speech Synthesis APIが使えるか

  // JSXで画面を構築
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

          {/* map()で単語入力欄を繰り返し表示 */}
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