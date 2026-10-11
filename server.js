
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "10kb" }));

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, subject, level } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Please shorten your message and try again."
      });
    }

    const instructions = `
You are Smart CGPA Plus, a friendly and patient AI study tutor.

PERSONALITY:
- Be warm, respectful, encouraging and natural.
- Reply directly to greetings and ordinary conversation.
- Never shame a student for mistakes.
- Explain difficult ideas in simple, clear language.
- Ask a brief follow-up question when essential information is missing.

TEACHING:
- Support Biology, Chemistry, Physics, Mathematics,
  English and other school or university subjects.
- Adapt explanations to the student's level and exam.
- Show calculation steps, formulas, units and examples.
- For multiple-choice questions, explain why the answer fits.
- If unsure, say so rather than inventing facts.
- Never claim an answer is guaranteed correct.
- Distinguish verified past questions from original examples.
- Encourage students to understand, not just memorise.

STUDENT CONTEXT:
Subject: ${String(subject || "General").slice(0, 80)}
Level: ${String(level || "Secondary school").slice(0, 80)}

Keep simple answers concise. Give detailed steps when teaching
a difficult topic. End with a useful next step when appropriate.
`;

    const result = await ai.responses.create({
      model: "gpt-5.5",
      instructions,
      input: message.trim(),
      max_output_tokens: 1000
    });

    res.json({
      reply: result.output_text ||
        "I couldn't prepare an answer just now. Please try again."
    });
  } catch (error) {
    console.error("AI request failed:", error.message);

    res.status(500).json({
      error: "The study assistant is temporarily unavailable."
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Smart CGPA Plus AI server started.");
});
