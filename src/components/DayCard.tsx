import React, { useState } from 'react';
import { DayPlan, Stop } from '../types/result';
import { StopCard } from './StopCard';
import { AdjustDayModal } from './AdjustDayModal';
import { AddStopModal } from './AddStopModal';
import { Sliders, Plus, Calendar, Compass } from 'lucide-react';

interface DayCardProps {
  day: DayPlan;
  tripDestination: string;
  onUpdateStops: (dayNumber: number, stops: Stop[]) => void;
  onApplyDayAdjustment: (instruction: string) => Promise<void>;
  onRemoveStop: (dayNumber: number, stopIndex: number) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  tripDestination,
  onUpdateStops,
  onApplyDayAdjustment,
  onRemoveStop,
}) => {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newStops = [...day.stops];
    const temp = newStops[index - 1];
    newStops[index - 1] = newStops[index];
    newStops[index] = temp;
    onUpdateStops(day.dayNumber, newStops);
  };

  const handleMoveDown = (index: number) => {
    if (index >= day.stops.length - 1) return;
    const newStops = [...day.stops];
    const temp = newStops[index + 1];
    newStops[index + 1] = newStops[index];
    newStops[index] = temp;
    onUpdateStops(day.dayNumber, newStops);
  };

  const handleAddCustomStop = (stop: Stop) => {
    const newStops = [...day.stops, stop];
    onUpdateStops(day.dayNumber, newStops);
  };

  return (
    <div>
      {/* Day Header Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'rgba(22, 29, 47, 0.85)',
          borderLeft: '4px solid #a855f7',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Calendar size={12} />
              <span>Day {day.dayNumber}</span>
            </span>

            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Compass size={12} />
              <span>{day.theme}</span>
            </span>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              • {day.stops.length} planned stops
            </span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {day.title}
          </h3>
        </div>

        {/* Day Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsAddStopModalOpen(true)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '7px 12px' }}
          >
            <Plus size={14} />
            <span>Add Custom Stop</span>
          </button>

          {/* The explicit refinement action requested by the brief */}
          <button
            type="button"
            id={`adjust-day-${day.dayNumber}-btn`}
            onClick={() => setIsAdjustModalOpen(true)}
            className="btn-primary"
            style={{
              fontSize: '0.82rem',
              padding: '7px 14px',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            }}
          >
            <Sliders size={14} />
            <span>Adjust This Day</span>
          </button>
        </div>
      </div>

      {/* Stops Timeline List */}
      <div style={{ position: 'relative', paddingLeft: '8px' }}>
        {day.stops.length === 0 ? (
          <div
            className="glass-panel"
            style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}
          >
            <p>No stops currently scheduled for Day {day.dayNumber}.</p>
            <button
              type="button"
              onClick={() => setIsAddStopModalOpen(true)}
              className="btn-primary"
              style={{ marginTop: '12px', fontSize: '0.82rem' }}
            >
              <Plus size={14} />
              <span>Add Your First Stop</span>
            </button>
          </div>
        ) : (
          day.stops.map((stop, index) => (
            <StopCard
              key={stop.id || `stop-${day.dayNumber}-${index}`}
              stop={stop}
              index={index}
              totalStops={day.stops.length}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onRemove={() => onRemoveStop(day.dayNumber, index)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <AdjustDayModal
        day={day}
        tripDestination={tripDestination}
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onApplyAdjustment={onApplyDayAdjustment}
      />

      <AddStopModal
        dayNumber={day.dayNumber}
        isOpen={isAddStopModalOpen}
        onClose={() => setIsAddStopModalOpen(false)}
        onAddStop={handleAddCustomStop}
      />
    </div>
  );
};
