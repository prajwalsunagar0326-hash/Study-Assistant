import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Strict Prompt definitions for Structured JSON Output
const SYSTEM_PROMPT_TRIP = `You are a world-class travel curator and logistics planner.
Given a user's travel destination, interests, pace, budget, or constraints, generate an actionable, balanced, day-by-day itinerary.

CRITICAL REQUIREMENT:
You must respond with ONLY valid, parseable JSON conforming strictly to the following schema.
Do NOT include markdown backticks like \`\`\`json, do NOT include conversational commentary, preambles, or postscripts.

JSON Schema:
{
  "destination": string,
  "tripTitle": string,
  "summary": string,
  "totalDays": number,
  "bestSeason": string,
  "estimatedBudget": string,
  "highlights": string[],
  "days": [
    {
      "dayNumber": number,
      "title": string,
      "theme": string,
      "stops": [
        {
          "id": string,
          "time": string,
          "title": string,
          "description": string,
          "category": "food" | "culture" | "sightseeing" | "adventure" | "relaxation" | "shopping" | "travel",
          "duration": string,
          "estimatedCost": string,
          "tips": string,
          "location": string
        }
      ]
    }
  ]
}

Guidelines:
- Each day should have 3 to 5 coherent, geographically proximate stops.
- Provide practical insider tips (e.g. "Book tickets online 48h prior", "Visit around golden hour").
- Ensure all category values are strictly one of: food, culture, sightseeing, adventure, relaxation, shopping, travel.`;

const SYSTEM_PROMPT_ADJUST = `You are adjusting a SINGLE day of an existing travel itinerary based on a user's specific feedback or new constraint (e.g., bad weather, vegetarian meal, lower budget, more leisure, toddler-friendly).

CRITICAL REQUIREMENT:
Return ONLY valid JSON matching this schema, with no markdown codeblocks and no conversational prose:
{
  "dayNumber": number,
  "theme": string,
  "updatedStops": [
    {
      "id": string,
      "time": string,
      "title": string,
      "description": string,
      "category": "food" | "culture" | "sightseeing" | "adventure" | "relaxation" | "shopping" | "travel",
      "duration": string,
      "estimatedCost": string,
      "tips": string,
      "location": string
    }
  ],
  "reasoningNote": string
}`;

/**
 * High-quality fallback/mock generator to ensure reviewer can test immediately
 * even if they haven't configured an external API key.
 */
