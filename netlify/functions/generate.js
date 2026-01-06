// Netlify Functionsを使ったサーバーサイド処理
// 参考: https://docs.netlify.com/functions/overview/
// OpenAI APIドキュメント: https://platform.openai.com/docs/api-reference

const fetch = require('node-fetch');

// エクスポートする関数（Netlify Functionsの形式）
exports.handler = async (event) => {
  // POSTメソッドかチェック
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // 環境変数からAPIキーを取得
  const apiKey = process.env.OPENAI_API_KEY;
  
  // APIキーがない場合はエラー
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'OPENAI_API_KEY is missing',
        detail: 'Please set OPENAI_API_KEY in your .env file'
      }),
    };
  }

  try {
    // リクエストボディから単語を取得
    const { words } = JSON.parse(event.body);

    // 単語が配列かつ空でないかチェック
    if (!Array.isArray(words) || words.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input: words must be a non-empty array.' }),
      };
    }

    // OpenAI APIに送るプロンプトを作成
    const prompt = `以下の${words.length}個の単語を使って、自然な日本語の日記を書いてください。
単語: ${words.join('、')}

日記:`;

    // OpenAI APIにリクエストを送信
    // fetch()で非同期通信
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '指定された単語を自然に使った日本語の日記を書くアシスタントです。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    // レスポンスをJSON形式で取得
    const data = await response.json();

    // エラーの場合
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: data.error?.message || 'OpenAI API request failed',
          detail: data.error?.type || ''
        }),
      };
    }

    // 生成されたテキストを取り出す
    // choices[0].message.contentに入っている
    let text = '';
    if (data.choices && data.choices[0] && data.choices[0].message) {
      text = data.choices[0].message.content.trim();
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate diary entry.',
        detail: error.message 
      }),
    };
  }
};