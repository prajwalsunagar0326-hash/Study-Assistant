import React, { useState } from 'react';
import { DayPlan } from '../types/result';
import { Sliders, X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface AdjustDayModalProps {
  day: DayPlan;
  tripDestination: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyAdjustment: (instruction: string) => Promise<void>;
}

const PRESET_ADJUSTMENTS = [
  'It might rain: replace outdoor walks with covered markets and indoor art museums.',
  'Make the evening dinner more budget-friendly ($15-$25).',
  'Add a 1.5-hour specialty coffee or afternoon pastry break.',
  'Optimize for family / toddler-friendly walking distances.',
];

export const AdjustDayModal: React.FC<AdjustDayModalProps> = ({
  day,
  isOpen,
  onClose,
  onApplyAdjustment,
}) => {
  const [instruction, setInstruction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onApplyAdjustment(instruction.trim());
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to adjust day. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '24px',
          background: 'rgba(16, 21, 34, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sliders size={16} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Adjust Day {day.dayNumber}: {day.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Directly patches this day's stops into updated cards (zero conversational fluff).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn-ghost"
            style={{ padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label
              htmlFor="adjustment-instruction"
              style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}
            >
              Specify Desired Change for Day {day.dayNumber}:
            </label>
            <textarea
              id="adjustment-instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              placeholder="e.g. Afternoon rain forecasted — swap outdoor walks for modern art museum and an artisan tea house."
              style={{
                width: '100%',
                background: 'rgba(10, 13, 20, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '12px',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          {/* Quick adjustment presets */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
              Quick Presets:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PRESET_ADJUSTMENTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(preset)}
                  disabled={isSubmitting}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !instruction.trim()}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Patching Day {day.dayNumber}...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Apply Day Patch</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
