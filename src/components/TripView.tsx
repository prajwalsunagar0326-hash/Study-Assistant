import React, { useState } from 'react';
import { TripPlan, Stop, DayAdjustmentPatch } from '../types/result';
import { DayCard } from './DayCard';
import {
  MapPin,
  Calendar,
  Wallet,
  Sun,
  Download,
  RotateCcw,
  Sparkles,
  Undo2,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { adjustDay } from '../lib/api';

interface UndoAction {
  type: 'DELETE_STOP' | 'ADJUST_DAY';
  dayNumber: number;
  previousStops: Stop[];
  previousTheme?: string;
  description: string;
}

interface TripViewProps {
  trip: TripPlan;
  onUpdateTrip: (updated: TripPlan) => void;
  onReset: () => void;
}

export const TripView: React.FC<TripViewProps> = ({ trip, onUpdateTrip, onReset }) => {
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const [undoHistory, setUndoHistory] = useState<UndoAction[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeDay = trip.days.find((d) => d.dayNumber === activeDayNumber) || trip.days[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 5000);
  };

  // Update stops for a specific day
  const handleUpdateStops = (dayNumber: number, newStops: Stop[]) => {
    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber === dayNumber) {
        return { ...d, stops: newStops };
      }
      return d;
    });

    onUpdateTrip({
      ...trip,
      days: updatedDays,
    });
  };

  // Remove stop with undo capability
  const handleRemoveStop = (dayNumber: number, stopIndex: number) => {
    const targetDay = trip.days.find((d) => d.dayNumber === dayNumber);
    if (!targetDay) return;

    const stopToRemove = targetDay.stops[stopIndex];
    const previousStops = [...targetDay.stops];

    const updatedStops = targetDay.stops.filter((_, idx) => idx !== stopIndex);
    handleUpdateStops(dayNumber, updatedStops);

    // Push to undo stack
    setUndoHistory((prev) => [
      ...prev,
      {
        type: 'DELETE_STOP',
        dayNumber,
        previousStops,
        description: `Removed "${stopToRemove.title}"`,
      },
    ]);

    triggerToast(`Removed "${stopToRemove.title}".`);
  };

  // Refinement loop: Apply day adjustment patch
  const handleApplyDayAdjustment = async (instruction: string) => {
    const previousStops = [...activeDay.stops];
    const previousTheme = activeDay.theme;

    // Call API for structured patch
    const patch: DayAdjustmentPatch = await adjustDay({
      tripDestination: trip.destination,
      day: activeDay,
      instruction,
    });

    // Immutably merge patch into state
    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber === activeDay.dayNumber) {
        return {
          ...d,
          theme: patch.theme || d.theme,
          stops: patch.updatedStops,
        };
      }
      return d;
    });

    onUpdateTrip({
      ...trip,
      days: updatedDays,
    });

    // Record in undo history
    setUndoHistory((prev) => [
      ...prev,
      {
        type: 'ADJUST_DAY',
        dayNumber: activeDay.dayNumber,
        previousStops,
        previousTheme,
        description: `Adjusted Day ${activeDay.dayNumber}`,
      },
    ]);

    triggerToast(
      patch.reasoningNote
        ? `Day ${activeDay.dayNumber} updated: ${patch.reasoningNote}`
        : `Day ${activeDay.dayNumber} adjusted successfully.`
    );
  };

  // Undo action
  const handleUndo = () => {
    if (undoHistory.length === 0) return;

    const lastAction = undoHistory[undoHistory.length - 1];
    setUndoHistory((prev) => prev.slice(0, prev.length - 1));

    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber === lastAction.dayNumber) {
        return {
          ...d,
          theme: lastAction.previousTheme || d.theme,
          stops: lastAction.previousStops,
        };
      }
      return d;
    });

    onUpdateTrip({
      ...trip,
      days: updatedDays,
    });

    triggerToast(`Undone: ${lastAction.description}`);
  };

  // Export JSON file
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '-')}-itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const totalStopsCount = trip.days.reduce((acc, d) => acc + d.stops.length, 0);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      {/* Toast Bar with Undo */}
      {toastMessage && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '12px 20px',
            zIndex: 1100,
            background: 'rgba(22, 29, 47, 0.95)',
            border: '1px solid var(--accent-primary)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <CheckCircle size={16} color="#34d399" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{toastMessage}</span>
          {undoHistory.length > 0 && (
            <button
              type="button"
              onClick={handleUndo}
              className="btn-primary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              <Undo2 size={12} />
              <span>Undo</span>
            </button>
          )}
        </div>
      )}

      {/* Main Trip Overview Card */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            {/* Destination Tag */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '0.82rem', fontWeight: '700', marginBottom: '8px' }}>
              <MapPin size={15} />
              <span>{trip.destination.toUpperCase()}</span>
            </div>

            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px', lineHeight: '1.2' }}>
              {trip.tripTitle}
            </h1>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              {trip.summary}
            </p>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <Calendar size={15} color="#818cf8" />
                <span>{trip.totalDays} Days ({totalStopsCount} stops total)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#34d399' }}>
                <Wallet size={15} color="#34d399" />
                <span>{trip.estimatedBudget}</span>
              </div>

              {trip.bestSeason && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#fbbf24' }}>
                  <Sun size={15} color="#fbbf24" />
                  <span>{trip.bestSeason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Header Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {undoHistory.length > 0 && (
              <button
                type="button"
                onClick={handleUndo}
                className="btn-secondary"
                title="Undo last change"
                style={{ fontSize: '0.8rem' }}
              >
                <Undo2 size={14} />
                <span>Undo</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportJson}
              className="btn-secondary"
              title="Download structured JSON"
              style={{ fontSize: '0.8rem' }}
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="btn-secondary"
              title="Plan another journey"
              style={{ fontSize: '0.8rem' }}
            >
              <RotateCcw size={14} />
              <span>New Plan</span>
            </button>
          </div>
        </div>

        {/* Highlights Pills */}
        {trip.highlights && trip.highlights.length > 0 && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={14} color="#a855f7" />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Curated Highlights
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {trip.highlights.map((h, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: '16px',
                    padding: '3px 10px',
                    fontSize: '0.78rem',
                    color: '#c7d2fe',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Tag size={11} />
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Day Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
          scrollbarWidth: 'none',
        }}
      >
        {trip.days.map((day) => {
          const isActive = day.dayNumber === activeDayNumber;
          return (
            <button
              key={day.dayNumber}
              type="button"
              id={`day-tab-${day.dayNumber}`}
              onClick={() => setActiveDayNumber(day.dayNumber)}
              style={{
                flex: '0 0 auto',
                background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(22, 29, 47, 0.7)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '10px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 14px rgba(99, 102, 241, 0.4)' : 'none',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.85 }}>
                Day {day.dayNumber}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {day.theme || `Day ${day.dayNumber}`}
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '2px' }}>
                {day.stops.length} stops
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Content */}
      {activeDay && (
        <DayCard
          day={activeDay}
          tripDestination={trip.destination}
          onUpdateStops={handleUpdateStops}
          onApplyDayAdjustment={handleApplyDayAdjustment}
          onRemoveStop={handleRemoveStop}
        />
      )}
    </div>
  );
};
