import React from 'react';
import { TripPlan, ApiError } from '../types/result';
import { TripView } from './TripView';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { Compass, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ResultViewProps {
  trip: TripPlan | null;
  isLoading: boolean;
  error: ApiError | null;
  onUpdateTrip: (updated: TripPlan) => void;
  onRetry: () => void;
  onCancelLoading?: () => void;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  trip,
  isLoading,
  error,
  onUpdateTrip,
  onRetry,
  onCancelLoading,
  onReset,
}) => {
  if (isLoading) {
    return <LoadingState onCancel={onCancelLoading} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} onReset={onReset} />;
  }

  if (trip) {
    return <TripView trip={trip} onUpdateTrip={onUpdateTrip} onReset={onReset} />;
  }

  // Initial Empty State (before first prompt submission)
  return (
    <div style={{ maxWidth: '840px', margin: '40px auto 0 auto', width: '100%' }}>
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          textAlign: 'center',
          background: 'rgba(16, 21, 34, 0.4)',
          border: '1px dashed var(--border-subtle)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Compass size={28} color="#818cf8" />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
          Ready to Craft Your Journey
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
          Enter any travel dream above. We'll query our secure proxy, defensively validate the structured JSON schema, and assemble an interactive day-by-day itinerary.
        </p>

        {/* Value Proposition Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            textAlign: 'left',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={16} color="#34d399" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Guaranteed Schema
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Defensive runtime parsing ensures malformed outputs never crash the UI.
            </p>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="#a855f7" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Zero Chat Clutter
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              100% interactive cards and tabs. No chat bubbles or raw conversational text.
            </p>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle2 size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Granular Edits & Undo
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Reorder stops, delete with undo, or refine specific days with structured patch actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
