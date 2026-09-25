import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, XCircle, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface LoadingStateProps {
  onCancel?: () => void;
}

const STAGES = [
  { label: 'Deconstructing travel pace and constraints...', icon: Sparkles },
  { label: 'Synthesizing structured itinerary schema with AI...', icon: MapPin },
  { label: 'Calibrating durations, transit times, and budgets...', icon: Loader2 },
  { label: 'Performing defensive schema validation...', icon: ShieldCheck },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ onCancel }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStage(1), 1000);
    const timer2 = setTimeout(() => setCurrentStage(2), 2400);
    const timer3 = setTimeout(() => setCurrentStage(3), 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div style={{ maxWidth: '840px', margin: '30px auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
        {/* Pulsing Central Icon */}
        <div style={{ display: 'inline-flex', position: 'relative', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader2 size={32} color="#818cf8" style={{ animation: 'spin 1.5s linear infinite' }} />
          </div>
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
          Crafting Your Tailored Itinerary
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 24px auto' }}>
          Communicating with our secure backend proxy and assembling typed data structures for interactive rendering.
        </p>

        {/* Step progression indicators */}
        <div
          style={{
            maxWidth: '460px',
            margin: '0 auto 28px auto',
            background: 'rgba(10, 13, 20, 0.5)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            textAlign: 'left',
          }}
        >
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStage;
            const isCurrent = idx === currentStage;
            const StageIcon = stage.icon;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: idx <= currentStage ? 1 : 0.35,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div style={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
                  {isCompleted ? (
                    <CheckCircle2 size={16} color="#34d399" />
                  ) : isCurrent ? (
                    <StageIcon size={16} color="#818cf8" style={{ animation: 'spin 2s linear infinite' }} />
                  ) : (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: isCurrent ? 'var(--text-main)' : isCompleted ? '#34d399' : 'var(--text-muted)',
                    fontWeight: isCurrent ? '600' : '400',
                  }}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Skeletons simulating day and cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px', opacity: 0.4 }}>
          <div
            style={{
              height: '38px',
              width: '60%',
              margin: '0 auto',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              animation: 'pulseGlow 2s infinite',
            }}
          />
          <div
            style={{
              height: '80px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          />
          <div
            style={{
              height: '80px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          />
        </div>

        {onCancel && (
          <div style={{ marginTop: '24px' }}>
            <button type="button" onClick={onCancel} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
              <XCircle size={14} />
              <span>Cancel Request</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
