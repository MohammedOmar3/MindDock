import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await api.getNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const note = await api.createNote({ title: newTitle, content: newContent });
      setNotes([note, ...notes]);
      setNewTitle('');
      setNewContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    const note = notes.find(n => n.id === id);
    try {
      const updated = await api.updateNote(id, { title: note.title, content: note.content });
      setNotes(notes.map(n => n.id === id ? updated : n));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
  };

  const handleChange = (id, field, value) => {
    setNotes(notes.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  if (loading) return <div>Loading notes...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-light text-slate-900 mb-8">Notes</h1>

      <form onSubmit={handleCreate} className="mb-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
        <input
          type="text"
          placeholder="Note title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-3 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
        />
        <textarea
          placeholder="Note content (markdown supported)"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg h-24 mb-4 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
        />
        <button type="submit" className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm">
          Add Note
        </button>
      </form>

      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.id} className="p-6 border border-slate-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
            {editingId === note.id ? (
              <div>
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => handleChange(note.id, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-3 font-semibold focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
                />
                <textarea
                  value={note.content}
                  onChange={(e) => handleChange(note.id, 'content', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg h-24 mb-4 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(note.id)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 font-medium transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-lg text-slate-900 mb-3">{note.title}</h3>
                <div className="prose prose-sm text-slate-700 mb-4">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
                <p className="text-xs text-slate-500 mb-4">{new Date(note.updatedAt).toLocaleString()}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors shadow-sm text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 font-medium transition-colors shadow-sm text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
