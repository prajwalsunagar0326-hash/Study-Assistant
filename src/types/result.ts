export type StopCategory = 
  | 'food' 
  | 'culture' 
  | 'sightseeing' 
  | 'adventure' 
  | 'relaxation' 
  | 'shopping' 
  | 'travel';

export interface Stop {
  id: string;
  time: string;           // e.g. "09:00 AM" or "Morning"
  title: string;          // e.g. "Tsukiji Outer Fish Market"
  description: string;    // e.g. "Explore vibrant alleyways lined with fresh sushi and tamagoyaki vendors."
  category: StopCategory;
  duration: string;       // e.g. "2 hrs"
  estimatedCost: string;  // e.g. "$15 - $25"
  tips?: string;          // Insider travel tip
  location?: string;      // Specific neighborhood or landmark
}

export interface DayPlan {
  dayNumber: number;
  title: string;          // e.g. "Old Town Traditions & Culinary Delights"
  theme: string;          // e.g. "Gastronomy & Cultural Heritage"
  stops: Stop[];
}

export interface TripPlan {
  id: string;
  destination: string;    // e.g. "Tokyo, Japan"
  tripTitle: string;      // e.g. "3-Day Tokyo Hidden Temples & Foodie Trail"
  summary: string;        // Brief 2-3 sentence overview
  totalDays: number;
  bestSeason?: string;    // e.g. "March - May (Spring Cherry Blossoms)"
  estimatedBudget: string;// e.g. "$$ Moderate ($75 - $120/day excluding stay)"
  highlights: string[];   // Key highlight tags
  days: DayPlan[];
}

/**
 * Patch response for "Adjust this day" (one-shot structured refinement)
 */
export interface DayAdjustmentPatch {
  dayNumber: number;
  theme: string;
  updatedStops: Stop[];
  reasoningNote?: string; // Summary of changes (e.g., "Swapped outdoor walk for museum due to rain request")
}

export type ValidationErrorType =
  | 'MALFORMED_JSON'
  | 'EMPTY_RESPONSE'
  | 'SCHEMA_VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'SERVER_ERROR';

export interface ApiError {
  type: ValidationErrorType;
  message: string;
  rawDetails?: string;
}
