import { motion } from 'motion/react';
import { Sparkles, Play, Search, Save, FolderOpen, Download, Menu } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CommandPalette } from './CommandPalette';
import { NotificationsDropdown } from './NotificationsDropdown';

export function TopBar() {
  const store = useAppStore();
  const { sawType, mode, setSawType, setMode, aiPrompt, setAiPrompt, isOptimizing, runOptimization, isSidebarOpen, setSidebarOpen } = store;
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveProject = () => {
    const stateStr = localStorage.getItem('smart-raskroi-storage');
    if (!stateStr) return;
    const blob = new Blob([stateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        localStorage.setItem('smart-raskroi-storage', content);
        window.location.reload(); // Reload to restore state
      } catch (err) {
        console.error('Failed to load project', err);
        alert('ფაილის წაკითხვა ვერ მოხერხდა.');
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="h-16 md:h-20 glass-panel border-b-0 border-slate-800/80 px-4 md:px-6 flex items-center justify-between z-20 relative shadow-lg shrink-0">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3">
            <button 
                className="lg:hidden p-2 text-slate-400 hover:text-slate-200 z-50 relative"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSidebarOpen(!isSidebarOpen);
                }}
            >
                <Menu className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-white/10 text-white font-bold text-lg md:text-xl relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full animate-[shimmer_2s_infinite] skew-x-12" />
              S
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-tight drop-shadow-md">Smart რასკროი</h1>
              <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> BETA 2026
              </span>
            </div>
        </div>

        <div className="h-8 w-px bg-slate-800 mx-2 hidden lg:block" />

        <div className="flex items-center gap-2">
            <button
               onClick={handleSaveProject}
               className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
               title="პროექტის შენახვა"
            >
               <Save className="w-4 h-4" />
            </button>
            <button
               onClick={() => fileInputRef.current?.click()}
               className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
               title="პროექტის ჩატვირთვა"
            >
               <FolderOpen className="w-4 h-4" />
            </button>
            <input 
               type="file" 
               accept=".json" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleLoadProject} 
            />
        </div>

        {/* Search Trigger */}
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-slate-300 text-slate-500 px-3 py-1.5 rounded-lg text-sm transition-all shadow-inner relative group"
        >
          <Search className="w-4 h-4" />
          <span>ძიება</span>
          <kbd className="bg-slate-950 border border-slate-700 rounded px-1.5 text-[10px] font-mono ml-2 font-semibold text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">⌘K</kbd>
        </button>

        {/* Saw Type Toggle */}
        <div className="hidden lg:flex bg-slate-950/80 rounded-lg p-1 border border-slate-800/80 shadow-inner">
            <button onClick={() => setSawType('horizontal')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${sawType === 'horizontal' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>H-დაზგა</button>
            <button onClick={() => setSawType('vertical')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${sawType === 'vertical' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>V-დაზგა</button>
        </div>

        {/* Mode Segments */}
        <div className="hidden md:flex bg-slate-950/80 rounded-lg p-1 border border-slate-800/80 relative shadow-inner">
            {['eco', 'speed', 'smart'].map((m) => (
              <button key={m} onClick={() => setMode(m as any)} className="relative px-5 py-1.5 rounded-md text-sm capitalize font-medium z-10 transition-colors">
                {mode === m && (
                  <motion.div layoutId="mode-bg" className="absolute inset-0 bg-blue-500/15 border border-blue-500/40 rounded-md -z-10 shadow-[0_0_10px_rgba(59,130,246,0.1)]" transition={{ type: 'spring', duration: 0.5 }} />
                )}
                <span className={mode === m ? 'text-blue-300 drop-shadow' : 'text-slate-500'}>
                  {m === 'eco' && 'ეკო'}
                  {m === 'speed' && 'სწრაფი'}
                  {m === 'smart' && 'ჭკვიანი'}
                </span>
              </button>
            ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end max-w-2xl ml-4 md:ml-8">
          {/* AI Prompt Input */}
          <div className="relative flex-1 group hidden sm:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-fuchsia-500 to-indigo-500 rounded-xl blur opacity-20 group-focus-within:opacity-60 transition duration-500" />
            <div className="relative flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 ring-1 ring-white/5 focus-within:border-fuchsia-500/50 transition-colors shadow-inner">
                <Sparkles className="w-5 h-5 ml-1 mr-3 shrink-0 text-fuchsia-400 opacity-80 group-focus-within:opacity-100 group-focus-within:animate-pulse" />
                <input
                  type="text"
                  className="bg-transparent border-none outline-none text-slate-200 w-full placeholder:text-slate-600 text-sm h-6"
                  placeholder="✨ ნარჩენები მარჯვნივ მოაქციე..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
            </div>
          </div>

          <button 
            disabled={isOptimizing}
            onClick={runOptimization}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold transition-all ${isOptimizing ? 'bg-indigo-50/50 text-indigo-900/50 cursor-not-allowed scale-100 shadow-none' : 'bg-indigo-50 hover:bg-white text-indigo-950 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]'} shrink-0`}
          >
            <Play className={`w-4 h-4 fill-current ${isOptimizing ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{isOptimizing ? 'მიმდინარეობს...' : 'ოპტიმიზაცია'}</span>
            <span className="sm:hidden">{isOptimizing ? '...' : 'ჭრა'}</span>
          </button>
          
          <NotificationsDropdown />
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </header>
  );
}
