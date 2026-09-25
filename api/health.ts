export default function handler(_req: any, res: any) {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  return res.status(200).json({
    status: 'ok',
    app: 'StudyAI',
    mode: hasKey ? 'live-llm' : 'missing-key',
    model: 'gemini-3.5-flash-lite',
    deployment: 'vercel-serverless',
    message: hasKey
      ? 'Connected to Gemini API in Vercel environment.'
      : 'GEMINI_API_KEY environment variable is not configured in Vercel.',
  });
}
