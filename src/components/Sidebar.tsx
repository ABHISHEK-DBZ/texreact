import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  Bookmark,
  FileText,
  Home,
  FileDown,
  X
} from 'lucide-react';
import type { Subject } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  currentSubjectId?: string;
  currentExperimentId?: string;
  onSelectSubject: (subjectId: string) => void;
  onSelectExperiment: (subjectId: string, expId: string) => void;
  onNavigateHome: () => void;
  onNavigateBookmarks: () => void;
  onOpenRevisionModal: () => void;
  onOpenPdfMenu: () => void;
  onOpenUploader: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  subjects,
  currentSubjectId,
  currentExperimentId,
  onSelectSubject,
  onSelectExperiment,
  onNavigateHome,
  onNavigateBookmarks,
  onOpenRevisionModal,
  onOpenPdfMenu,
  onOpenUploader,
}) => {
  const [expandedSubjects, setExpandedSubjects] = useState<{ [key: string]: boolean }>({
    dvlsi: true,
    dsa: true,
    python: false,
    mpm: false,
  });

  const toggleExpand = (subjectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="no-print fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`no-print fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-[#0b1120] border-r border-slate-200/90 dark:border-[#1e293b] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation drawer"
      >
        {/* Drawer Header */}
        <div className="h-16 px-4 border-b border-slate-200/80 dark:border-[#1e293b] flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => {
              onNavigateHome();
              onClose();
            }}
          >
            <Logo className="w-7 h-7 shrink-0" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                StudyHub
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                Engineering Companion
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032] transition-colors"
            title="Close menu"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Main quick links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigateHome();
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                !currentSubjectId
                  ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141e33]'
              }`}
            >
              <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                onOpenPdfMenu();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141e33] transition-colors"
            >
              <FileDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Download Study PDFs</span>
            </button>

            <button
              onClick={() => {
                onNavigateBookmarks();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141e33] transition-colors"
            >
              <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Saved Bookmarks</span>
            </button>

            <button
              onClick={() => {
                onOpenRevisionModal();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141e33] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Practice Viva Flashcards</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-[#182234]">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Subjects &amp; Modules</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400">
                {subjects.length}
              </span>
            </div>

            {/* Subject Accordions */}
            <div className="space-y-1">
              {subjects.map((sub) => {
                const isSelectedSub = currentSubjectId === sub.id;
                const isExpanded = expandedSubjects[sub.id] ?? isSelectedSub;

                return (
                  <div key={sub.id} className="rounded-xl overflow-hidden">
                    {/* Subject Header */}
                    <div
                      onClick={() => {
                        onSelectSubject(sub.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                        isSelectedSub && !currentExperimentId
                          ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#141e33]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-400 font-bold">
                          {sub.shortCode}
                        </span>
                        <span className="truncate">{sub.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                          {sub.experiments.length}
                        </span>
                        <button
                          onClick={(e) => toggleExpand(sub.id, e)}
                          className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-400"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Sub-experiments list */}
                    {isExpanded && sub.experiments.length > 0 && (
                      <div className="pl-3 pr-1 py-1 space-y-0.5 border-l border-slate-200 dark:border-[#1e293b] ml-4 mt-0.5">
                        {sub.experiments.map((exp) => {
                          const isSelectedExp = currentExperimentId === exp.id;
                          return (
                            <button
                              key={exp.id}
                              onClick={() => {
                                onSelectExperiment(sub.id, exp.id);
                                onClose();
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] truncate transition-colors flex items-center justify-between ${
                                isSelectedExp
                                  ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141e33]'
                              }`}
                            >
                              <span className="truncate">
                                Exp {exp.expNumber}: {exp.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200/80 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#0b1120]">
          <button
            onClick={() => {
              onOpenUploader();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white dark:bg-[#111c30] hover:bg-slate-100 dark:hover:bg-[#162540] border border-slate-200/80 dark:border-[#1e2e4a] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Manage Content Library</span>
          </button>
        </div>
      </aside>
    </>
  );
};
