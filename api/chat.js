export default async function handler(req, res) {
  try {
    const { history, message } = req.body;

    const contents = [
      ...(history || []).map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
        }),
      }
    );

    const data = await response.json();

    // 🔥 LOG RA ĐỂ BIẾT LỖI THẬT
    console.log("STATUS:", response.status);
    console.log("DATA:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(500).json({
        text: "API lỗi",
        error: data,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      text: text || "AI không trả lời 😢",
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      text: "Server crash 😢",
      error: err.message,
    });
  }
}