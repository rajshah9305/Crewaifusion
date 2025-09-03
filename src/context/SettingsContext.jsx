import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'app_settings_v1';

const defaultSettings = {
  apiKey: '',
  theme: 'dark' // 'dark' | 'light'
};

const SettingsContext = createContext({
  settings: defaultSettings,
  setSettings: () => {}
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw);
      return { ...defaultSettings, ...parsed };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.style.setProperty('--bg', '#f8fafc');
      root.style.setProperty('--fg', '#0f172a');
    } else {
      root.classList.add('dark');
      root.style.setProperty('--bg', '#0f172a');
      root.style.setProperty('--fg', '#e5e7eb');
    }
  }, [settings.theme]);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);

