import { TripPlan, DayPlan, Stop, DayAdjustmentPatch, ApiError, StopCategory } from '../types/result';

/**
 * Strips potential markdown code blocks or wrapper text (e.g. ```json ... ```)
 * that LLMs commonly wrap around valid JSON.
 */
export function cleanRawJson(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let cleaned = raw.trim();

  // Strip markdown code fence if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }

  // Find opening and closing brackets if there is surrounding commentary
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

const VALID_CATEGORIES: StopCategory[] = [
  'food',
  'culture',
  'sightseeing',
  'adventure',
  'relaxation',
  'shopping',
  'travel',
];

function sanitizeCategory(cat: unknown): StopCategory {
  if (typeof cat === 'string') {
    const lower = cat.toLowerCase() as StopCategory;
    if (VALID_CATEGORIES.includes(lower)) return lower;
  }
  return 'sightseeing';
}

function validateAndSanitizeStop(rawStop: unknown, index: number, dayNumber: number): Stop | null {
  if (!rawStop || typeof rawStop !== 'object') return null;

  const s = rawStop as Record<string, unknown>;

  if (typeof s.title !== 'string' || !s.title.trim()) return null;

  return {
    id: typeof s.id === 'string' && s.id ? s.id : `stop-d${dayNumber}-${index}-${Date.now().toString(36)}`,
    time: typeof s.time === 'string' && s.time.trim() ? s.time.trim() : 'Flexible Time',
    title: s.title.trim(),
    description: typeof s.description === 'string' && s.description.trim() ? s.description.trim() : 'No details provided.',
    category: sanitizeCategory(s.category),
    duration: typeof s.duration === 'string' && s.duration.trim() ? s.duration.trim() : '1 - 2 hrs',
    estimatedCost: typeof s.estimatedCost === 'string' && s.estimatedCost.trim() ? s.estimatedCost.trim() : 'Free / Varies',
    tips: typeof s.tips === 'string' ? s.tips.trim() : undefined,
    location: typeof s.location === 'string' ? s.location.trim() : undefined,
  };
}

/**
 * Parses and strictly validates raw response string or object into a verified TripPlan.
 * Returns either { success: true, data: TripPlan } or { success: false, error: ApiError }
 */
export function validateTripPlan(raw: string | unknown): { success: true; data: TripPlan } | { success: false; error: ApiError } {
  if (!raw) {
    return {
      success: false,
      error: {
        type: 'EMPTY_RESPONSE',
        message: 'The model returned an empty response. Please try rephrasing your request.',
      },
    };
  }

  let parsed: unknown;
  if (typeof raw === 'string') {
    const cleaned = cleanRawJson(raw);
    if (!cleaned) {
      return {
        success: false,
        error: {
          type: 'EMPTY_RESPONSE',
          message: 'Received an empty response after cleaning.',
        },
      };
    }

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      return {
        success: false,
        error: {
          type: 'MALFORMED_JSON',
          message: 'The AI returned invalid JSON that could not be parsed.',
          rawDetails: raw.slice(0, 300) + (raw.length > 300 ? '...' : ''),
        },
      };
    }
  } else {
    parsed = raw;
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'Trip data must be an object matching the TripPlan schema.',
      },
    };
  }

  const data = parsed as Record<string, unknown>;

  // Check required core fields
  if (typeof data.destination !== 'string' || !data.destination.trim()) {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'Missing or invalid "destination" in the trip plan.',
      },
    };
  }

  if (typeof data.tripTitle !== 'string' || !data.tripTitle.trim()) {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'Missing or invalid "tripTitle" in the trip plan.',
      },
    };
  }

  if (typeof data.summary !== 'string' || !data.summary.trim()) {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'Missing or invalid "summary" description in the trip plan.',
      },
    };
  }

  if (!Array.isArray(data.days) || data.days.length === 0) {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'The trip plan must contain an array of at least 1 day.',
      },
    };
  }

  // Validate each day
  const validatedDays: DayPlan[] = [];
  for (let i = 0; i < data.days.length; i++) {
    const rawDay = data.days[i];
    if (!rawDay || typeof rawDay !== 'object') {
      return {
        success: false,
        error: {
          type: 'SCHEMA_VALIDATION_ERROR',
          message: `Day at index ${i} is not a valid object.`,
        },
      };
    }

    const d = rawDay as Record<string, unknown>;
    const dayNumber = typeof d.dayNumber === 'number' ? d.dayNumber : i + 1;
    const dayTitle = typeof d.title === 'string' && d.title.trim() ? d.title.trim() : `Day ${dayNumber} Exploration`;
    const theme = typeof d.theme === 'string' && d.theme.trim() ? d.theme.trim() : 'Highlights & Sights';

    if (!Array.isArray(d.stops) || d.stops.length === 0) {
      return {
        success: false,
        error: {
          type: 'SCHEMA_VALIDATION_ERROR',
          message: `Day ${dayNumber} does not contain any valid stops.`,
        },
      };
    }

    const validatedStops: Stop[] = [];
    for (let j = 0; j < d.stops.length; j++) {
      const stop = validateAndSanitizeStop(d.stops[j], j, dayNumber);
      if (stop) {
        validatedStops.push(stop);
      }
    }

    if (validatedStops.length === 0) {
      return {
        success: false,
        error: {
          type: 'SCHEMA_VALIDATION_ERROR',
          message: `Day ${dayNumber} contains no stops with valid titles.`,
        },
      };
    }

    validatedDays.push({
      dayNumber,
      title: dayTitle,
      theme,
      stops: validatedStops,
    });
  }

  const tripPlan: TripPlan = {
    id: typeof data.id === 'string' && data.id ? data.id : `trip-${Date.now()}`,
    destination: data.destination.trim(),
    tripTitle: data.tripTitle.trim(),
    summary: data.summary.trim(),
    totalDays: typeof data.totalDays === 'number' ? data.totalDays : validatedDays.length,
    bestSeason: typeof data.bestSeason === 'string' ? data.bestSeason.trim() : undefined,
    estimatedBudget: typeof data.estimatedBudget === 'string' ? data.estimatedBudget.trim() : '$$ Moderate',
    highlights: Array.isArray(data.highlights) ? data.highlights.map(String).filter(Boolean) : [],
    days: validatedDays,
  };

  return { success: true, data: tripPlan };
}

