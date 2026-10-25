import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  Bookmark,
  FileText,
  Home,
  FileDown
} from 'lucide-react';
import type { Subject } from '../types';

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
    dsa: true,
    python: false,
    mpm: false,
    dvlsi: false,
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
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-black/70 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-64 md:w-72 bg-white dark:bg-[#0b0f19] border-r border-slate-200 dark:border-[#1f293d] flex flex-col transition-all duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Main quick links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigateHome();
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                !currentSubjectId
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032]'
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
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032] transition-colors"
            >
              <FileDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Download Study PDFs</span>
            </button>

            <button
              onClick={() => {
                onNavigateBookmarks();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032] transition-colors"
            >
              <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Saved Bookmarks</span>
            </button>

            <button
              onClick={() => {
                onOpenRevisionModal();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Practice Viva Flashcards</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-[#182234]">
            <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Subjects & Modules</span>
              <span className="text-[10px] font-bold">{subjects.length}</span>
            </div>

            {/* Subject Accordions */}
            <div className="space-y-1">
              {subjects.map((sub) => {
                const isSelectedSub = currentSubjectId === sub.id;
                const isExpanded = expandedSubjects[sub.id] ?? isSelectedSub;

                return (
                  <div key={sub.id} className="rounded-lg overflow-hidden">
                    {/* Subject Header */}
                    <div
                      onClick={() => {
                        onSelectSubject(sub.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                        isSelectedSub && !currentExperimentId
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162032]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#182234] border border-slate-200 dark:border-[#1f293d] text-slate-600 dark:text-slate-400 font-semibold">
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
                      <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-slate-200 dark:border-[#1f293d] ml-3 mt-0.5">
                        {sub.experiments.map((exp) => {
                          const isSelectedExp = currentExperimentId === exp.id;
                          return (
                            <button
                              key={exp.id}
                              onClick={() => {
                                onSelectExperiment(sub.id, exp.id);
                                onClose();
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] font-mono truncate transition-colors flex items-center justify-between ${
                                isSelectedExp
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162032]'
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
        <div className="p-3 border-t border-slate-200 dark:border-[#1f293d] bg-white dark:bg-[#0b0f19]">
          <button
            onClick={() => {
              onOpenUploader();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#182234] border border-slate-200 dark:border-[#1f293d] text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Manage Content</span>
          </button>
        </div>
      </aside>
    </>
  );
};
