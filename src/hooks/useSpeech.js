// Speech Synthesis APIを使った音声読み上げ機能
// 参考: https://developer.mozilla.org/ja/docs/Web/API/SpeechSynthesis
import { useState } from 'react';

const useSpeech = () => {
  // 読み上げ中かどうかの状態
  const [isSpeaking, setIsSpeaking] = useState(false);

  // テキストを読み上げる関数
  const speak = (text) => {
    // ブラウザが対応しているか確認
    if (!("speechSynthesis" in window)) {
      console.log("このブラウザは音声読み上げに対応していません");
      return;
    }

    // 既に読み上げ中の場合は停止
    window.speechSynthesis.cancel();

    // 読み上げる内容を設定
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP"; // 日本語に設定

    // 読み上げ開始時の処理
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    // 読み上げ終了時の処理
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    // エラー時の処理
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    // 読み上げを開始
    window.speechSynthesis.speak(utterance);
  };

  // 読み上げを停止する関数
  const stop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, stop, isSpeaking };
};

export default useSpeech;