import React, { useState } from 'react';
import { ApiError } from '../types/result';
import { AlertTriangle, RefreshCw, FileCode2, ShieldAlert, WifiOff, Clock, Server, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorStateProps {
  error: ApiError;
  onRetry: () => void;
  onReset?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onReset }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const getErrorMeta = () => {
    switch (error.type) {
      case 'MALFORMED_JSON':
        return {
          title: 'Malformed Model Output (Invalid JSON)',
          description: 'The AI model generated response text that failed strict JSON parsing (unclosed brackets, trailing commas, or markdown formatting).',
          icon: FileCode2,
          color: '#fb7185',
          remedy: 'Our backend cleans known markdown wrappers, but the LLM output syntax was broken. Retrying usually resolves non-deterministic format blips.',
        };
      case 'SCHEMA_VALIDATION_ERROR':
        return {
          title: 'Schema Validation Failure (Wrong Data Shape)',
          description: 'The AI returned valid JSON, but it failed our runtime shape assertion (missing required fields, empty days array, or invalid stop types).',
          icon: ShieldAlert,
          color: '#f59e0b',
          remedy: 'Our defensive parser caught the missing fields before rendering to protect React state from undefined access crashes.',
        };
      case 'EMPTY_RESPONSE':
        return {
          title: 'Empty Model Response',
          description: 'The model returned zero tokens or an empty body.',
          icon: AlertTriangle,
          color: '#f97316',
          remedy: 'Try supplying slightly more details in your prompt regarding destination, duration, or pace.',
        };
      case 'TIMEOUT_ERROR':
        return {
          title: 'Request Timed Out',
          description: 'The server or LLM provider took too long to generate a structured response.',
          icon: Clock,
          color: '#38bdf8',
          remedy: 'Check your network connection or try a more concise travel request.',
        };
      case 'NETWORK_ERROR':
        return {
          title: 'Proxy Connection Failed',
          description: error.message || 'Unable to connect to the backend server.',
          icon: WifiOff,
          color: '#ef4444',
          remedy: 'Ensure the proxy backend is running on port 3001 (npm run dev:backend or npm start).',
        };
      case 'SERVER_ERROR':
      default:
        return {
          title: 'Server Error Encountered',
          description: error.message || 'The backend proxy encountered an unexpected condition.',
          icon: Server,
          color: '#e11d48',
          remedy: 'Check server logs or verify your LLM API credentials in the .env file.',
        };
    }
  };

  const meta = getErrorMeta();
  const IconComponent = meta.icon;

  return (
    <div style={{ maxWidth: '840px', margin: '30px auto', width: '100%' }}>
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          background: 'rgba(26, 17, 27, 0.75)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `rgba(${meta.color === '#fb7185' ? '251, 113, 133' : '239, 68, 68'}, 0.15)`,
              border: `1px solid ${meta.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconComponent size={24} color={meta.color} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: meta.color,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {error.type}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Defensively caught before UI render
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
              {meta.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
              {meta.description}
            </p>

            <div
              style={{
                background: 'rgba(10, 13, 20, 0.6)',
                borderRadius: '8px',
                padding: '10px 14px',
                borderLeft: `3px solid ${meta.color}`,
                fontSize: '0.82rem',
                color: '#cbd5e1',
                marginBottom: '16px',
              }}
            >
              <strong>Remediation:</strong> {meta.remedy}
            </div>

            {/* Expandable Technical Details */}
            {error.rawDetails && (
              <div style={{ marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="btn-ghost"
                  style={{ fontSize: '0.78rem', padding: '4px 0', color: 'var(--text-muted)' }}
                >
                  <span>{showTechnicalDetails ? 'Hide Raw AI Output' : 'Inspect Raw AI Output'}</span>
                  {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showTechnicalDetails && (
                  <pre
                    style={{
                      marginTop: '8px',
                      padding: '12px',
                      background: '#07090e',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#f43f5e',
                      overflowX: 'auto',
                      maxHeight: '180px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {error.rawDetails}
                  </pre>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onRetry}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                }}
              >
                <RefreshCw size={15} />
                <span>Retry Request</span>
              </button>

              {onReset && (
                <button type="button" onClick={onReset} className="btn-secondary">
                  <span>Edit Input Text</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
