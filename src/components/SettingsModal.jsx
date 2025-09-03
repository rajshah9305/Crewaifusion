import React, { useEffect, useState } from 'react';
import { X, Save, KeyRound, Eye, EyeOff, Sun, Moon, Trash2, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, setSettings } = useSettings();
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [theme, setTheme] = useState(settings.theme || 'dark');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(settings.apiKey || '');
      setTheme(settings.theme || 'dark');
      setSaved(false);
      const handleEsc = e => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose, settings.apiKey, settings.theme]);

  const handleSave = () => {
    setSettings(prev => ({ ...prev, apiKey: apiKey.trim(), theme }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleClear = () => {
    setApiKey('');
    setSettings(prev => ({ ...prev, apiKey: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 modal-backdrop" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-xl mx-4">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Google Gemini API Key</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full pl-9 pr-9 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-200"
                  onClick={() => setShowKey(s => !s)}
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button onClick={handleClear} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Your key is stored locally in your browser only. Get a key from{' '}
              <a className="underline" href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer">Google MakerSuite</a>.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-2 rounded-lg border ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800'}`}
                title="Dark"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-2 rounded-lg border ${theme === 'light' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800'}`}
                title="Light"
              >
                <Sun className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-700 flex items-center justify-between">
          <div className={`flex items-center gap-2 text-sm ${saved ? 'text-green-400' : 'text-transparent'}`}>
            <CheckCircle2 className={`w-4 h-4 ${saved ? 'opacity-100' : 'opacity-0'}`} />
            <span>Saved</span>
          </div>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium inline-flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

