import React, { useState } from 'react';
import { Stop, StopCategory } from '../types/result';
import {
  Utensils,
  Landmark,
  Compass,
  Footprints,
  Coffee,
  ShoppingBag,
  Plane,
  Clock,
  Coins,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  Lightbulb,
  MapPin,
} from 'lucide-react';

interface StopCardProps {
  stop: Stop;
  index: number;
  totalStops: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  index,
  totalStops,
  onMoveUp,
  onMoveDown,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryDetails = (cat: StopCategory) => {
    switch (cat) {
      case 'food':
        return { label: 'Food & Dining', icon: Utensils, badgeClass: 'badge-food' };
      case 'culture':
        return { label: 'Culture & Heritage', icon: Landmark, badgeClass: 'badge-culture' };
      case 'adventure':
        return { label: 'Adventure & Active', icon: Footprints, badgeClass: 'badge-adventure' };
      case 'relaxation':
        return { label: 'Relaxation & Wellness', icon: Coffee, badgeClass: 'badge-relaxation' };
      case 'shopping':
        return { label: 'Local Shopping', icon: ShoppingBag, badgeClass: 'badge-shopping' };
      case 'travel':
        return { label: 'Transit & Route', icon: Plane, badgeClass: 'badge-travel' };
      case 'sightseeing':
      default:
        return { label: 'Iconic Sightseeing', icon: Compass, badgeClass: 'badge-sightseeing' };
    }
  };

  const catDetails = getCategoryDetails(stop.category);
  const CatIcon = catDetails.icon;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '18px 20px',
        marginBottom: '14px',
        position: 'relative',
        borderLeft: '4px solid var(--accent-primary)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
        {/* Main Content Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badges row: Time, Category, Duration, Cost */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '3px 9px',
                borderRadius: '6px',
                fontFamily: 'monospace',
              }}
            >
              {stop.time}
            </span>

            <span className={`badge-category ${catDetails.badgeClass}`}>
              <CatIcon size={12} />
              <span>{catDetails.label}</span>
            </span>

            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              <Clock size={12} />
              <span>{stop.duration}</span>
            </span>

            <span
              style={{
                fontSize: '0.75rem',
                color: '#34d399',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(16, 185, 129, 0.08)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <Coins size={12} />
              <span>{stop.estimatedCost}</span>
            </span>
          </div>

          {/* Title */}
          <h4
            style={{
              fontSize: '1.08rem',
              fontWeight: '700',
              color: 'var(--text-main)',
              marginBottom: '6px',
              wordBreak: 'break-word',
            }}
          >
            {stop.title}
          </h4>

          {/* Description */}
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
              marginBottom: '6px',
            }}
          >
            {stop.description}
          </p>

          {/* Location if provided */}
          {stop.location && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                marginTop: '2px',
              }}
            >
              <MapPin size={12} color="var(--accent-primary)" />
              <span>{stop.location}</span>
            </div>
          )}

          {/* Expandable Insider Tip */}
          {stop.tips && (
            <div style={{ marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn-ghost"
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 8px',
                  color: isExpanded ? '#fbbf24' : 'var(--text-dim)',
                  background: isExpanded ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                }}
              >
                <Lightbulb size={13} color={isExpanded ? '#fbbf24' : 'currentColor'} />
                <span>{isExpanded ? 'Hide Insider Tip' : 'View Insider Tip'}</span>
                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {isExpanded && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '10px 14px',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#fef3c7',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <Lightbulb size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: '600', color: '#fbbf24' }}>Curator Note: </span>
                    {stop.tips}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls (Reorder up/down + delete) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center',
            paddingLeft: '10px',
            borderLeft: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="btn-ghost"
            title="Move stop earlier"
            style={{
              padding: '6px',
              opacity: index === 0 ? 0.3 : 1,
              cursor: index === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <ArrowUp size={15} />
          </button>

          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              color: 'var(--text-dim)',
              userSelect: 'none',
            }}
          >
            #{index + 1}
          </span>

          <button
            type="button"
            onClick={() => onMoveDown(index)}
            disabled={index === totalStops - 1}
            className="btn-ghost"
            title="Move stop later"
            style={{
              padding: '6px',
              opacity: index === totalStops - 1 ? 0.3 : 1,
              cursor: index === totalStops - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <ArrowDown size={15} />
          </button>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="btn-ghost"
            title="Remove this stop from itinerary"
            style={{
              padding: '6px',
              color: '#fb7185',
              marginTop: '4px',
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
