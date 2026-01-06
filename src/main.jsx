// Reactアプリのエントリーポイント
// ここからアプリが起動する
// 参考: https://react.dev/reference/react-dom/render

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';

// ReactDOM.renderでHTMLのroot要素にAppコンポーネントを表示
// StrictModeは開発時に問題を見つけるための機能
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // index.htmlの<div id="root"></div>を指定
);