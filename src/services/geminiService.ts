import { Message } from "../types";

export async function sendMessage(history: Message[], message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      history,
      message,
    }),
  });

  const data = await res.json();
  return data.text;
}