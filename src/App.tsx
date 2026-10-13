/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoalProvider } from './context/GoalContext';
import { AndroidFrame } from './components/AndroidFrame';
import { CodeExplorer } from './components/CodeExplorer';
import { ArchitectureView } from './components/ArchitectureView';
import {
  Smartphone,
  Code2,
  Layers,
  Download,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Sparkles,
  Terminal,
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_SOURCE_FILES } from './data/androidSourceFiles';

type MainViewMode = 'SIMULATOR' | 'CODE' | 'ARCHITECTURE';

export default function App() {
  const [viewMode, setViewMode] = useState<MainViewMode>('SIMULATOR');
  const [deviceMode, setDeviceMode] = useState<'PHONE' | 'EXPANDED'>('PHONE');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsExportingZip(true);
      const zip = new JSZip();
      const rootFolder = zip.folder('Goalify-Android-Project');

      rootFolder?.file(
        'README.md',
        `# Goalify - Yearly & Daily Goal Tracker (Android Native)
Thiết kế theo mô hình Top-Down Goal Setting (Yearly -> Monthly -> Weekly -> Daily Tasks).
Hoàn toàn Offline (Room Database, WorkManager, Google Play Billing v6, Google AdMob).`
      );

      ANDROID_SOURCE_FILES.forEach((file) => {
        rootFolder?.file(file.path, file.code);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Goalify_Android_Clean_Architecture.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <GoalProvider>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
        {/* Top Navigation Bar */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-40 shrink-0">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Goalify
                </span>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Android Native Offline
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                Top-Down Goal Setting • Jetpack Compose • Room DB • Clean Architecture
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('SIMULATOR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'SIMULATOR'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone size={15} />
              <span>Màn Hình App</span>
            </button>

            <button
              onClick={() => setViewMode('CODE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'CODE'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 size={15} />
              <span>Mã Nguồn Kotlin</span>
            </button>

            <button
              onClick={() => setViewMode('ARCHITECTURE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'ARCHITECTURE'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={15} />
              <span className="hidden sm:inline">Kiến Trúc &amp; DB</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {viewMode === 'SIMULATOR' && (
              <button
                onClick={() => setDeviceMode((m) => (m === 'PHONE' ? 'EXPANDED' : 'PHONE'))}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex"
                title={deviceMode === 'PHONE' ? 'Xem chế độ toàn màn hình' : 'Xem dạng khung điện thoại Pixel'}
              >
                {deviceMode === 'PHONE' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Chuyển chế độ Sáng / Tối"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={handleDownloadAllZip}
              disabled={isExportingZip}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <Download size={14} />
              <span className="hidden md:inline">{isExportingZip ? 'Đang nén...' : 'Tải Code Android (.zip)'}</span>
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 flex overflow-hidden">
          {viewMode === 'SIMULATOR' && (
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-slate-200/70 dark:bg-slate-950">
              <AndroidFrame deviceMode={deviceMode} />
            </div>
          )}

          {viewMode === 'CODE' && (
            <div className="flex-1 overflow-hidden">
              <CodeExplorer />
            </div>
          )}

          {viewMode === 'ARCHITECTURE' && (
            <div className="flex-1 overflow-hidden">
              <ArchitectureView />
            </div>
          )}
        </main>
      </div>
    </GoalProvider>
  );
}
