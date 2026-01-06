const API_URL = "/.netlify/functions/generate";

export const generateDiary = async (words) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ words }),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { error: await response.text() };

    if (!response.ok) {
      const msg = data?.error ? String(data.error) : "unknown";
      const detail = data?.detail ? String(data.detail) : "";
      throw new Error(detail ? `${msg} / ${detail}` : msg);
    }

    return typeof data.text === "string" ? data.text : "";
  } catch (error) {
    console.error("Error generating diary:", error);
    throw error;
  }
};