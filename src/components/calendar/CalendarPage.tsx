import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Clock,
  Trash2,
  Edit3,
  BookOpen,
} from 'lucide-react';
import { useProductivity } from '../../context/ProductivityContext';
import { StudyEvent, StudyEventType } from '../../types/productivity';
import { EventModal } from './EventModal';
import { getTodayDateString } from '../../lib/storage';

export const CalendarPage: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useProductivity();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<StudyEvent | null>(null);

  const todayStr = getTodayDateString();

  // Month metadata
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(getTodayDateString());
  };

  // Calendar Day Grid Computation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: StudyEvent[];
    }[] = [];

    // Prev month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, dNum);
      const mStr = String(prevDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(dNum).padStart(2, '0');
      const dateStr = `${prevDate.getFullYear()}-${mStr}-${dStr}`;
      days.push({
        dateStr,
        dayNumber: dNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: events.filter((e) => e.date === dateStr),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(i).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        events: events.filter((e) => e.date === dateStr),
      });
    }

    // Next month padding to reach 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const mStr = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(i).padStart(2, '0');
      const dateStr = `${nextDate.getFullYear()}-${mStr}-${dStr}`;
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: events.filter((e) => e.date === dateStr),
      });
    }

    return days;
  }, [year, month, events, todayStr]);

  const selectedDateEvents = useMemo(() => {
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: StudyEvent) => {
    setEditingEvent(ev);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (eventData: Omit<StudyEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
  };

  const getTypeBadge = (type: StudyEventType) => {
    switch (type) {
      case 'exam':
        return <span className="badge badge-hard text-[9px]">Exam</span>;
      case 'assignment':
        return <span className="badge badge-medium text-[9px]">Assignment</span>;
      case 'deadline':
        return <span className="badge badge-hard text-[9px]">Deadline</span>;
      default:
        return <span className="badge badge-easy text-[9px]">Study</span>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Study Calendar & Schedules
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Track upcoming exams, deadlines, and designated focus sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-primary self-start sm:self-center text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 space-y-4">
          {/* Calendar Navigation Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <h3 className="font-bold text-base sm:text-lg text-[var(--foreground)]">
              {monthName}
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGoToday}
                className="btn-secondary text-xs px-2.5 py-1"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-white hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-[var(--muted)] pb-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((day) => {
              const isSelected = day.dateStr === selectedDate;

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`min-h-[60px] sm:min-h-[75px] p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 shadow-md shadow-indigo-500/10'
                      : day.isToday
                      ? 'border-amber-500/40 bg-amber-950/20'
                      : day.isCurrentMonth
                      ? 'border-[var(--border)] bg-[var(--surface-muted)] hover:border-slate-600'
                      : 'border-transparent bg-transparent opacity-30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-indigo-300'
                          : day.isToday
                          ? 'text-amber-400 font-extrabold'
                          : 'text-slate-200'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    {day.isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </div>

                  {/* Event indicator dots */}
                  {day.events.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      {day.events.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            e.type === 'exam' || e.type === 'deadline'
                              ? 'bg-rose-400'
                              : e.type === 'assignment'
                              ? 'bg-amber-400'
                              : 'bg-indigo-400'
                          }`}
                        />
                      ))}
                      {day.events.length > 3 && (
                        <span className="text-[9px] text-[var(--muted)] font-mono">
                          +{day.events.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Agenda Pane (1 Col) */}
        <div className="glass-panel p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {selectedDate === todayStr ? 'Today' : selectedDate}
                </h3>
              </div>
              <span className="text-xs text-[var(--muted)]">
                {selectedDateEvents.length} Event{selectedDateEvents.length === 1 ? '' : 's'}
              </span>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="p-8 text-center space-y-2 border border-dashed border-slate-700/60 rounded-xl text-xs text-[var(--muted)]">
                <BookOpen className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="font-semibold text-slate-300">No events on this date</p>
                <p>Plan a study block or schedule an exam reminder.</p>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="btn-secondary text-xs px-3 py-1.5 mt-2"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Event</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
                {selectedDateEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs sm:text-sm text-slate-100 truncate">
                            {ev.title}
                          </h4>
                          {getTypeBadge(ev.type)}
                        </div>
                        {ev.startTime && (
                          <div className="flex items-center gap-1 text-[11px] text-indigo-300">
                            <Clock className="w-3 h-3" />
                            <span>
                              {ev.startTime} {ev.endTime ? `– ${ev.endTime}` : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ev)}
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEvent(ev.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {ev.description && (
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        {ev.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-primary w-full text-xs sm:text-sm py-2.5 mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule on {selectedDate}</span>
          </button>
        </div>
      </div>

      {/* Event Add/Edit Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialEvent={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};
