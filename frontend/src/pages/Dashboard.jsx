import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Calendar from '../components/Calendar';
import DailySummary from '../components/DailySummary';
import QuickStats from '../components/QuickStats';

export default function Dashboard({ onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickCapture, setQuickCapture] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [recentWhiteboard, setRecentWhiteboard] = useState(null);

  useEffect(() => {
    loadTodaysTasks();
    loadRecentWhiteboard();
  }, []);

  const loadTodaysTasks = async () => {
    try {
      const allTasks = await api.getTasks();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysTasks = allTasks.filter(t => {
        if (t.status === 'Done') return false;
        if (t.status === 'Doing') return true;
        if (t.dueDate) {
          const dueDate = new Date(t.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        }
        return false;
      });

      setTasks(todaysTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCapture = async (e) => {
    e.preventDefault();
    if (!quickCapture.trim()) return;

    try {
      const result = await api.capture(quickCapture);
      setMessage(`✓ ${result.message}`);
      setQuickCapture('');
      setTimeout(() => setMessage(''), 3000);
      if (result.type === 'task') {
        loadTodaysTasks();
      }
    } catch (err) {
      console.error(err);
      setMessage('Error saving');
    }
  };

  const handleOpenTodayLog = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const log = await api.getDailyLog(today);
      onNavigate(`logs/${today}`);
    } catch (err) {
      try {
        const today_parts = new Date().toISOString().split('T')[0].split('-');
        await api.createDailyLog({
          date: today_parts.join('-'),
          workedOn: '',
          blockers: '',
          learned: '',
          tomorrowFocus: ''
        });
        onNavigate(`logs/${today}`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleNavigateSummary = (path) => {
    onNavigate(path);
  };

  const loadRecentWhiteboard = async () => {
    try {
      const whiteboards = await api.getWhiteboards();
      if (whiteboards && whiteboards.length > 0) {
        const sorted = [...whiteboards].sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt);
          const dateB = new Date(b.updatedAt || b.createdAt);
          return dateB - dateA;
        });
        setRecentWhiteboard(sorted[0]);
      }
    } catch (err) {
      console.error('Error loading recent whiteboard:', err);
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-light text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-500 text-lg">{todayDate}</p>
      </div>

      <QuickStats />

      <form onSubmit={handleQuickCapture} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-3">Quick Capture</label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="todo Fix login bug | note Remember to test | Random thought..."
            value={quickCapture}
            onChange={(e) => setQuickCapture(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
          />
          <button type="submit" className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm">
            Capture
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
      </form>

      <div className="flex gap-3 mb-8">
        <button
          onClick={handleOpenTodayLog}
          className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors shadow-sm"
        >
          Open Today's Log
        </button>

        {recentWhiteboard && (
          <button
            onClick={() => onNavigate('whiteboard-editor', { id: recentWhiteboard.id })}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors shadow-sm"
          >
            Open Recent Whiteboard
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
        </div>
        <div className="col-span-2">
          <DailySummary date={selectedDate} onNavigate={handleNavigateSummary} />
        </div>
      </div>
    </div>
  );
}
