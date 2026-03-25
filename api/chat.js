export default async function handler(req, res) {
  const { history, message } = req.body;

  const contents = [
    ...history.map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        },
      }),
    }
  );

  const data = await response.json();

  // DEBUG LOG (cực kỳ quan trọng)
  console.log("Gemini response:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    return res.status(500).json({
      text: "API lỗi",
      error: data,
    });
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  res.status(200).json({
    text: text || "AI không trả về nội dung 😢",
  });
}