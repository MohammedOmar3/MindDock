import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function DailySummary({ date, onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [log, setLog] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailySummary();
  }, [date]);

  const loadDailySummary = async () => {
    try {
      setLoading(true);

      // Load tasks for this date
      const allTasks = await api.getTasks();
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);

      const dateTasks = allTasks.filter(t => {
        if (t.createdAt) {
          const createdDate = new Date(t.createdAt);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === dateObj.getTime();
        }
        return false;
      });

      // Sort: incomplete tasks first, then done tasks
      const sortedTasks = dateTasks.sort((a, b) => {
        if (a.status === 'Done' && b.status !== 'Done') return 1;
        if (a.status !== 'Done' && b.status === 'Done') return -1;
        return 0;
      });

      setTasks(sortedTasks);

      // Load log for this date
      try {
        const dailyLog = await api.getDailyLog(date);
        setLog(dailyLog);
      } catch (err) {
        setLog(null);
      }

      // Load notes (all notes, not filtered by date for now)
      const allNotes = await api.getNotes();
      setNotes(allNotes.slice(0, 3)); // Show first 3 notes
    } catch (err) {
      console.error('Error loading daily summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const dateDisplay = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="text-center text-gray-500">Loading summary...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-5">{dateDisplay}</h3>

      {/* Daily Log Section */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-700 mb-3 text-sm">Daily Log</h4>
        {log ? (
          <div className="text-sm space-y-2 text-slate-600">
            {log.workedOn && <p><strong className="text-slate-700">Worked on:</strong> {log.workedOn.substring(0, 60)}...</p>}
            {log.blockers && <p><strong className="text-slate-700">Blockers:</strong> {log.blockers.substring(0, 60)}...</p>}
            {log.learned && <p><strong className="text-slate-700">Learned:</strong> {log.learned.substring(0, 60)}...</p>}
            <button
              onClick={() => onNavigate(`logs/${date}`)}
              className="text-xs text-slate-600 hover:text-slate-700 font-medium mt-2 transition-colors"
            >
              Edit log →
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-500 mb-2">No log entry for this date</p>
            <button
              onClick={() => onNavigate(`logs/${date}`)}
              className="text-xs text-slate-600 hover:text-slate-700 font-medium transition-colors"
            >
              Create log →
            </button>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-700 mb-3 text-sm">
          Tasks ({tasks.length})
        </h4>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">No tasks for this date</p>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="text-sm p-3 bg-slate-50 rounded-md border border-slate-200">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-medium text-slate-700">{task.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ${
                    task.status === 'Done' ? 'bg-slate-200 text-slate-700' :
                    task.status === 'Doing' ? 'bg-slate-200 text-slate-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-slate-600 hover:text-slate-700 font-medium mt-2 transition-colors"
            >
              View all tasks →
            </button>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div>
        <h4 className="font-medium text-slate-700 mb-3 text-sm">Recent Notes</h4>
        {notes.length === 0 ? (
          <p className="text-sm text-slate-500">No notes yet</p>
        ) : (
          <div className="space-y-2">
            {notes.map(note => (
              <div key={note.id} className="text-sm p-3 bg-slate-50 rounded-md border border-slate-200">
                <p className="font-medium text-slate-700">{note.title}</p>
                <p className="text-slate-600 text-xs mt-1">{note.content.substring(0, 50)}...</p>
              </div>
            ))}
            <button
              onClick={() => onNavigate('notes')}
              className="text-xs text-slate-600 hover:text-slate-700 font-medium mt-2 transition-colors"
            >
              View all notes →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
