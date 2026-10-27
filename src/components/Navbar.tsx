import React, { useState } from 'react';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Edit2,
  Check,
  FileDown,
  Sparkles
} from 'lucide-react';
import type { ThemeMode } from '../utils/storage';
import { Logo } from './Logo';

interface NavbarProps {
  siteTitle: string;
  theme: ThemeMode;
  currentView?: string;
  onToggleTheme: () => void;
  onUpdateSiteTitle: (title: string) => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  onNavigateHome: () => void;
  onNavigateSubjects?: () => void;
  onNavigateExperiments?: () => void;
  onNavigateBookmarks: () => void;
  onOpenRevisionModal?: () => void;
  onOpenPdfMenu: () => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  siteTitle,
  theme,
  currentView = 'dashboard',
  onToggleTheme,
  onUpdateSiteTitle,
  onOpenSearch,
  onToggleSidebar,
  onNavigateHome,
  onNavigateSubjects,
  onNavigateExperiments,
  onNavigateBookmarks,
  onOpenRevisionModal,
  onOpenPdfMenu,
  bookmarksCount,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(siteTitle);

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      onUpdateSiteTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#1e293b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger (mobile) + Brand Logo & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162238] md:hidden transition-colors"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            className="flex items-center gap-2.5 cursor-pointer select-none min-w-0 group"
            onClick={onNavigateHome}
          >
            <Logo className="w-8 h-8 shrink-0 transition-transform duration-200 group-hover:scale-105" />

            {isEditingTitle ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                  autoFocus
                  className="bg-white dark:bg-[#182234] text-slate-900 dark:text-white text-sm font-semibold px-2 py-0.5 rounded-lg border border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  title="Save"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 dark:text-white">
                  {siteTitle}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTempTitle(siteTitle);
                    setIsEditingTitle(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-opacity"
                  title="Edit site title"
                  aria-label="Edit site title"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Pills (Desktop, matching reference images) */}
        <nav className="hidden lg:flex items-center gap-1 px-1.5 py-1 rounded-full bg-slate-100/80 dark:bg-[#111c30] border border-slate-200/60 dark:border-[#1e2e4a]">
          <button
            onClick={onNavigateHome}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'dashboard'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#162540]'
            }`}
          >
            Home
          </button>
          <button
            onClick={onNavigateSubjects || onNavigateHome}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'subject'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#162540]'
            }`}
          >
            Subjects
          </button>
          <button
            onClick={onNavigateExperiments || onOpenSearch}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'experiment'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#162540]'
            }`}
          >
            Experiments
          </button>
          <button
            onClick={onNavigateBookmarks}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'bookmarks'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#162540]'
            }`}
          >
            <span>Bookmarks</span>
            {bookmarksCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                currentView === 'bookmarks'
                  ? 'bg-blue-100 text-blue-700 dark:bg-white/20 dark:text-white'
                  : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
              }`}>
                {bookmarksCount}
              </span>
            )}
          </button>
          {onOpenRevisionModal && (
            <button
              onClick={onOpenRevisionModal}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#162540] transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Practice</span>
            </button>
          )}
        </nav>

        {/* Right: Search, Study PDFs, Theme Switcher, Student Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger Bar (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center justify-between w-56 md:w-64 px-3.5 py-2 rounded-full bg-slate-100/90 dark:bg-[#111c30] border border-slate-200/80 dark:border-[#1e2e4a] text-xs text-slate-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-white dark:hover:bg-[#14223b] transition-all shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">Search experiments, topics...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-white dark:bg-[#1a2942] px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-[#223554] text-slate-500 dark:text-slate-400 shadow-xs">
              Ctrl K
            </kbd>
          </button>

          {/* Search Trigger Button (Mobile) */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#162238] transition-colors"
            title="Search"
            aria-label="Open search dialog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Study PDFs Modal Button */}
          <button
            onClick={onOpenPdfMenu}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-[#111c30] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-[#1e2e4a] hover:border-blue-300 dark:hover:border-blue-800 transition-all"
            title="Export & Download Study Guides (PDF)"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>PDFs</span>
          </button>

          {/* Dual Pill Theme Switcher (Matching reference images) */}
          <div
            onClick={onToggleTheme}
            className="cursor-pointer select-none p-1 rounded-full bg-slate-100 dark:bg-[#111c30] border border-slate-200/80 dark:border-[#1e2e4a] flex items-center gap-1 transition-all"
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            role="button"
            aria-label="Toggle theme"
          >
            <div
              className={`p-1.5 rounded-full transition-all ${
                theme === 'light'
                  ? 'bg-white text-amber-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div
              className={`p-1.5 rounded-full transition-all ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Student Avatar Pill (Matching reference image with blue circle 'S') */}
          <div
            onClick={onNavigateBookmarks}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105 select-none"
            title="Student Profile & Bookmarks"
          >
            S
          </div>
        </div>
      </div>
    </header>
  );
};
