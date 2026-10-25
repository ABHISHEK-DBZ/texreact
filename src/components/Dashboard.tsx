import React from 'react';
import {
  Search,
  BookOpen,
  Code2,
  HelpCircle,
  Clock,
  Bookmark,
  ChevronRight,
  Layers,
  ArrowRight,
  Sparkles,
  FileDown,
  FileText
} from 'lucide-react';
import type { Subject, UserProgress } from '../types';
import { exportSubjectPdf } from '../utils/pdfExport';

interface DashboardProps {
  siteTitle: string;
  subjects: Subject[];
  progress: UserProgress;
  onOpenSearch: () => void;
  onSelectSubject: (subjectId: string) => void;
  onSelectExperiment: (subjectId: string, expId: string) => void;
  onNavigateBookmarks: () => void;
  onOpenRevisionModal: () => void;
  onOpenUploader: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  siteTitle,
  subjects,
  progress,
  onOpenSearch,
  onSelectSubject,
  onSelectExperiment,
  onNavigateBookmarks,
  onOpenRevisionModal,
  onOpenUploader,
}) => {
  // Real content calculations
  const totalSubjects = subjects.length;
  const totalExperiments = subjects.reduce((acc, s) => acc + s.experiments.length, 0);
  const totalPrograms = subjects.reduce(
    (acc, s) =>
      acc +
      s.experiments.reduce((pAcc, e) => pAcc + (e.codeSnippets?.length || 0), 0),
    0
  );
  const totalQuestions = subjects.reduce(
    (acc, s) =>
      acc +
      s.questionBank.length +
      s.experiments.reduce(
        (qAcc, e) =>
          qAcc + (e.vivaQuestions?.length || 0) + (e.postExpQuestions?.length || 0),
        0
      ),
    0
  );

  const lastViewed = progress.recentlyViewed[0];
  const lastViewedSubject = lastViewed
    ? subjects.find((s) => s.id === lastViewed.subjectId)
    : null;

  const dsaSubject = subjects.find((s) => s.id === 'dsa');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Hero / Header */}
      <section className="mb-10 text-center md:text-left md:flex md:items-end md:justify-between border-b border-slate-200 dark:border-[#1f293d] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-mono text-blue-700 dark:text-blue-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Engineering Laboratory & Technical Reference Portal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {siteTitle}
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Centralized laboratory manuals, line-by-line program breakdowns, dry run traces, and viva voce questions directly verified against course documents.
          </p>
        </div>

        {/* Quick Revision & Content Actions */}
        <div className="mt-6 md:mt-0 flex items-center justify-center md:justify-end gap-3 flex-wrap">
          {dsaSubject && (
            <button
              onClick={() => exportSubjectPdf(dsaSubject)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm"
              title="Download entire 9-experiment DSA Study Guide"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download DSA PDF</span>
            </button>
          )}

          <button
            onClick={onOpenRevisionModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-[#182234] hover:bg-slate-200 dark:hover:bg-[#1f293d] border border-slate-200 dark:border-[#1f293d] text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Practice Viva</span>
          </button>
        </div>
      </section>

      {/* Global Search Bar (Trigger) */}
      <section className="mb-10">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-blue-500/50 dark:hover:border-blue-500/50 text-left transition-all group shadow-sm"
        >
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span>Search experiments, algorithms, code snippets, or viva questions…</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono text-xs text-slate-400 bg-slate-100 dark:bg-[#182234] px-2 py-1 rounded border border-slate-200 dark:border-[#1f293d]">
            <kbd className="text-slate-600 dark:text-slate-300">Ctrl</kbd>
            <span>+</span>
            <kbd className="text-slate-600 dark:text-slate-300">K</kbd>
          </div>
        </button>
      </section>

      {/* Real Statistics Grid (Never Invented) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-mono tracking-wider">Subjects</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{totalSubjects}</div>
          <div className="text-[11px] text-slate-500 mt-1">Python, DSA, MPM, DVLSI</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-mono tracking-wider">Experiments</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{totalExperiments}</div>
          <div className="text-[11px] text-slate-500 mt-1">9 in DSA (Verified from PDF)</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-mono tracking-wider">Programs</span>
            <Code2 className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">{totalPrograms}</div>
          <div className="text-[11px] text-slate-500 mt-1">Executable source routines</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs uppercase font-mono tracking-wider">Viva & Theory</span>
            <HelpCircle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">{totalQuestions}</div>
          <div className="text-[11px] text-slate-500 mt-1">Curated exam questions</div>
        </div>
      </section>

      {/* Continue Studying Banner */}
      {lastViewed && lastViewedSubject && (
        <section className="mb-10 p-4 rounded-xl bg-white dark:bg-[#111827] border border-blue-200 dark:border-blue-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-blue-600 dark:text-blue-400 font-semibold">
                Continue Studying
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {lastViewed.title}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {lastViewedSubject.name}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectExperiment(lastViewed.subjectId, lastViewed.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#182234] hover:bg-slate-200 dark:hover:bg-[#1f293d] border border-slate-200 dark:border-[#1f293d] text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors self-start sm:self-center"
          >
            <span>Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* Subject Cards */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Subjects & Laboratary Modules
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {subjects.length} active subject{subjects.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub) => {
            const expCount = sub.experiments.length;
            const qCount =
              sub.questionBank.length +
              sub.experiments.reduce(
                (acc, e) =>
                  acc + (e.vivaQuestions?.length || 0) + (e.postExpQuestions?.length || 0),
                0
              );
            const codeCount = sub.experiments.reduce(
              (acc, e) => acc + (e.codeSnippets?.length || 0),
              0
            );

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 dark:bg-[#182234] border border-slate-200 dark:border-[#1f293d] text-blue-700 dark:text-blue-300">
                      {sub.shortCode}
                    </span>
                    {sub.id === 'dsa' ? (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                        9 Exps from PDF Reference
                      </span>
                    ) : !sub.isConfirmedName ? (
                      <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                        Pending verification
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {sub.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#182234] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>{expCount} Exps</span>
                    <span>·</span>
                    <span>{codeCount} Codes</span>
                    <span>·</span>
                    <span>{qCount} Questions</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bookmarks & Study Material Notice */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bookmarked items */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span>Bookmarked Items</span>
            </div>
            <button
              onClick={onNavigateBookmarks}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-mono"
            >
              View All ({progress.bookmarks.length})
            </button>
          </div>

          {progress.bookmarks.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">
              No bookmarks saved yet. Click the bookmark icon on any experiment or viva question to save it for quick review.
            </p>
          ) : (
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 py-1">
              <span className="font-mono text-slate-900 dark:text-white font-bold">{progress.bookmarks.length}</span> item(s) saved for exam revision.
            </div>
          )}
        </div>

        {/* Source of truth notice */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Document Source of Truth</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All DSA experiments are sourced directly from <strong className="text-slate-800 dark:text-slate-200 font-mono">DSA Experiments – Code Reference.pdf</strong> located in <span className="font-mono text-slate-500">raw_assets/dsa/</span>.
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs font-mono text-blue-600 dark:text-blue-400">
            <button onClick={onOpenUploader} className="hover:underline">
              Inspect files & data &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
