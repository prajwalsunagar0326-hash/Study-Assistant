import React, { useState } from 'react';
import { Send, Compass, Sparkles, AlertCircle, Wrench, Bug } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  onSimulateError?: (type: '500' | 'malformed' | 'wrong_shape') => void;
}

const SAMPLE_PROMPTS = [
  '3 days in Tokyo focusing on ramen, hidden anime spots, and quiet temples with low walking distances.',
  '4 days in Rome & Florence on a student budget, prioritizing historic piazzas, local bakeries, and sunset viewpoints.',
  'Weekend in Barcelona: Gaudí architecture, beach strolls, seaside tapas, and rooftop live jazz.',
  '5 days in Iceland: Golden Circle, geothermal baths, easy waterfall hikes, and northern lights viewing.',
];

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading, onSimulateError }) => {
  const [text, setText] = useState('');
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSubmit(text.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', width: '100%' }}>
      {/* Free-form Input Card */}
      <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Describe Your Ideal Journey
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Enter destination, interests, travel pace, dietary tastes, or accessibility needs.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <textarea
              id="trip-prompt-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={4}
              placeholder="e.g., 3 days in Tokyo: love artisan matcha, peaceful shrines, authentic back-alley ramen, and moderate walking pace with time for relaxing afternoons..."
              style={{
                width: '100%',
                background: 'rgba(10, 13, 20, 0.7)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {text.length} characters • Press <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', fontSize: '0.7rem' }}>Ctrl+Enter</kbd> to generate
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="btn-ghost"
                title="Toggle interview diagnostic / error simulation mode"
                style={{ fontSize: '0.8rem', color: showDiagnostics ? 'var(--accent-cyan)' : 'var(--text-dim)' }}
              >
                <Bug size={14} />
                <span>Interviewer Mode</span>
              </button>

              <button
                type="submit"
                id="generate-trip-button"
                disabled={isLoading || !text.trim()}
                className="btn-primary"
              >
                {isLoading ? (
                  <>
                    <Sparkles size={16} className="animate-spin" />
                    <span>Synthesizing Plan...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Structured Itinerary</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggestion Chips */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={14} color="#a855f7" />
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Inspire Your Search
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setText(prompt)}
                disabled={isLoading}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Diagnostic Drawer for Failure Mode Demonstration */}
        {showDiagnostics && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              background: 'rgba(244, 63, 94, 0.06)',
              border: '1px dashed rgba(244, 63, 94, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Wrench size={16} color="#fb7185" />
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fb7185' }}>
                Interview Live Test: Simulate Realistic Failure Modes
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Clicking below fires requests specifically tailored to prove defensive parsing and error states (Assignment Section 7):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onSimulateError?.('malformed')}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px', color: '#fca5a5' }}
              >
                <AlertCircle size={13} />
                <span>1. Malformed JSON</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateError?.('wrong_shape')}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px', color: '#fcd34d' }}
              >
                <AlertCircle size={13} />
                <span>2. Wrong Schema Shape</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateError?.('500')}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px', color: '#f87171' }}
              >
                <AlertCircle size={13} />
                <span>3. Server 500 Error</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
