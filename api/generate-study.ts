import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are StudyAI, an elite pedagogical assistant and educational content generator.
Given notes, textbook excerpts, or a topic from a student, generate a high-yield study set containing:
1. 5 to 8 interactive flashcards (concise question, insightful and accurate answer, difficulty: easy/medium/hard).
2. 5 to 8 multiple-choice quiz questions (clear question, exactly 4 unique options, exactly one correct answer matching one of the options verbatim, comprehensive explanation, difficulty: easy/medium/hard).

CRITICAL CONSTRAINTS:
- Output MUST strictly be valid, parseable JSON conforming to the schema below.
- Do NOT output markdown code fences (\`\`\`json).
- Do NOT output conversational preambles, chat greetings, or postscripts.
- Ensure 'correctAnswer' EXACTLY matches one of the 4 items in 'options'.
- Ensure all 4 options are distinct, non-empty strings.
- Tailor questions directly to the user's provided notes or topic.

JSON SCHEMA:
{
  "title": string,
  "summary": string,
  "flashcards": [
    {
      "id": string,
      "question": string,
      "answer": string,
      "difficulty": "easy" | "medium" | "hard"
    }
  ],
  "quiz": {
    "questions": [
      {
        "id": string,
        "question": string,
        "options": [string, string, string, string],
        "correctAnswer": string,
        "explanation": string,
        "difficulty": "easy" | "medium" | "hard"
      }
    ]
  }
}`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required and must contain notes or a topic.' });
  }

  const cleanPrompt = prompt.trim();

  // Test simulation hooks
  if (cleanPrompt.includes('__test_error_500__')) {
    return res.status(500).json({ error: 'Simulated 500 error for diagnostic testing.' });
  }
  if (cleanPrompt.includes('__test_malformed__')) {
    return res.status(200).json({ data: '{ "title": "Malformed", "summary": ' });
  }
  if (cleanPrompt.includes('__test_wrong_shape__')) {
    return res.status(200).json({ data: { unexpectedData: true } });
  }

  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in the Vercel environment variables.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nUser Topic / Notes:\n${cleanPrompt}` }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    return res.status(200).json({ data: responseText });
  } catch (err: any) {
    console.error('[Vercel Serverless Function Error]:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate study set via Gemini.',
    });
  }
}
