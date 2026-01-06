// Fetch APIを使ったサーバーとの通信
// 参考: https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch

const API_URL = "/.netlify/functions/generate";

export const generateDiary = async (words) => {
  try {
    // サーバーにPOSTリクエストを送る
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ words }), // 単語の配列をJSON形式で送信
    });

    // レスポンスがJSON形式かチェック
    const contentType = response.headers.get("content-type") || "";
    let data;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // JSON以外の場合はテキストとして読み取る
      data = { error: await response.text() };
    }

    // エラーの場合
    if (!response.ok) {
      let errorMessage = "エラーが発生しました";
      if (data.error) {
        errorMessage = data.error;
      }
      if (data.detail) {
        errorMessage = errorMessage + " (" + data.detail + ")";
      }
      throw new Error(errorMessage);
    }

    // 成功した場合、生成されたテキストを返す
    if (data.text) {
      return data.text;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error generating diary:", error);
    throw error;
  }
};