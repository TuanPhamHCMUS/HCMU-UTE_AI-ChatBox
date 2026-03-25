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
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
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

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Lỗi AI rồi 😢";

  res.status(200).json({ text });
}