/**
 * Validates a patch for Day Adjustment
 */
export function validateDayPatch(
  raw: string | unknown,
  fallbackDayNumber: number
): { success: true; data: DayAdjustmentPatch } | { success: false; error: ApiError } {
  if (!raw) {
    return {
      success: false,
      error: {
        type: 'EMPTY_RESPONSE',
        message: 'Empty response received when adjusting day.',
      },
    };
  }

  let parsed: unknown;
  if (typeof raw === 'string') {
    const cleaned = cleanRawJson(raw);
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return {
        success: false,
        error: {
          type: 'MALFORMED_JSON',
          message: 'The model returned malformed JSON during day adjustment.',
        },
      };
    }
  } else {
    parsed = raw;
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'Patch data must be an object.',
      },
    };
  }

  const p = parsed as Record<string, unknown>;
  const dayNumber = typeof p.dayNumber === 'number' ? p.dayNumber : fallbackDayNumber;
  const theme = typeof p.theme === 'string' && p.theme.trim() ? p.theme.trim() : 'Custom Itinerary';

  const rawStops = Array.isArray(p.updatedStops) ? p.updatedStops : Array.isArray(p.stops) ? p.stops : [];
  if (rawStops.length === 0) {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'Adjusted day did not return any updated stops.',
      },
    };
  }

  const updatedStops: Stop[] = [];
  for (let i = 0; i < rawStops.length; i++) {
    const stop = validateAndSanitizeStop(rawStops[i], i, dayNumber);
    if (stop) {
      updatedStops.push(stop);
    }
  }

  if (updatedStops.length === 0) {
    return {
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: 'Adjusted day stops lacked required titles.',
      },
    };
  }

  return {
    success: true,
    data: {
      dayNumber,
      theme,
      updatedStops,
      reasoningNote: typeof p.reasoningNote === 'string' ? p.reasoningNote.trim() : undefined,
    },
  };
}