function generateMockTrip(prompt: string) {
  const isJapan = /tokyo|kyoto|japan|osaka/i.test(prompt);
  const isParis = /paris|france/i.test(prompt);
  const isItaly = /italy|rome|florence|venice/i.test(prompt);

  const destination = isJapan
    ? 'Tokyo & Kyoto, Japan'
    : isParis
    ? 'Paris, France'
    : isItaly
    ? 'Rome, Italy'
    : 'Scenic Explorer Destination';

  return {
    destination,
    tripTitle: `Curated Discovery of ${destination}`,
    summary: `A carefully paced itinerary designed around "${prompt.slice(0, 60)}...", combining landmark icons, local culinary gems, and cultural depth.`,
    totalDays: 3,
    bestSeason: 'Spring or Autumn for optimal weather and vibrant scenery',
    estimatedBudget: '$$ Moderate ($90 - $140/day excluding accommodation)',
    highlights: ['Iconic Historical Landmarks', 'Authentic Local Street Markets', 'Sunset Viewpoint & Artisan Cafes'],
    days: [
      {
        dayNumber: 1,
        title: 'Historic Roots & First Flavors',
        theme: 'Heritage & Street Gastronomy',
        stops: [
          {
            id: 'mock-1-1',
            time: '09:00 AM',
            title: isJapan ? 'Asakusa Senso-ji & Nakamise-dori' : 'Historic Old Quarter Stroll',
            description: 'Wander through ancient gate paths and sample traditional street sweets.',
            category: 'culture',
            duration: '2 hours',
            estimatedCost: 'Free ($10 for treats)',
            tips: 'Arrive early before tour buses arrive to take peaceful courtyard photos.',
            location: 'Old Town District',
          },
          {
            id: 'mock-1-2',
            time: '12:00 PM',
            title: isJapan ? 'Tsukiji Market Lunch Bites' : 'Boutique Bistro Lunch',
            description: 'Savor regional specialties cooked fresh right before your eyes.',
            category: 'food',
            duration: '1.5 hours',
            estimatedCost: '$20 - $35',
            tips: 'Cash is preferred by several older, authentic family-owned stands.',
            location: 'Central Food Hub',
          },
          {
            id: 'mock-1-3',
            time: '03:00 PM',
            title: isJapan ? 'Ueno Park & National Museum' : 'Art Gallery & Garden Walk',
            description: 'Unwind in manicured public gardens and explore curated cultural collections.',
            category: 'sightseeing',
            duration: '2.5 hours',
            estimatedCost: '$12',
            tips: 'Audio guides offer great context on local art evolutions.',
            location: 'Parkside Avenue',
          },
          {
            id: 'mock-1-4',
            time: '07:00 PM',
            title: 'Twilight Skyline & Rooftop Dining',
            description: 'Cap off day one overlooking illuminated monuments and city horizons.',
            category: 'relaxation',
            duration: '2 hours',
            estimatedCost: '$40 - $65',
            tips: 'Sunset reservations are recommended 3 days ahead.',
            location: 'High-Rise Terrace',
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Modern Architecture & Hidden Alleyways',
        theme: 'Urban Energy & Artisan Boutiques',
        stops: [
          {
            id: 'mock-2-1',
            time: '09:30 AM',
            title: 'Specialty Coffee & Roastery Experience',
            description: 'Start the morning with single-origin beans in an architecturally stunning space.',
            category: 'food',
            duration: '1 hour',
            estimatedCost: '$8',
            tips: 'Try the signature seasonal pour-over.',
            location: 'Creative District',
          },
          {
            id: 'mock-2-2',
            time: '11:00 AM',
            title: 'Contemporary Design Hub & Galleries',
            description: 'Explore interactive digital exhibits and local fashion studios.',
            category: 'culture',
            duration: '2.5 hours',
            estimatedCost: '$18',
            tips: 'Interactive exhibits frequently have 10-minute queue intervals.',
            location: 'Design Corridor',
          },
          {
            id: 'mock-2-3',
            time: '03:00 PM',
            title: 'Canal Promenade & Vintage Hunting',
            description: 'Stroll cobblestone or river paths dotted with independent craft shops.',
            category: 'shopping',
            duration: '2 hours',
            estimatedCost: 'Free to browse',
            tips: 'Look for handmade ceramics and local textiles.',
            location: 'Riverside Walk',
          },
          {
            id: 'mock-2-4',
            time: '07:30 PM',
            title: 'Hidden Lantern-lit Tavern Dinner',
            description: 'Cozy, authentic dinner with seasonal shared plates and local drinks.',
            category: 'food',
            duration: '2.5 hours',
            estimatedCost: '$30 - $50',
            tips: 'Ask the host for the daily chef special board.',
            location: 'Back-Alley District',
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Serene Nature & Panoramic Farewell',
        theme: 'Scenic Escapes & Signature Souvenirs',
        stops: [
          {
            id: 'mock-3-1',
            time: '08:30 AM',
            title: 'Botanical Sanctuary & Morning Reflection',
            description: 'Breathe crisp morning air surrounded by ancient trees and koi ponds.',
            category: 'relaxation',
            duration: '2 hours',
            estimatedCost: '$5',
            tips: 'The northern pavilion has the most tranquil seating areas.',
            location: 'Historic Sanctuary Grounds',
          },
          {
            id: 'mock-3-2',
            time: '12:00 PM',
            title: 'Farm-to-Table Fare by the Waterfront',
            description: 'Organic local ingredients paired with artisan sourdough and regional cheese.',
            category: 'food',
            duration: '1.5 hours',
            estimatedCost: '$25 - $40',
            tips: 'Outdoor deck tables have beautiful harbor/water views.',
            location: 'Waterside Quarter',
          },
          {
            id: 'mock-3-3',
            time: '03:30 PM',
            title: 'Panoramic Hilltop Observation Deck',
            description: 'Take in 360-degree views of the entire metro area and surrounding peaks.',
            category: 'sightseeing',
            duration: '2 hours',
            estimatedCost: '$22',
            tips: 'Bring a camera with optical zoom for mountain silhouettes.',
            location: 'Apex Tower',
          },
        ],
      },
    ],
  };
}

/**
 * Calls LLM provider (Gemini, Groq, or OpenAI)
 */
async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Google Gemini (Free tier available)
  if (geminiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Request: ${userPrompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini returned an empty candidate text.');
    }
    return candidateText;
  }

  // 2. Groq (Free fast inference)
  if (groqKey) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.6,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Groq returned empty completion text.');
    return text;
  }

  // 3. OpenAI
  if (openaiKey) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenAI returned empty completion content.');
    return text;
  }

  // Fallback Mock Mode: when no API key is configured, return realistic structured JSON
  // so `npm install && npm start` works seamlessly out of the box!
  console.log('[Notice] No API key detected in .env. Operating in high-fidelity mock mode.');
  await new Promise((r) => setTimeout(r, 1200)); // simulate realistic API latency
  return JSON.stringify(generateMockTrip(userPrompt));
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY
  );
  res.json({
    status: 'ok',
    mode: hasKey ? 'live-llm' : 'mock-fallback',
    message: hasKey
      ? 'Connected to configured LLM API provider.'
      : 'Running in mock mode. Add GEMINI_API_KEY or GROQ_API_KEY to .env to use live LLMs.',
  });
});

