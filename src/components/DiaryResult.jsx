// 日記表示コンポーネント
// 生成されたテキストをtextareaで表示
import React from 'react';

const DiaryResult = ({ result, setResult }) => {
  return (
    <>
      <label className="muted small">生成結果</label>
      <textarea
        value={result}
        onChange={(e) => setResult(e.target.value)}
        rows="10"
        placeholder="ここに日記が出ます"
      />
    </>
  );
};

export default DiaryResult;