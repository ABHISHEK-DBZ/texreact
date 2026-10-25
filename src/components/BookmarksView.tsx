import React, { useState } from 'react';
import { Bookmark, Trash2, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';
import type { Subject, UserProgress } from '../types';

interface BookmarksViewProps {
  subjects: Subject[];
  progress: UserProgress;
  onToggleBookmark: (id: string) => void;
  onSelectExperiment: (subjectId: string, expId: string) => void;
  onNavigateHome: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  subjects,
  progress,
  onToggleBookmark,
  onSelectExperiment,
  onNavigateHome,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Find all bookmarked items
  const bookmarkedItems: {
    id: string;
    type: 'experiment' | 'question';
    subjectId: string;
    subjectName: string;
    title: string;
    subtitle?: string;
    experimentId?: string;
  }[] = [];

  subjects.forEach((subj) => {
    // 1. Check experiments
    subj.experiments.forEach((exp) => {
      if (progress.bookmarks.includes(exp.id)) {
        bookmarkedItems.push({
          id: exp.id,
          type: 'experiment',
          subjectId: subj.id,
          subjectName: subj.name,
          title: `Exp ${exp.expNumber}: ${exp.title}`,
          subtitle: exp.aim,
          experimentId: exp.id,
        });
      }

      // Check viva / post-exp
      const qList = [...(exp.vivaQuestions || []), ...(exp.postExpQuestions || [])];
      qList.forEach((q) => {
        if (progress.bookmarks.includes(q.id)) {
          bookmarkedItems.push({
            id: q.id,
            type: 'question',
            subjectId: subj.id,
            subjectName: subj.name,
            title: q.question,
            subtitle: `Exp ${exp.expNumber} — ${q.answer.slice(0, 140)}...`,
            experimentId: exp.id,
          });
        }
      });
    });

    // 2. Check general question bank
    subj.questionBank.forEach((q) => {
      if (progress.bookmarks.includes(q.id)) {
        bookmarkedItems.push({
          id: q.id,
          type: 'question',
          subjectId: subj.id,
          subjectName: subj.name,
          title: q.question,
          subtitle: q.answer.slice(0, 140) + '...',
          experimentId: q.experimentId,
        });
      }
    });
  });

  const filtered = bookmarkedItems.filter(
    (b) => subjectFilter === 'all' || b.subjectId === subjectFilter
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4 font-mono">
        <button onClick={onNavigateHome} className="hover:text-blue-600 dark:hover:text-white transition-colors">
          Home
        </button>
        <span>/</span>
        <span className="text-blue-600 dark:text-blue-400 font-medium">Bookmarks &amp; Saved Questions</span>
      </nav>

      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Saved Bookmarks</span>
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-600 dark:text-slate-400">
            Quick reference collection saved across your browser sessions.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-[#182234] border border-slate-200 dark:border-[#1f293d] text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Subjects ({bookmarkedItems.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shortCode}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookmarks List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No items bookmarked yet in this view.
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse through experiments or questions and click the bookmark icon to save key material for exam revision.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start justify-between gap-4 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{item.subjectName}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 uppercase">
                    {item.type === 'experiment' ? (
                      <>
                        <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Experiment
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Question / Viva
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.experimentId && (
                  <button
                    onClick={() => onSelectExperiment(item.subjectId, item.experimentId!)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#182234] hover:bg-slate-100 dark:hover:bg-[#1f293d] border border-slate-200 dark:border-[#1f293d] text-xs font-mono font-medium text-slate-700 dark:text-slate-300 transition-colors"
                    title="Go to experiment"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={() => onToggleBookmark(item.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