// Endpoint: Generate Full Itinerary
app.post('/api/generate', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required and must be non-empty text.' });
  }

  // Testing / interview demonstration hooks
  if (prompt.toLowerCase().includes('__test_error_500__')) {
    return res.status(500).json({ error: 'Simulated 500 server error for interview testing.' });
  }
  if (prompt.toLowerCase().includes('__test_malformed__')) {
    return res.json({ data: '{ "destination": "Malformed City", "tripTitle": ' }); // unclosed JSON
  }
  if (prompt.toLowerCase().includes('__test_wrong_shape__')) {
    return res.json({ data: { randomKey: 'unexpected shape', numbers: [1, 2, 3] } });
  }

  try {
    const rawResult = await callLLM(SYSTEM_PROMPT_TRIP, prompt.trim());
    return res.json({ data: rawResult });
  } catch (err: unknown) {
    console.error('Error generating trip itinerary:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal Server Error calling LLM',
    });
  }
});

// Endpoint: Adjust Single Day (Patch Refinement)
app.post('/api/adjust-day', async (req: Request, res: Response) => {
  const { destination, dayNumber, currentDayTitle, currentTheme, currentStops, instruction } = req.body;

  if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
    return res.status(400).json({ error: 'Adjustment instruction is required.' });
  }

  const userContext = `
Destination: ${destination || 'Destination'}
Day Number: ${dayNumber}
Current Title: ${currentDayTitle}
Current Theme: ${currentTheme}
Current Stops: ${JSON.stringify(currentStops || [])}

User Adjustment Request: "${instruction.trim()}"
Please update the stops for Day ${dayNumber} to fulfill this request. Maintain realistic timing, categories, and practical details.
`;

  try {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY
    );

    if (!hasKey) {
      // Mock adjustment
      await new Promise((r) => setTimeout(r, 900));
      const stops = Array.isArray(currentStops) ? currentStops : [];
      const updatedStops = stops.map((s: any, idx: number) => ({
        ...s,
        title: idx === 1 ? `Adjusted: ${s.title} (Tailored for "${instruction.slice(0, 30)}")` : s.title,
        tips: `Special adjustment made: ${instruction}`,
      }));

      return res.json({
        data: {
          dayNumber,
          theme: `Tailored: ${instruction.slice(0, 35)}`,
          updatedStops,
          reasoningNote: `Modified Day ${dayNumber} to accommodate "${instruction}"`,
        },
      });
    }

    const rawResult = await callLLM(SYSTEM_PROMPT_ADJUST, userContext);
    return res.json({ data: rawResult });
  } catch (err: unknown) {
    console.error('Error adjusting day plan:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to adjust day itinerary.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Backend Proxy] Running on http://localhost:${PORT}`);
});
