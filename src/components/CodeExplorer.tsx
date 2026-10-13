import React, { useState } from 'react';
import { ANDROID_SOURCE_FILES, AndroidSourceFile } from '../data/androidSourceFiles';
import JSZip from 'jszip';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidSourceFile>(ANDROID_SOURCE_FILES[2]); // Default to YearlyGoalEntity
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const categories = Array.from(new Set(ANDROID_SOURCE_FILES.map((f) => f.category)));

  const filteredFiles = ANDROID_SOURCE_FILES.filter(
    (f) =>
      f.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Create folder structure inside zip
      const rootFolder = zip.folder('Goalify-Android-Project');

      // Add Readme
      rootFolder?.file(
        'README.md',
        `# Goalify - Yearly & Daily Goal Tracker (Android Native)
Ứng dụng Android Native Offline hoàn toàn theo mô hình Top-Down Goal Setting (Yearly -> Monthly -> Weekly -> Daily).

## Kiến Trúc Dự Án (Clean Architecture)
- **Data Layer**: Room Database (\`GoalDao\`, \`AppDatabase\`, Entities, 1-N Relations)
- **Domain Layer**: Models, \`GoalRepository\` interface, \`CalculateGoalProgressUseCase\`
- **Presentation Layer**: Jetpack Compose (Material 3), ViewModels (\`StateFlow\`, UDF)
- **Monetization**:
  - \`AdMobManager\`: Quản lý Banner Ads & Interstitial Ads khi hoàn thành mục tiêu lớn.
  - \`BillingManager\`: Google Play Billing v6+ In-App Purchase mở khóa Premium.
- **Worker & Backup**:
  - \`DailyReminderWorker\`: WorkManager thông báo offline.
  - \`BackupManager\`: Xuất/nhập file JSON qua Storage Access Framework.
- **Dependency Injection**: Dagger Hilt (\`@HiltViewModel\`, \`DatabaseModule\`, \`RepositoryModule\`).

## Hướng Dẫn Mở Dự Án
1. Mở Android Studio (Ladybug / Koala / Hedgehog).
2. Tạo New Project với Empty Compose Activity hoặc import các file này vào thư mục \`app/src/main/java/com/goalify/tracker/\`.
3. Đồng bộ Gradle và chạy trên máy ảo hoặc thiết bị thật.
`
      );

      // Add each source file
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
      console.error('Error creating zip:', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Terminal size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Android Studio Clean Architecture Explorer
              </h2>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Kotlin &amp; Jetpack Compose
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Trọn bộ mã nguồn Room DB, Hilt, DAO, UseCase, AdMob &amp; Billing Client v6
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Đã sao chép' : 'Copy File'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download size={14} />
            <span>{isZipping ? 'Đang nén ZIP...' : 'Tải ZIP Toàn Bộ Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: File Tree Sidebar & Code Editor View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <div className="w-72 sm:w-80 bg-slate-950/80 border-r border-slate-800 flex flex-col shrink-0">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm file theo tên, layer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Files List grouped by category */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {categories.map((category) => {
              const filesInCategory = filteredFiles.filter((f) => f.category === category);
              if (filesInCategory.length === 0) return null;

              return (
                <div key={category} className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderTree size={12} className="text-indigo-400" />
                    <span>{category}</span>
                  </div>

                  <div className="space-y-0.5">
                    {filesInCategory.map((file) => {
                      const isSelected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCode
                              size={14}
                              className={isSelected ? 'text-indigo-400 shrink-0' : 'text-slate-500 shrink-0'}
                            />
                            <span className="truncate">{file.path.split('/').pop()}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-sans shrink-0">
                            .kt
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Code View */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* File Tab Header */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <span className="px-2 py-0.5 bg-slate-800 rounded-md text-[11px] text-indigo-300">
                {selectedFile.category}
              </span>
              <span className="text-slate-500">•</span>
              <span className="truncate">{selectedFile.path}</span>
            </div>

            <div className="text-[11px] text-slate-400 font-sans hidden sm:block">
              {selectedFile.description}
            </div>
          </div>

          {/* Syntax Display with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#0d1117]">
            <pre className="text-slate-200">
              <code>
                {selectedFile.code.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-white/5">
                    <span className="table-cell select-none pr-4 text-right text-slate-600 text-[11px] w-10">
                      {idx + 1}
                    </span>
                    <span className="table-cell">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
