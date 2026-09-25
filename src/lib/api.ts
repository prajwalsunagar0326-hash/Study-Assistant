import { TripPlan, DayPlan, DayAdjustmentPatch, ApiError } from '../types/result';
import { validateTripPlan, validateDayPatch } from './validateResult';

const API_BASE = '/api';

export interface DayAdjustmentPayload {
  tripDestination: string;
  day: DayPlan;
  instruction: string;
}

/**
 * Generate a complete trip plan from user free-text.
 * Calls backend proxy, parses, and validates data.
 */
export async function generateTrip(
  prompt: string,
  signal?: AbortSignal
): Promise<TripPlan> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal,
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      const abortErr: ApiError = {
        type: 'TIMEOUT_ERROR',
        message: 'Request took too long or was canceled.',
      };
      throw abortErr;
    }
    const networkErr: ApiError = {
      type: 'NETWORK_ERROR',
      message: 'Failed to communicate with proxy backend. Is the server running?',
      rawDetails: err instanceof Error ? err.message : String(err),
    };
    throw networkErr;
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error || errJson.message || '';
    } catch {
      // response wasn't JSON
    }

    const serverErr: ApiError = {
      type: 'SERVER_ERROR',
      message: errorDetail || `Backend responded with HTTP status ${response.status}`,
    };
    throw serverErr;
  }

  const rawJson = await response.json();

  // Validate the returned object or raw string before passing to React state
  const validation = validateTripPlan(rawJson.data || rawJson);
  if (!validation.success) {
    throw validation.error;
  }

  return validation.data;
}

/**
 * Refine/adjust a single day's plan.
 * Returns a patch containing the updated stops and day theme.
 */
export async function adjustDay(
  payload: DayAdjustmentPayload,
  signal?: AbortSignal
): Promise<DayAdjustmentPatch> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/adjust-day`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: payload.tripDestination,
        dayNumber: payload.day.dayNumber,
        currentDayTitle: payload.day.title,
        currentTheme: payload.day.theme,
        currentStops: payload.day.stops,
        instruction: payload.instruction,
      }),
      signal,
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      const abortErr: ApiError = {
        type: 'TIMEOUT_ERROR',
        message: 'Adjustment request timed out.',
      };
      throw abortErr;
    }
    const networkErr: ApiError = {
      type: 'NETWORK_ERROR',
      message: 'Unable to reach backend for day adjustment.',
      rawDetails: err instanceof Error ? err.message : String(err),
    };
    throw networkErr;
  }

  if (!response.ok) {
    let errorMsg = `Server error ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {
      // fallback
    }
    const serverErr: ApiError = {
      type: 'SERVER_ERROR',
      message: errorMsg,
    };
    throw serverErr;
  }

  const rawJson = await response.json();
  const validation = validateDayPatch(rawJson.data || rawJson, payload.day.dayNumber);

  if (!validation.success) {
    throw validation.error;
  }

  return validation.data;
}
