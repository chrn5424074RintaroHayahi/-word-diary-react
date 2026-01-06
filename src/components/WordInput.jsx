// 単語入力コンポーネント
// propsで親コンポーネントからデータを受け取る
import React from 'react';

const WordInput = ({ index, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={`単語${index + 1}`}
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
    />
  );
};

export default WordInput;