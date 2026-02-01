import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function DailyLogEditor({ date, onSaved }) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadLog();
  }, [date]);

  const loadLog = async () => {
    try {
      const data = await api.getDailyLog(date);
      setLog(data);
    } catch (err) {
      // Log doesn't exist, create it
      const newLog = {
        date,
        workedOn: '',
        blockers: '',
        learned: '',
        tomorrowFocus: ''
      };
      setLog(newLog);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (log.id) {
        // Update existing
        await api.updateDailyLog(log.id, log);
        setMessage('✓ Saved');
      } else {
        // Create new - if conflict, reload and try update
        try {
          const created = await api.createDailyLog(log);
          setLog(created);
          setMessage('✓ Saved');
        } catch (createErr) {
          // If 409 conflict, log already exists - fetch it and update
          if (createErr.status === 409) {
            const existing = await api.getDailyLog(date);
            const updated = await api.updateDailyLog(existing.id, {
              ...existing,
              workedOn: log.workedOn,
              blockers: log.blockers,
              learned: log.learned,
              tomorrowFocus: log.tomorrowFocus
            });
            setLog(updated);
            setMessage('✓ Saved');
          } else {
            throw createErr;
          }
        }
      }
      // Redirect to dashboard after successful save
      setTimeout(() => {
        if (onSaved) onSaved();
      }, 500);
    } catch (err) {
      console.error(err);
      setMessage('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setLog(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-light text-slate-900 mb-2">Daily Log</h1>
      <p className="text-lg text-slate-500 mb-8">{new Date(date).toDateString()}</p>

      <div className="space-y-6 max-w-2xl">
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-3">Worked On</label>
          <textarea
            value={log.workedOn}
            onChange={(e) => handleChange('workedOn', e.target.value)}
            placeholder="What did you work on?"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg h-24 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
          />
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-3">Blockers</label>
          <textarea
            value={log.blockers}
            onChange={(e) => handleChange('blockers', e.target.value)}
            placeholder="What blocked you?"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg h-24 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
          />
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-3">Learned</label>
          <textarea
            value={log.learned}
            onChange={(e) => handleChange('learned', e.target.value)}
            placeholder="What did you learn?"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg h-24 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
          />
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-3">Tomorrow Focus</label>
          <textarea
            value={log.tomorrowFocus}
            onChange={(e) => handleChange('tomorrowFocus', e.target.value)}
            placeholder="What's your focus tomorrow?"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg h-24 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 font-medium transition-colors shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Log'}
          </button>
          {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
