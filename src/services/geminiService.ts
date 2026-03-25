import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function sendMessage(history: Message[], message: string) {
  const model = "gemini-3-flash-preview";
  
  const contents = [
    ...history.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    })),
    {
      role: "user" as const,
      parts: [{ text: message }]
    }
  ];

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
  });

  return response.text || "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn.";
}
