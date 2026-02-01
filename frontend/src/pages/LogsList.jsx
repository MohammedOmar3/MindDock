import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function LogsList({ onSelectLog }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await api.getDailyLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLog = () => {
    if (selectedDate) {
      onSelectLog(selectedDate);
    }
  };

  if (loading) return <div className="p-8">Loading logs...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-light text-slate-900">Daily Logs</h1>
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm"
        >
          + Create Log
        </button>
      </div>

      {showDatePicker && (
        <div className="mb-8 p-6 border border-slate-200 rounded-lg bg-white shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Select date for new log:</label>
          <div className="flex gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
            />
            <button
              onClick={handleCreateLog}
              disabled={!selectedDate}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
            >
              Create
            </button>
            <button
              onClick={() => setShowDatePicker(false)}
              className="px-6 py-3 bg-slate-400 text-white rounded-lg hover:bg-slate-500 font-medium transition-colors shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="text-slate-500">
          <p>No logs yet. Create one from the dashboard!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <button
              key={log.id}
              onClick={() => onSelectLog(log.date)}
              className="w-full text-left p-5 border border-slate-200 rounded-lg bg-white hover:shadow-md hover:border-slate-300 transition-all"
            >
              <p className="font-semibold text-slate-900">{new Date(log.date).toDateString()}</p>
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                {log.workedOn || '(no content)'}
              </p>
              <p className="text-xs text-slate-500 mt-3">
                Updated: {new Date(log.updatedAt).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
