import { validateTripPlan, validateDayPatch, cleanRawJson } from '../src/lib/validateResult';

console.log('====================================================');
console.log('RUNNING DEFENSIVE PARSER & FAILURE MODE TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${detail || ''}`);
    failedTests++;
  }
}

// 1. Test cleanRawJson with Markdown wrappers
{
  const rawWithFences = '```json\n{"destination":"Kyoto","tripTitle":"Old Capital","summary":"Tranquil shrines","totalDays":2,"days":[{"dayNumber":1,"title":"Shrines","theme":"Zen","stops":[{"id":"1","time":"9am","title":"Fushimi Inari","description":"Red torii gates","category":"sightseeing","duration":"2h","estimatedCost":"Free"}]}]}\n```';
  const cleaned = cleanRawJson(rawWithFences);
  assert(cleaned.startsWith('{') && cleaned.endsWith('}'), 'Strips markdown code fences cleanly');
}

// 2. Test Empty Response
{
  const result = validateTripPlan('');
  assert(!result.success && result.error.type === 'EMPTY_RESPONSE', 'Catches empty response as EMPTY_RESPONSE');
}

// 3. Test Malformed JSON (unclosed bracket)
{
  const malformed = '{"destination": "Tokyo", "tripTitle": "City of Neon", "days": [';
  const result = validateTripPlan(malformed);
  assert(!result.success && result.error.type === 'MALFORMED_JSON', 'Catches malformed JSON syntax as MALFORMED_JSON');
}

// 4. Test Wrong Shape: Missing "destination"
{
  const wrongShape = JSON.stringify({
    tripTitle: 'Some Title',
    summary: 'A nice summary',
    days: [{ dayNumber: 1, title: 'Day 1', theme: 'Walks', stops: [{ id: '1', time: '9am', title: 'Park', description: 'trees', category: 'sightseeing', duration: '1h', estimatedCost: 'Free' }] }]
  });
  const result = validateTripPlan(wrongShape);
  assert(!result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR', 'Catches missing required destination as SCHEMA_VALIDATION_ERROR');
}

// 5. Test Wrong Shape: Empty or missing days array
{
  const missingDays = JSON.stringify({
    destination: 'Paris',
    tripTitle: 'City of Lights',
    summary: 'Romantic trip',
    days: []
  });
  const result = validateTripPlan(missingDays);
  assert(!result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR', 'Catches empty days array as SCHEMA_VALIDATION_ERROR');
}

// 6. Test Wrong Shape: Stops without title
{
  const invalidStops = JSON.stringify({
    destination: 'Rome',
    tripTitle: 'Eternal City',
    summary: 'Colosseum and pasta',
    days: [{
      dayNumber: 1,
      title: 'Ancient Forum',
      theme: 'History',
      stops: [{ time: '9am', description: 'Just a description, missing title' }]
    }]
  });
  const result = validateTripPlan(invalidStops);
  assert(!result.success && result.error.type === 'SCHEMA_VALIDATION_ERROR', 'Catches stop missing title as SCHEMA_VALIDATION_ERROR');
}

// 7. Test Valid Trip Plan (Happy Path)
{
  const validTrip = JSON.stringify({
    destination: 'Seoul, South Korea',
    tripTitle: 'Seoul Food & Culture Odyssey',
    summary: 'Explore palace courtyards, bustling night markets, and cafe alleys.',
    totalDays: 2,
    bestSeason: 'Autumn',
    estimatedBudget: '$$ Moderate',
    highlights: ['Gyeongbokgung Palace', 'Gwangjang Market'],
    days: [
      {
        dayNumber: 1,
        title: 'Palaces & Traditional Tea',
        theme: 'Joseon Dynasty Heritage',
        stops: [
          {
            id: 'stop-1',
            time: '09:30 AM',
            title: 'Gyeongbokgung Morning Walk',
            description: 'Witness the guard changing ceremony at the main palace gates.',
            category: 'culture',
            duration: '2 hours',
            estimatedCost: '$3',
            tips: 'Rent a hanbok nearby for free palace admission.',
            location: 'Jongno-gu'
          }
        ]
      }
    ]
  });
  const result = validateTripPlan(validTrip);
  assert(result.success && result.data.destination === 'Seoul, South Korea' && result.data.days[0].stops.length === 1, 'Validates and sanitizes well-formed TripPlan');
}

// 8. Test Day Adjustment Patch Validation
{
  const validPatch = JSON.stringify({
    dayNumber: 1,
    theme: 'Rainy Day Cultural Retreat',
    updatedStops: [
      {
        id: 'stop-rain-1',
        time: '10:00 AM',
        title: 'National Museum of Modern & Contemporary Art',
        description: 'Immerse in contemporary Korean media art away from the rain.',
        category: 'culture',
        duration: '2.5 hours',
        estimatedCost: '$4'
      }
    ],
    reasoningNote: 'Replaced outdoor palace with indoor national art museum due to rain.'
  });
  const result = validateDayPatch(validPatch, 1);
  assert(result.success && result.data.updatedStops[0].title.includes('Museum'), 'Validates Day Adjustment Patch successfully');
}

console.log(`\nResults: ${passedTests} passed, ${failedTests} failed.`);
if (failedTests > 0) process.exit(1);
