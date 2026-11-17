const express = require("express");
const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.json({ app: "j9niAI", status: "online" }));

app.post("/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "Напиши сообщение." });
    if (message.length > 4000) return res.status(400).json({ error: "Сообщение слишком длинное." });
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "ИИ ещё не настроен на сервере." });

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "Ты — дружелюбный помощник j9niAI. Отвечай понятно, кратко и безопасно.",
        input: message,
        max_output_tokens: 700
      })
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("OpenAI API error:", data);
      return res.status(502).json({ error: "ИИ временно не ответил. Проверь настройки сервера." });
    }
    const answer = (data.output || []).flatMap(x => x.content || [])
      .filter(x => x.type === "output_text").map(x => x.text).join("\\n").trim();
    res.json({ answer: answer || "Попробуй ещё раз." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка сервера." });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("j9niAI server started"));
