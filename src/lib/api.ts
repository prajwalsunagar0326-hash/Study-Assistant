import { StudyPlan, ApiError, StudyMode } from '../types/study';
import { validateStudyPlan } from './validateStudyPlan';

/**
 * Sends a study generation request to the backend with AbortSignal support.
 */
export async function generateStudyPlanApi(
  prompt: string,
  mode: StudyMode,
  signal?: AbortSignal
): Promise<{ success: true; data: StudyPlan } | { success: false; error: ApiError }> {
  try {
    const response = await fetch('/api/generate-study', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, mode }),
      signal,
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errJson = await response.json();
        if (errJson && errJson.error) {
          errorMessage = errJson.error;
        }
      } catch {
        // Fallback to status text
        if (response.statusText) errorMessage = response.statusText;
      }

      return {
        success: false,
        error: {
          type: response.status >= 500 ? 'SERVER_ERROR' : 'SCHEMA_VALIDATION_ERROR',
          message: errorMessage,
          statusCode: response.status,
        },
      };
    }

    const payload = await response.json();
    const rawData = payload?.data;

    // Validate and sanitize the payload using runtime schema
    return validateStudyPlan(rawData);
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        error: {
          type: 'ABORTED',
          message: 'Request was cancelled by a newer study request.',
        },
      };
    }

    return {
      success: false,
      error: {
        type: 'NETWORK_ERROR',
        message: 'Unable to connect to the StudyAI backend. Please check your network connection.',
        rawDetails: err instanceof Error ? err.message : String(err),
      },
    };
  }
}

/**
 * Checks backend health and active LLM configuration
 */
export async function checkBackendHealth(): Promise<{
  status: string;
  app: string;
  mode: 'live-llm' | 'mock-fallback';
  model: string;
  message: string;
}> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[StudyAI Health Check Failed]:', err);
  }
  return {
    status: 'offline',
    app: 'StudyAI',
    mode: 'mock-fallback',
    model: 'offline-mode',
    message: 'Backend server is not responding.',
  };
}
