import React, { useState, useRef, useEffect } from 'react';
import { TripPlan, ApiError } from './types/result';
import { PromptInput } from './components/PromptInput';
import { ResultView } from './components/ResultView';
import { generateTrip } from './lib/api';
import { MapPin, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<{ mode: string; status: string } | null>(null);

  // Stale request guard as specified in Section 6
  const requestId = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check backend proxy health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerStatus(data))
      .catch(() => {
        setServerStatus({ mode: 'unreachable', status: 'error' });
      });
  }, []);

  const handleGenerate = async (promptText: string) => {
    // Increment request ID to guard against stale responses
    const currentId = ++requestId.current;

    // Cancel any ongoing in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);
    setLastPrompt(promptText);

    // Auto-scroll to view
    window.scrollTo({ top: 120, behavior: 'smooth' });

    try {
      const plan = await generateTrip(promptText, abortController.signal);

      // Stale response guard: ignore if another request started in the meantime
      if (currentId !== requestId.current) {
        console.warn(`[Stale Request Guard] Ignored request #${currentId} because newer request #${requestId.current} started.`);
        return;
      }

      setTripPlan(plan);
      setError(null);
    } catch (err: unknown) {
      if (currentId !== requestId.current) return;

      const apiErr = err as ApiError;
      setError(apiErr);
      setTripPlan(null);
    } finally {
      if (currentId === requestId.current) {
        setIsLoading(false);
      }
    }
  };

  const handleRetry = () => {
    if (lastPrompt) {
      handleGenerate(lastPrompt);
    }
  };

  const handleCancelLoading = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setTripPlan(null);
    setError(null);
    setLastPrompt('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Interview simulation helper
  const handleSimulateError = (type: '500' | 'malformed' | 'wrong_shape') => {
    let testPrompt = '';
    if (type === '500') testPrompt = 'Weekend in Berlin __test_error_500__';
    else if (type === 'malformed') testPrompt = 'Weekend in Rome __test_malformed__';
    else if (type === 'wrong_shape') testPrompt = 'Weekend in Madrid __test_wrong_shape__';

    handleGenerate(testPrompt);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(10, 13, 20, 0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Logo & Product Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={handleReset}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              }}
            >
              <MapPin size={20} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  Voyage<span className="gradient-text">AI</span>
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                >
                  STRUCTURED TOOL
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Interactive Itinerary Engine • No Chat Clutter
              </div>
            </div>
          </div>

          {/* Backend Proxy Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <Activity
                size={12}
                color={
                  serverStatus?.status === 'ok'
                    ? '#34d399'
                    : serverStatus?.status === 'error'
                    ? '#ef4444'
                    : '#fbbf24'
                }
              />
              <span>
                Proxy:{' '}
                {serverStatus?.mode === 'live-llm'
                  ? 'Live LLM API'
                  : serverStatus?.mode === 'mock-fallback'
                  ? 'Mock Fallback Active'
                  : 'Connecting...'}
              </span>
            </div>

            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#34d399',
              }}
              className="desktop-only"
            >
              <ShieldCheck size={14} />
              <span>Strict Schema Validation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ flex: 1, padding: '30px 16px 60px 16px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Hero Header when no trip is active */}
          {!tripPlan && !isLoading && (
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: '#c084fc',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={13} />
                <span>Zero-Chat • Strictly Structured UI</span>
              </div>
              <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px', lineHeight: '1.2' }}>
                Turn Free-Form Dreams Into <span className="gradient-text">Interactive Itineraries</span>
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto' }}>
                Type naturally. Our defensive parser asserts valid JSON and renders reactive tabs, reorderable stops, and day patches.
              </p>
            </div>
          )}

          {/* Free-form Input Area (Always accessible or collapsible when trip is loaded) */}
          <PromptInput
            onSubmit={handleGenerate}
            isLoading={isLoading}
            onSimulateError={handleSimulateError}
          />

          {/* Interactive Result Section */}
          <div style={{ marginTop: '28px' }}>
            <ResultView
              trip={tripPlan}
              isLoading={isLoading}
              error={error}
              onUpdateTrip={setTripPlan}
              onRetry={handleRetry}
              onCancelLoading={handleCancelLoading}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '20px',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-dim)',
          background: 'rgba(10, 13, 20, 0.9)',
        }}
      >
        <p>
          VoyageAI • Flam Frontend Engineering Assignment • Built with React 19, TypeScript, and Defensive Structured JSON Parsing
        </p>
      </footer>
    </div>
  );
};
