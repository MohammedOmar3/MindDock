import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Calendar({ onDateSelect, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [datesWithLogs, setDatesWithLogs] = useState(new Set());
  const [datesWithTasks, setDatesWithTasks] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatesWithData();
  }, [currentMonth]);

  const loadDatesWithData = async () => {
    try {
      setLoading(true);
      const logs = await api.getDailyLogs();
      const tasks = await api.getTasks();

      // Extract dates from logs
      const logDates = new Set(
        logs.map(log => new Date(log.date).toISOString().split('T')[0])
      );

      // Extract unique dates from tasks by creation date
      const taskDates = new Set(
        tasks
          .filter(t => t.createdAt)
          .map(t => new Date(t.createdAt).toISOString().split('T')[0])
      );

      setDatesWithLogs(logDates);
      setDatesWithTasks(taskDates);
    } catch (err) {
      console.error('Error loading calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = selected.toISOString().split('T')[0];
    onDateSelect(dateStr);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
        >
          ← Prev
        </button>
        <h3 className="text-base font-semibold text-slate-900">{monthYear}</h3>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
        >
          Next →
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-500 py-8 text-sm">Loading calendar...</div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-xs text-slate-600 py-2">
              {day}
            </div>
          ))}

          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square"></div>;
            }

            const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              .toISOString()
              .split('T')[0];

            const hasLog = datesWithLogs.has(dateStr);
            const hasTask = datesWithTasks.has(dateStr);
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const isFuture = new Date(dateStr) > new Date(today);
            const isPast = new Date(dateStr) < new Date(today);

            // Determine background color
            let bgColor = 'bg-white';
            if (!isFuture) { // Only color past and today
              if (isToday && !hasLog) {
                bgColor = 'bg-amber-50'; // Today without log
              } else if (isPast && hasLog) {
                bgColor = 'bg-green-50'; // Past day with log
              } else if (isPast && !hasLog) {
                bgColor = 'bg-red-50'; // Past day without log
              }
            }

            let borderColor = 'border-slate-200';
            if (isToday) {
              borderColor = 'border-slate-400';
            }

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square rounded-md text-sm font-medium relative transition-all duration-150
                  ${bgColor}
                  ${borderColor} border
                  ${isSelected ? 'shadow-sm ring-1 ring-slate-300' : 'hover:shadow-sm'}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-slate-700">{day}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {hasLog && <div className="w-1 h-1 bg-slate-400 rounded-full"></div>}
                    {hasTask && <div className="w-1 h-1 bg-slate-300 rounded-full"></div>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-xs text-slate-600 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
          <span>Has log</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
          <span>Has tasks</span>
        </div>
      </div>
    </div>
  );
}
