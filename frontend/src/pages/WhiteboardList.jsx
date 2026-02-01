import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function WhiteboardList({ onSelectWhiteboard }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolder, setExpandedFolder] = useState(null);
  const [newWhiteboardTitle, setNewWhiteboardTitle] = useState('');
  const [newWhiteboardFolderId, setNewWhiteboardFolderId] = useState(null);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const data = await api.getWhiteboardFolders();
      setFolders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const folder = await api.createWhiteboardFolder({ name: newFolderName });
      setFolders([...folders, folder]);
      setNewFolderName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateWhiteboard = async (e, folderId) => {
    e.preventDefault();
    if (!newWhiteboardTitle.trim()) return;

    try {
      const wb = await api.createWhiteboard({ 
        title: newWhiteboardTitle, 
        excalidrawJson: '{}',
        folderId 
      });
      
      // Reload folders to get updated data
      loadFolders();
      setNewWhiteboardTitle('');
      setNewWhiteboardFolderId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await api.deleteWhiteboardFolder(id);
      setFolders(folders.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWhiteboard = async (id) => {
    try {
      await api.deleteWhiteboard(id);
      loadFolders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-light text-slate-900 mb-8">Whiteboards</h1>

      {/* Create Folder Form */}
      <form onSubmit={handleCreateFolder} className="mb-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-slate-50"
          />
          <button type="submit" className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm">
            + Folder
          </button>
        </div>
      </form>

      {/* Folders and Files */}
      <div className="space-y-4">
        {folders.length === 0 ? (
          <p className="text-slate-500">No folders yet. Create one to organize your whiteboards.</p>
        ) : (
          folders.map(folder => (
            <div key={folder.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              {/* Folder Header */}
              <div 
                onClick={() => setExpandedFolder(expandedFolder === folder.id ? null : folder.id)}
                className="bg-slate-50 p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{expandedFolder === folder.id ? '📂' : '📁'}</span>
                  <span className="font-semibold text-slate-900">{folder.name}</span>
                  <span className="text-sm text-slate-600">({folder.documents?.length || 0})</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="px-3 py-1.5 text-sm bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>

              {/* Folder Contents */}
              {expandedFolder === folder.id && (
                <div className="bg-white p-5 space-y-3 border-t border-slate-200">
                  {/* Create Whiteboard in Folder */}
                  <form onSubmit={(e) => handleCreateWhiteboard(e, folder.id)} className="p-4 bg-slate-50 rounded-lg flex gap-3">
                    <input
                      type="text"
                      placeholder="New whiteboard..."
                      value={newWhiteboardFolderId === folder.id ? newWhiteboardTitle : ''}
                      onChange={(e) => {
                        setNewWhiteboardTitle(e.target.value);
                        setNewWhiteboardFolderId(folder.id);
                      }}
                      onFocus={() => setNewWhiteboardFolderId(folder.id)}
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-colors bg-white"
                    />
                    <button type="submit" className="px-4 py-2.5 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 font-medium transition-colors shadow-sm">
                      Create
                    </button>
                  </form>

                  {/* Files in Folder */}
                  <div className="space-y-2">
                    {folder.documents && folder.documents.length > 0 ? (
                      folder.documents.map(wb => (
                        <div 
                          key={wb.id}
                          className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:shadow-sm flex items-center justify-between cursor-pointer group transition-all"
                          onClick={() => onSelectWhiteboard(wb.id)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-xl">🎨</span>
                            <span className="font-medium text-slate-900">{wb.title}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWhiteboard(wb.id);
                            }}
                            className="px-3 py-1.5 text-sm bg-slate-400 text-white rounded-lg hover:bg-slate-500 opacity-0 group-hover:opacity-100 transition-all font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">No files in this folder yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
