import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  HardDrive,
  FileCode2,
  Table as TableIcon,
  HelpCircle,
  FileDown,
  Printer,
  Sparkles,
  ListOrdered,
  BookOpen,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import type { Experiment, Subject } from '../types';
import { CodeBlock } from './CodeBlock';
import { QuestionCard } from './QuestionCard';
import { exportExperimentPdf } from '../utils/pdfExport';

interface ExperimentViewProps {
  experiment: Experiment;
  subject: Subject;
  isBookmarked: boolean;
  isReviewed: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleReviewed: (id: string) => void;
  onNavigateHome: () => void;
  onNavigateSubject: (subjectId: string) => void;
  onNavigateExperiment: (expId: string) => void;
  bookmarkedIds: string[];
}

export const ExperimentView: React.FC<ExperimentViewProps> = ({
  experiment,
  subject,
  isBookmarked,
  isReviewed,
  onToggleBookmark,
  onToggleReviewed,
  onNavigateHome,
  onNavigateSubject,
  onNavigateExperiment,
  bookmarkedIds,
}) => {
  const [activeSection, setActiveSection] = useState<string>('aim');

  const currentIndex = subject.experiments.findIndex((e) => e.id === experiment.id);
  const prevExp = currentIndex > 0 ? subject.experiments[currentIndex - 1] : null;
  const nextExp = currentIndex < subject.experiments.length - 1 ? subject.experiments[currentIndex + 1] : null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    exportExperimentPdf(experiment, subject);
  };

  // Table of Contents anchor links
  const tocSections = [
    { id: 'sec-aim', label: 'Aim & Overview' },
    ...(experiment.prerequisites && experiment.prerequisites.length > 0 ? [{ id: 'sec-prereq', label: 'Prerequisites' }] : []),
    ...(experiment.algorithm ? [{ id: 'sec-algo', label: 'Algorithm' }] : []),
    { id: 'sec-code', label: 'Source Code' },
    ...(experiment.lineByLineExplanation && experiment.lineByLineExplanation.length > 0 ? [{ id: 'sec-linebyline', label: 'Code Breakdown' }] : []),
    ...(experiment.dryRun ? [{ id: 'sec-dryrun', label: 'Dry Run' }] : []),
    { id: 'sec-io', label: 'Sample I/O' },
    { id: 'sec-complexity', label: 'Complexity' },
    ...(experiment.vivaQuestions && experiment.vivaQuestions.length > 0 ? [{ id: 'sec-viva', label: 'Viva Questions' }] : []),
    ...(experiment.result || experiment.conclusion ? [{ id: 'sec-result', label: 'Result & Conclusion' }] : []),
    ...(experiment.quickRevision ? [{ id: 'sec-revision', label: 'Quick Revision' }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-8">
      {/* Main Educational Article Column */}
      <article className="flex-1 min-w-0 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 flex-wrap font-mono no-print">
          <button onClick={onNavigateHome} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigateSubject(subject.id)} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            {subject.name}
          </button>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium truncate max-w-[240px] md:max-w-none">
            Exp {experiment.expNumber}: {experiment.title}
          </span>
        </nav>

        {/* Experiment Header & Action Toolbar */}
        <header className="border-b border-slate-200 dark:border-[#1f293d] pb-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                  EXPERIMENT {experiment.expNumber}
                </span>
                {experiment.topic && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#182234] border border-slate-200 dark:border-[#1f293d] text-slate-700 dark:text-slate-300">
                    {experiment.topic}
                  </span>
                )}
                {experiment.sourceReference && (
                  <span className="text-slate-500 dark:text-slate-400">
                    Source: {experiment.sourceReference.docName} (p. {experiment.sourceReference.pageNumber})
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                {experiment.title}
              </h1>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 no-print flex-wrap">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                title="Download this experiment as PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-[#182234] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1f293d] hover:bg-slate-200 dark:hover:bg-[#1f293d] transition-colors"
                title="Print-friendly view"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                onClick={() => onToggleReviewed(experiment.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isReviewed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-[#182234] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1f293d] hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isReviewed ? 'Completed' : 'Mark as completed'}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isReviewed ? 'Reviewed' : 'Mark Done'}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(experiment.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-[#182234] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1f293d] hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark experiment'}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* SECTION 1: AIM & OVERVIEW */}
        <section id="sec-aim" className="mb-10 scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Aim & Objective
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            {experiment.aim}
          </div>

          {experiment.problemStatement && (
            <div className="mt-3 p-3.5 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1f293d] text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white font-medium">Problem Statement: </strong>
              {experiment.problemStatement}
            </div>
          )}
        </section>

        {/* SECTION 2: PREREQUISITES (Educational Conceptual Foundations) */}
        {experiment.prerequisites && experiment.prerequisites.length > 0 && (
          <section id="sec-prereq" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Prerequisites & Core Concepts
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiment.prerequisites.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1.5 flex items-center gap-1.5">
                    <span>{p.concept}</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
                    {p.explanation}
                  </p>
                  {p.example && (
                    <div className="p-2 rounded bg-slate-50 dark:bg-[#070a12] border border-slate-200 dark:border-[#1f293d] text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 font-sans">Example: </span>{p.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: STEP-BY-STEP ALGORITHM */}
        {experiment.algorithm && experiment.algorithm.length > 0 && (
          <section id="sec-algo" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <ListOrdered className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Step-by-Step Algorithm
              </h2>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
              <ol className="space-y-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-none">
                {experiment.algorithm.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* SECTION 4: COMPLETE ORIGINAL PROGRAM */}
        {experiment.codeSnippets && experiment.codeSnippets.length > 0 && (
          <section id="sec-code" className="mb-10 scroll-mt-20">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Complete Source Code
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Exact logic from PDF (Page {experiment.sourceReference?.pageNumber || '1'})
              </span>
            </div>

            {experiment.codeSnippets.map((snip, idx) => (
              <div key={idx} className="mb-4">
                <CodeBlock
                  code={snip.code}
                  language={snip.language}
                  filename={snip.filename}
                />
                {snip.explanation && (
                  <div className="p-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#111827] rounded-b border-x border-b border-slate-200 dark:border-[#1f293d]">
                    <strong className="text-slate-800 dark:text-slate-200 font-medium">Program Note: </strong>
                    {snip.explanation}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* SECTION 5: LINE-BY-LINE / BLOCK-BY-BLOCK EXPLANATION */}
        {experiment.lineByLineExplanation && experiment.lineByLineExplanation.length > 0 && (
          <section id="sec-linebyline" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Code Breakdown & Logic Explanation
              </h2>
            </div>
            <div className="space-y-4">
              {experiment.lineByLineExplanation.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] overflow-hidden shadow-sm"
                >
                  <div className="px-4 py-2 bg-slate-50 dark:bg-[#162032] border-b border-slate-200 dark:border-[#1f293d] flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {item.lineRange}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                      {item.contribution}
                    </span>
                  </div>

                  <div className="p-4 text-xs md:text-sm space-y-2.5">
                    {/* Snippet preview */}
                    <pre className="p-2.5 rounded bg-slate-100 dark:bg-[#070a12] border border-slate-200 dark:border-[#1f293d] font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre">
                      <code>{item.codeSnippet}</code>
                    </pre>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block mb-0.5 text-xs">
                          What it does:
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                          {item.whatItDoes}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block mb-0.5 text-xs">
                          Why it's needed:
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                          {item.whyNeeded}
                        </p>
                      </div>
                    </div>

                    {item.variables && (
                      <div className="pt-1 text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">Variables: </span>
                        {item.variables}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 6: DRY RUN & TRACE */}
        {experiment.dryRun && (
          <section id="sec-dryrun" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <TableIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Dry Run & Execution Trace
              </h2>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
              <div className="mb-4">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  {experiment.dryRun.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {experiment.dryRun.description}
                </p>
                <div className="mt-2 inline-block px-2.5 py-1 rounded bg-slate-100 dark:bg-[#182234] border border-slate-200 dark:border-[#1f293d] font-mono text-xs text-slate-700 dark:text-slate-300">
                  Initial Input: <strong>{experiment.dryRun.initialInput}</strong>
                </div>
              </div>

              {/* Dry Run Trace Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1f293d]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#182234] text-slate-700 dark:text-slate-300 uppercase font-mono font-semibold border-b border-slate-200 dark:border-[#1f293d]">
                    <tr>
                      <th className="px-3.5 py-2.5">Step</th>
                      <th className="px-3.5 py-2.5">Action Performed</th>
                      <th className="px-3.5 py-2.5">State & Variables</th>
                      <th className="px-3.5 py-2.5">Output / Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#1f293d] bg-white dark:bg-[#0c0d12]">
                    {experiment.dryRun.steps.map((s) => (
                      <tr key={s.stepNumber} className="hover:bg-slate-50 dark:hover:bg-[#111827]">
                        <td className="px-3.5 py-2 font-mono font-bold text-blue-600 dark:text-blue-400">
                          #{s.stepNumber}
                        </td>
                        <td className="px-3.5 py-2 font-medium text-slate-800 dark:text-slate-200">
                          {s.action}
                        </td>
                        <td className="px-3.5 py-2 font-mono text-slate-600 dark:text-slate-300">
                          {s.stateOrVariables}
                        </td>
                        <td className="px-3.5 py-2 font-mono text-emerald-600 dark:text-emerald-400">
                          {s.outputOrLog || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                Final Result: <strong>{experiment.dryRun.finalOutput}</strong>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 7: SAMPLE INPUT & OUTPUT */}
        {(experiment.sampleInput || experiment.sampleOutput) && (
          <section id="sec-io" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Sample Input & Output
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiment.sampleInput && (
                <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] p-4 shadow-sm">
                  <h3 className="text-xs uppercase font-mono font-semibold text-slate-500 mb-2">
                    Sample Input Console
                  </h3>
                  <pre className="p-3 rounded-lg bg-slate-50 dark:bg-[#070a12] border border-slate-200 dark:border-[#1f293d] font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {experiment.sampleInput}
                  </pre>
                </div>
              )}

              {experiment.sampleOutput && (
                <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] p-4 shadow-sm">
                  <h3 className="text-xs uppercase font-mono font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                    Verified Execution Output
                  </h3>
                  <pre className="p-3 rounded-lg bg-slate-50 dark:bg-[#070a12] border border-slate-200 dark:border-[#1f293d] font-mono text-xs text-emerald-700 dark:text-emerald-400 whitespace-pre-wrap">
                    {experiment.sampleOutput}
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 8: COMPLEXITY ANALYSIS */}
        <section id="sec-complexity" className="mb-10 scroll-mt-20">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              Complexity Analysis (Time & Space)
            </h2>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1f293d] text-xs font-mono">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-slate-500">Time:</span>
                <span className="text-slate-900 dark:text-white font-bold">{experiment.timeComplexity || 'O(n)'}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1f293d] text-xs font-mono">
                <HardDrive className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-500">Space:</span>
                <span className="text-slate-900 dark:text-white font-bold">{experiment.spaceComplexity || 'O(1)'}</span>
              </div>
            </div>

            {experiment.complexityExplanation && (
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {experiment.complexityExplanation}
              </p>
            )}
          </div>
        </section>

        {/* SECTION 9: VIVA QUESTIONS & ANSWERS */}
        {experiment.vivaQuestions && experiment.vivaQuestions.length > 0 && (
          <section id="sec-viva" className="mb-10 scroll-mt-20">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Viva Voce Questions & Answers
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {experiment.vivaQuestions.length} Questions
              </span>
            </div>

            <div className="space-y-3">
              {experiment.vivaQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  subjectName={subject.name}
                  isBookmarked={bookmarkedIds.includes(q.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 10: RESULT & CONCLUSION */}
        {(experiment.result || experiment.conclusion) && (
          <section id="sec-result" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Result & Conclusion
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiment.result && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
                  <h3 className="text-xs uppercase font-mono font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">
                    Result
                  </h3>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {experiment.result}
                  </p>
                </div>
              )}

              {experiment.conclusion && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
                  <h3 className="text-xs uppercase font-mono font-semibold text-blue-600 dark:text-blue-400 mb-1.5">
                    Conclusion
                  </h3>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {experiment.conclusion}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 11: QUICK REVISION SUMMARY BOX */}
        {experiment.quickRevision && (
          <section id="sec-revision" className="mb-12 scroll-mt-20">
            <div className="p-5 rounded-xl bg-blue-50/60 dark:bg-[#141e33] border border-blue-200 dark:border-blue-900/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200 font-mono">
                  Quick Exam Revision Card
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Key takeaways */}
                <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-blue-100 dark:border-[#1f293d]">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Key Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {experiment.quickRevision.keyTakeaways.map((k, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-500">•</span>
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common pitfalls */}
                <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-blue-100 dark:border-[#1f293d]">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Common Pitfalls
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {experiment.quickRevision.commonPitfalls.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam tips */}
                <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-blue-100 dark:border-[#1f293d]">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Exam & Viva Tips
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {experiment.quickRevision.examTips.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Previous and Next Navigation Footer */}
        <footer className="pt-6 border-t border-slate-200 dark:border-[#1f293d] flex items-center justify-between gap-4 no-print">
          {prevExp ? (
            <button
              onClick={() => onNavigateExperiment(prevExp.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#182234] border border-slate-200 dark:border-[#1f293d] text-xs md:text-sm text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Previous Exp</div>
                <div className="font-medium truncate max-w-[140px] md:max-w-[200px]">
                  Exp {prevExp.expNumber}: {prevExp.title}
                </div>
              </div>
            </button>
          ) : (
            <div></div>
          )}

          {nextExp && (
            <button
              onClick={() => onNavigateExperiment(nextExp.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-[#182234] border border-slate-200 dark:border-[#1f293d] text-xs md:text-sm text-slate-700 dark:text-slate-200 transition-colors text-right shadow-sm"
            >
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Next Exp</div>
                <div className="font-medium truncate max-w-[140px] md:max-w-[200px]">
                  Exp {nextExp.expNumber}: {nextExp.title}
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </footer>
      </article>

      {/* Right-Side Sticky Table of Contents (Desktop) */}
      <aside className="hidden xl:block w-56 shrink-0 no-print">
        <div className="sticky top-20 p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            On this page
          </div>
          <nav className="space-y-1 text-xs">
            {tocSections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(sec.id);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    setActiveSection(sec.id);
                  }
                }}
                className={`block py-1 px-2 rounded font-sans transition-colors ${
                  activeSection === sec.id
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#162032]'
                }`}
              >
                {sec.label}
              </a>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#1f293d] space-y-2">
            <button
              onClick={handleDownloadPdf}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-[#182234] hover:bg-slate-200 dark:hover:bg-[#1f293d] text-slate-700 dark:text-slate-300 text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Friendly</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
