import React, { useState } from 'react';
import { Stop, StopCategory } from '../types/result';
import { PlusCircle, X } from 'lucide-react';

interface AddStopModalProps {
  dayNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (stop: Stop) => void;
}

export const AddStopModal: React.FC<AddStopModalProps> = ({
  dayNumber,
  isOpen,
  onClose,
  onAddStop,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('02:00 PM');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<StopCategory>('sightseeing');
  const [duration, setDuration] = useState('1.5 hours');
  const [estimatedCost, setEstimatedCost] = useState('$10 - $20');
  const [tips, setTips] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newStop: Stop = {
      id: `custom-stop-${Date.now()}`,
      time: time.trim() || 'Flexible Time',
      title: title.trim(),
      description: description.trim() || 'Custom planned visit.',
      category,
      duration: duration.trim() || '1 hour',
      estimatedCost: estimatedCost.trim() || 'Free',
      tips: tips.trim() || undefined,
      location: location.trim() || undefined,
    };

    onAddStop(newStop);
    onClose();
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '24px',
          background: 'rgba(16, 21, 34, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Add Stop to Day {dayNumber}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Stop Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Tea House Ceremony"
              style={{
                width: '100%',
                background: 'rgba(10, 13, 20, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 02:30 PM"
                style={{
                  width: '100%',
                  background: 'rgba(10, 13, 20, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StopCategory)}
                style={{
                  width: '100%',
                  background: 'rgba(10, 13, 20, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                }}
              >
                <option value="sightseeing">Sightseeing</option>
                <option value="food">Food & Dining</option>
                <option value="culture">Culture & Heritage</option>
                <option value="adventure">Adventure</option>
                <option value="relaxation">Relaxation</option>
                <option value="shopping">Shopping</option>
                <option value="travel">Transit</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief note about what to do or see..."
              style={{
                width: '100%',
                background: 'rgba(10, 13, 20, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                resize: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 1 hour"
                style={{
                  width: '100%',
                  background: 'rgba(10, 13, 20, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Estimated Cost
              </label>
              <input
                type="text"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="e.g. $15"
                style={{
                  width: '100%',
                  background: 'rgba(10, 13, 20, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Neighborhood / Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Shibuya Crossing District"
              style={{
                width: '100%',
                background: 'rgba(10, 13, 20, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Insider Tip
            </label>
            <input
              type="text"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="e.g. Visit before 10 AM to avoid lines"
              style={{
                width: '100%',
                background: 'rgba(10, 13, 20, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Stop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
