import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bookmark,
  Sun,
  Moon,
  Edit2,
  Check,
  Code2,
  FileDown
} from 'lucide-react';
import type { ThemeMode } from '../utils/storage';

interface NavbarProps {
  siteTitle: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onUpdateSiteTitle: (title: string) => void;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  onNavigateHome: () => void;
  onNavigateBookmarks: () => void;
  onOpenPdfMenu: () => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  siteTitle,
  theme,
  onToggleTheme,
  onUpdateSiteTitle,
  onOpenSearch,
  onToggleSidebar,
  onNavigateHome,
  onNavigateBookmarks,
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1f293d] transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: Menu toggle + Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182234] md:hidden transition-colors"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={onNavigateHome}
          >
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Code2 className="w-4 h-4" />
            </div>

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
                  className="bg-white dark:bg-[#182234] text-slate-900 dark:text-white text-sm font-semibold px-2 py-0.5 rounded border border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  title="Save"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="group flex items-center gap-1.5">
                <span className="font-semibold text-sm md:text-base text-slate-900 dark:text-white tracking-tight">
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

        {/* Center: Search input button */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search experiments, code, questions...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-white dark:bg-[#182234] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#1f293d] text-slate-500 dark:text-slate-400">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#182234]"
            title="Search"
            aria-label="Open search dialog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* PDF Study Guide Export */}
          <button
            onClick={onOpenPdfMenu}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            title="Export / Download Study Guides"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Study PDFs</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onNavigateBookmarks}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] border border-transparent hover:border-slate-200 dark:hover:border-[#1f293d] transition-colors"
            title="Saved Bookmarks"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Bookmarks</span>
            {bookmarksCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button (Sun / Moon) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] border border-slate-200 dark:border-[#1f293d] transition-colors"
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
