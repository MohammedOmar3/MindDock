import { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { api } from '../services/api';

const Excalidraw = lazy(() => 
  import('@excalidraw/excalidraw').then(mod => ({ default: mod.Excalidraw }))
);

export default function WhiteboardEditor({ id, onBack }) {
  const [whiteboard, setWhiteboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const excalidrawDataRef = useRef(null);
  const initialDataRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadWhiteboard();
    } else {
      setLoading(false);
      setWhiteboard({ id: null, title: 'New Whiteboard', excalidrawJson: '{}' });
      initialDataRef.current = { 
        elements: [], 
        appState: { collaborators: new Map() },
        scrollToContent: false
      };
    }
  }, [id]);

  // Auto-save timer
  useEffect(() => {
    if (!hasChanges) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer for 15 seconds
    autoSaveTimerRef.current = setTimeout(() => {
      performAutoSave();
    }, 15000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasChanges, whiteboard, title]);

  const loadWhiteboard = async () => {
    try {
      const data = await api.getWhiteboard(id);
      setWhiteboard(data);
      setTitle(data.title);
      
      // Parse and set initial data once
      if (data.excalidrawJson) {
        try {
          const parsed = JSON.parse(data.excalidrawJson);
          console.log('Loaded whiteboard data:', parsed);
          initialDataRef.current = {
            elements: parsed.elements || [],
            appState: { 
              ...(parsed.appState || {}),
              collaborators: new Map()
            },
            scrollToContent: false
          };
        } catch (e) {
          console.error('Error parsing whiteboard JSON:', e);
          initialDataRef.current = { 
            elements: [], 
            appState: { collaborators: new Map() },
            scrollToContent: false
          };
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const performAutoSave = async () => {
    if (!hasChanges || !excalidrawDataRef.current) return;

    try {
      const dataToSave = excalidrawDataRef.current || { elements: [], appState: {} };
      const json = JSON.stringify(dataToSave);
      
      if (whiteboard?.id) {
        await api.updateWhiteboard(whiteboard.id, { 
          title: title || whiteboard.title, 
          excalidrawJson: json,
          folderId: whiteboard.folderId
        });
      } else {
        const newWb = await api.createWhiteboard({ 
          title: title || 'Untitled Whiteboard', 
          excalidrawJson: json 
        });
        setWhiteboard(newWb);
      }
      
      setMessage('✓ Auto-saved');
      setHasChanges(false);
      setTimeout(() => setMessage(''), 2000);
      console.log('Auto-saved whiteboard');
    } catch (err) {
      console.error('Auto-save failed:', err);
      setMessage('Error auto-saving');
    }
  };

  const handleBlur = () => {
    if (hasChanges) {
      performAutoSave();
    }
  };

  const handleChange = useCallback((elements, appState, files) => {
    console.log('Excalidraw changed:', { elements: elements?.length });
    excalidrawDataRef.current = { elements, appState, files };
    setHasChanges(true);
  }, []);

  if (loading) return <div className="p-6">Loading whiteboard...</div>;

  return (
    <div className="h-screen flex flex-col bg-white" onBlur={handleBlur} tabIndex={0}>
      <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-4 flex-1">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium shadow-sm"
            >
              ← Back
            </button>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasChanges(true);
            }}
            placeholder="Whiteboard title"
            className="text-2xl font-light text-slate-900 border-b border-slate-300 px-3 py-2 focus:outline-none flex-1 bg-transparent"
          />
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && <span className="text-sm text-orange-600 font-medium">● Unsaved changes</span>}
          {message && <span className="text-sm text-green-600 font-medium">{message}</span>}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="p-6">Loading drawing canvas...</div>}>
          <Excalidraw
            initialData={initialDataRef.current || { elements: [], appState: { collaborators: new Map() }, scrollToContent: false }}
            onChange={handleChange}
            viewModeEnabled={false}
            UIOptions={{
              canvasActions: {
                loadScene: false,
              },
            }}
            renderTopRightUI={() => null}
          />
        </Suspense>
      </div>
    </div>
  );
}
