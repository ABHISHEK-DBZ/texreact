import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  FileCode2,
  HelpCircle,
  FileDown,
  Printer,
  BookOpen,
  Lightbulb,
  Cpu,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Layers,
  ShieldCheck,
  Binary,
  Search
} from 'lucide-react';
import type { Experiment, Subject } from '../types';
import { CodeBlock } from './CodeBlock';
import { QuestionCard } from './QuestionCard';
import { MathText } from './MathText';
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

interface ImageModalState {
  url: string;
  caption: string;
  title: string;
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
  const [modalImage, setModalImage] = useState<ImageModalState | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [sidebarSearch, setSidebarSearch] = useState<string>('');

  const currentIndex = subject.experiments.findIndex((e) => e.id === experiment.id);
  const prevExp = currentIndex > 0 ? subject.experiments[currentIndex - 1] : null;
  const nextExp = currentIndex < subject.experiments.length - 1 ? subject.experiments[currentIndex + 1] : null;

  const handlePrint = () => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    root.classList.remove('dark');
    window.print();
    root.classList.toggle('dark', wasDark);
  };

  const handleDownloadPdf = () => {
    exportExperimentPdf(experiment, subject);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalImage) {
        setModalImage(null);
        setZoomLevel(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImage]);

  const openImageModal = (url: string, caption: string, title: string) => {
    setModalImage({ url, caption, title });
    setZoomLevel(1);
  };

  // Helper to scroll to section
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to parse markdown text with math blocks, cards, and bolding
  const renderFormattedTheory = (theoryText: string) => {
    const normalized = theoryText
      .replace(/\r\n/g, '\n')
      .replace(/\n(####\s+)/g, '\n\n$1')
      .replace(/\n(###\s+)/g, '\n\n$1')
      .replace(/\n(---)/g, '\n\n$1\n\n');

    const paragraphs = normalized.split(/\n\s*\n/);

    const renderInlineFormatted = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*|\$\$.*?\$\$|\$.*?\$|\*[^*\n]+\*|`.*?`)/g);
      return parts.map((seg, sIdx) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return (
            <strong key={sIdx} className="font-semibold text-slate-900 dark:text-white">
              {renderInlineFormatted(seg.slice(2, -2))}
            </strong>
          );
        }
        if (seg.startsWith('$$') && seg.endsWith('$$') && seg.length > 4) {
          return (
            <span
              key={sIdx}
              className="block my-2.5 py-2 text-center font-serif text-sm sm:text-base text-slate-900 dark:text-slate-100"
            >
              <MathText text={seg.slice(2, -2)} />
            </span>
          );
        }
        if (seg.startsWith('*') && seg.endsWith('*') && seg.length > 2) {
          return (
            <em key={sIdx} className="italic">
              {renderInlineFormatted(seg.slice(1, -1))}
            </em>
          );
        }
        if (seg.startsWith('$') && seg.endsWith('$')) {
          return (
            <span
              key={sIdx}
              className="font-serif px-1 py-0.5 text-slate-900 dark:text-slate-100"
            >
              <MathText text={seg.slice(1, -1)} />
            </span>
          );
        }
        if (seg.startsWith('`') && seg.endsWith('`')) {
          return (
            <code
              key={sIdx}
              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#182234] font-mono text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800"
            >
              {seg.slice(1, -1)}
            </code>
          );
        }
        return <MathText key={sIdx} text={seg} />;
      });
    };

    return (
      <div className="space-y-4 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        {paragraphs.map((p, pIdx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          if (trimmed === '---') {
            return (
              <hr
                key={pIdx}
                className="my-6 border-t border-dashed border-slate-200 dark:border-[#22314d]"
              />
            );
          }

          if (trimmed.startsWith('### ')) {
            return (
              <div
                key={pIdx}
                className="pt-5 pb-2 border-b border-slate-200 dark:border-[#22314d] flex items-center gap-2.5"
              >
                <div className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full shrink-0"></div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono tracking-wide">
                  {trimmed.replace('### ', '')}
                </h3>
              </div>
            );
          }

          if (trimmed.startsWith('#### ')) {
            const lines = trimmed.split('\n');
            const header = lines[0].replace('#### ', '').trim();
            const bodyLines = lines.slice(1);

            return (
              <div
                key={pIdx}
                className="my-4 rounded-xl border border-slate-200/90 dark:border-[#22314d] bg-slate-50/70 dark:bg-[#121c2e] shadow-sm overflow-hidden"
              >
                <div className="px-4 py-3 bg-white/95 dark:bg-[#16233b] border-b border-slate-200/80 dark:border-[#22314d] flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"></span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-mono tracking-wide">
                    {header}
                  </h4>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                  {bodyLines.map((line, lIdx) => {
                    const lTrimmed = line.trim();
                    if (!lTrimmed) return null;

                    if (lTrimmed.startsWith('$$') && lTrimmed.endsWith('$$')) {
                      return (
                        <div
                          key={lIdx}
                          className="my-2.5 p-3 rounded-lg bg-blue-50/90 dark:bg-[#192742] border border-blue-200/80 dark:border-blue-800/60 font-serif text-center text-sm sm:text-base text-slate-900 dark:text-slate-100 font-semibold shadow-inner overflow-x-auto"
                        >
                          <MathText text={lTrimmed.slice(2, -2).trim()} />
                        </div>
                      );
                    }

                    if (lTrimmed.startsWith('- ') || lTrimmed.startsWith('* ')) {
                      const content = lTrimmed.replace(/^[-*]\s+/, '');
                      return (
                        <div
                          key={lIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                          <div className="flex-1">{renderInlineFormatted(content)}</div>
                        </div>
                      );
                    }

                    if (lTrimmed.startsWith('  - ')) {
                      const content = lTrimmed.replace(/^\s+-\s+/, '');
                      return (
                        <div
                          key={lIdx}
                          className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 pl-5"
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                          <div className="flex-1">{renderInlineFormatted(content)}</div>
                        </div>
                      );
                    }

                    if (/^[0-9]+\.\s+/.test(lTrimmed)) {
                      const num = lTrimmed.match(/^[0-9]+/)?.[0] || '•';
                      const content = lTrimmed.replace(/^[0-9]+\.\s+/, '');
                      return (
                        <div
                          key={lIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                        >
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold shrink-0">
                            {num}
                          </span>
                          <div className="flex-1">{renderInlineFormatted(content)}</div>
                        </div>
                      );
                    }

                    return (
                      <p key={lIdx} className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {renderInlineFormatted(lTrimmed)}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
            return (
              <div
                key={pIdx}
                className="my-3.5 p-3.5 rounded-xl bg-blue-50/80 dark:bg-[#162238] border border-blue-200 dark:border-blue-900/60 font-serif text-center text-sm sm:text-base text-slate-900 dark:text-slate-100 font-semibold overflow-x-auto shadow-inner"
              >
                <MathText text={trimmed.slice(2, -2).trim()} />
              </div>
            );
          }

          if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
            const lines = trimmed.split('\n').filter((l) => l.trim().startsWith('|'));
            if (lines.length >= 3) {
              const headers = lines[0]
                .split('|')
                .filter((_, i, arr) => i > 0 && i < arr.length - 1)
                .map((h) => h.trim());
              const rows = lines.slice(2).map((rowLine) =>
                rowLine
                  .split('|')
                  .filter((_, i, arr) => i > 0 && i < arr.length - 1)
                  .map((c) => c.trim())
              );

              return (
                <div key={pIdx} className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f293d] my-3">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#182234] text-slate-700 dark:text-slate-300 uppercase font-mono font-semibold border-b border-slate-200 dark:border-[#1f293d]">
                      <tr>
                        {headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-3.5 py-2.5">
                            <MathText text={h} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#1f293d] bg-white dark:bg-[#0c0d12]">
                      {rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-[#111827]">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3.5 py-2 text-slate-700 dark:text-slate-300">
                              {renderInlineFormatted(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
          }

          return (
            <p key={pIdx} className="leading-relaxed">
              {renderInlineFormatted(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  const filteredSidebarExperiments = useMemo(() => {
    if (!sidebarSearch.trim()) return subject.experiments;
    const q = sidebarSearch.toLowerCase();
    return subject.experiments.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        String(e.expNumber).includes(q) ||
        e.topic?.toLowerCase().includes(q)
    );
  }, [subject.experiments, sidebarSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex gap-8 items-start">
      {/* 1. LEFT STICKY EXPERIMENT LIST SIDEBAR (Matching Reference Image 1 Top-Right & Image 3 Bottom-Left) */}
      <aside className="no-print hidden xl:block w-72 shrink-0 sticky top-20 rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {subject.shortCode} Experiments
            </h3>
            <p className="text-[11px] text-slate-400">
              {subject.experiments.length} Experiments in total
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold">
            Exp {experiment.expNumber}
          </span>
        </div>

        {/* Search input in sidebar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162540] border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Experiment items list */}
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
          {filteredSidebarExperiments.map((e) => {
            const isActive = e.id === experiment.id;
            return (
              <button
                key={e.id}
                onClick={() => onNavigateExperiment(e.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/80 dark:border-blue-900/60 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#162540] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {e.expNumber}
                </span>
                <span className="truncate">{e.title}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 2. MAIN EDUCATIONAL ARTICLE COLUMN */}
      <article className="flex-1 min-w-0 max-w-5xl space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 flex-wrap font-sans no-print">
          <button onClick={onNavigateHome} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigateSubject(subject.id)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {subject.name}
          </button>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[260px] md:max-w-none">
            Exp {experiment.expNumber}: {experiment.title}
          </span>
        </nav>

        {/* Experiment Header & Action Toolbar (Matching Reference Image 1 & 2) */}
        <header className="p-6 rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono font-bold border border-blue-200 dark:border-blue-900/50">
                  {subject.shortCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#162540] text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">
                  Experiment {experiment.expNumber}
                </span>
                {experiment.topic && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    • {experiment.topic}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {experiment.title}
              </h1>

              {experiment.sourceReference?.docName && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified Course Asset: {experiment.sourceReference.docName}</span>
                </div>
              )}
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2 shrink-0 no-print flex-wrap">
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                title="Download complete experiment as PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => onToggleBookmark(experiment.id)}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                    : 'bg-slate-50 dark:bg-[#162540] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                onClick={handlePrint}
                className="p-2.5 rounded-full bg-slate-50 dark:bg-[#162540] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                title="Print Experiment"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleReviewed(experiment.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isReviewed
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-[#162540] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isReviewed ? 'Completed' : 'Mark Done'}</span>
              </button>
            </div>
          </div>

          {/* IN-PAGE STICKY TABS BAR (Matching Reference Image 1 Top-Right Tab Pills) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-print">
            <button
              onClick={() => scrollTo('sec-aim')}
              className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold whitespace-nowrap hover:bg-blue-100 transition-colors"
            >
              Aim & Overview
            </button>
            {experiment.logicDiagrams && experiment.logicDiagrams.length > 0 && (
              <button
                onClick={() => scrollTo('sec-schematic')}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#162540] text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 transition-colors"
              >
                Circuit Diagram
              </button>
            )}
            {experiment.waveforms && experiment.waveforms.length > 0 && (
              <button
                onClick={() => scrollTo('sec-waveforms')}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#162540] text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 transition-colors"
              >
                Waveform
              </button>
            )}
            {experiment.theory && (
              <button
                onClick={() => scrollTo('sec-theory')}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#162540] text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 transition-colors"
              >
                Theory
              </button>
            )}
            {experiment.truthTable && (
              <button
                onClick={() => scrollTo('sec-truthtable')}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#162540] text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 transition-colors"
              >
                Truth Table
              </button>
            )}
            {experiment.codeSnippets && experiment.codeSnippets.length > 0 && (
              <button
                onClick={() => scrollTo('sec-code')}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#162540] text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 transition-colors"
              >
                Source Code / Netlist
              </button>
            )}
            {experiment.result && (
              <button
                onClick={() => scrollTo('sec-result')}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#162540] text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 transition-colors"
              >
                Result & Conclusion
              </button>
            )}
            {experiment.vivaQuestions && experiment.vivaQuestions.length > 0 && (
              <button
                onClick={() => scrollTo('sec-viva')}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#162540] text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap hover:bg-slate-200 transition-colors"
              >
                Viva Voce
              </button>
            )}
          </div>
        </header>

        {/* SECTION 1: AIM & GOVERNING EQUATIONS */}
        <section id="sec-aim" className="p-6 rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-sm space-y-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Aim & Objective
            </h2>
          </div>

          <div className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            <MathText text={experiment.aim} />
          </div>

          {experiment.problemStatement && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162540] border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white font-semibold">Problem Statement: </strong>
              <MathText text={experiment.problemStatement} />
            </div>
          )}

          {experiment.booleanExpression && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 dark:from-[#132038] dark:via-[#162644] dark:to-[#101b2e] border border-blue-200/80 dark:border-blue-900/60 flex items-center gap-3 text-xs sm:text-sm shadow-2xs overflow-x-auto">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono font-bold text-[11px] uppercase tracking-wider shrink-0">
                Governing Equation
              </span>
              <span className="font-serif font-semibold text-slate-900 dark:text-white">
                <MathText text={experiment.booleanExpression} />
              </span>
            </div>
          )}
        </section>
        {/* SECTION 4: 2-COLUMN SPLIT CIRCUIT SCHEMATICS & DIAGRAMS (Matching Reference Image 1 & 2) */}
        {experiment.logicDiagrams && experiment.logicDiagrams.length > 0 && (
          <section id="sec-schematic" className="space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  2. Circuit Schematics & Simulation Diagrams
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {experiment.logicDiagrams.length} Diagram{experiment.logicDiagrams.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Circuit Diagrams (7 cols) */}
              <div className={`${experiment.componentsList && experiment.componentsList.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
                {experiment.logicDiagrams.map((diag, idx) => (
                  <div
                    key={diag.id || idx}
                    className="rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] overflow-hidden shadow-sm"
                  >
                    <div className="relative group bg-slate-900 dark:bg-black/90 flex items-center justify-center p-4 min-h-[260px] print:bg-white">
                      <img
                        src={diag.url}
                        alt={diag.alt || diag.caption}
                        className="max-h-[360px] w-auto max-w-full object-contain rounded-xl transition-transform duration-200 cursor-pointer"
                        onClick={() => openImageModal(diag.url, diag.caption, `Circuit Diagram ${idx + 1}`)}
                      />
                      <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openImageModal(diag.url, diag.caption, `Circuit Diagram ${idx + 1}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-mono border border-slate-700 shadow-lg backdrop-blur-xs cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Inspect Full Size</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-[#1e2e4a] bg-slate-50 dark:bg-[#162540] text-xs font-medium text-slate-700 dark:text-slate-300">
                      {diag.caption}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Circuit Components Table (5 cols) */}
              {experiment.componentsList && experiment.componentsList.length > 0 && (
                <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Circuit Components & Roles</span>
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {experiment.componentsList.map((c, i) => (
                      <div key={i} className="py-2.5 space-y-1">
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-purple-600 dark:text-purple-400">{c.designator}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#162540] text-slate-800 dark:text-slate-200 font-bold">{c.value}</span>
                        </div>
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{c.component}</div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          <MathText text={c.description} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 6: SIMULATION OUTPUT WAVEFORMS & OSCILLOSCOPE (Matching Reference Image 2) */}
        {experiment.waveforms && experiment.waveforms.length > 0 && (
          <section id="sec-waveforms" className="p-6 rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-sm space-y-5 scroll-mt-24">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  3. Simulation Output Waveform & Analysis
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {experiment.waveforms.length} Waveform{experiment.waveforms.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Oscilloscope Waveform Image Display */}
            <div className="space-y-4">
              {experiment.waveforms.map((wave, idx) => (
                <div
                  key={wave.id || idx}
                  className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg"
                >
                  <div className="relative group p-4 flex items-center justify-center min-h-[260px]">
                    <img
                      src={wave.url}
                      alt={wave.alt || wave.caption}
                      className="max-h-[420px] w-auto max-w-full object-contain rounded-lg transition-transform duration-200 cursor-pointer"
                      onClick={() => openImageModal(wave.url, wave.caption, `Simulation Waveform ${idx + 1}`)}
                    />
                    <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openImageModal(wave.url, wave.caption, `Simulation Waveform ${idx + 1}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-mono border border-slate-700 shadow-lg cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Inspect Waveform</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 text-xs font-medium text-slate-300">
                    {wave.caption}
                  </div>
                </div>
              ))}
            </div>

            {/* Signal-by-Signal Trace Analysis Table (Matching Reference Image 2 Bottom) */}
            {experiment.traceBreakdown && experiment.traceBreakdown.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Signal Trace Breakdown & Verification</span>
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#1e2e4a]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#162540] text-slate-700 dark:text-slate-300 uppercase font-mono font-bold border-b border-slate-200 dark:border-[#1e2e4a]">
                      <tr>
                        <th className="px-3.5 py-2.5">Signal</th>
                        <th className="px-3.5 py-2.5">Color</th>
                        <th className="px-3.5 py-2.5">Trace Type</th>
                        <th className="px-3.5 py-2.5">Observed Switching Behavior</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#1e2e4a]">
                      {experiment.traceBreakdown.map((tr, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#162540] transition-colors">
                          <td className="px-3.5 py-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">{tr.label}</td>
                          <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">{tr.color}</td>
                          <td className="px-3.5 py-2.5 font-mono text-purple-600 dark:text-purple-400">{tr.type}</td>
                          <td className="px-3.5 py-2.5 text-slate-800 dark:text-slate-200">
                            <MathText text={tr.behavior} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: THEORY & DEVICE PHYSICS */}
        {experiment.theory && (
          <section id="sec-theory" className="p-6 rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                4. Theory & Fundamental Principles
              </h2>
            </div>
            {renderFormattedTheory(experiment.theory)}
          </section>
        )}

        {/* SECTION 3: PREREQUISITES */}
        {experiment.prerequisites && experiment.prerequisites.length > 0 && (
          <section id="sec-prereq" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Prerequisites & Core Concepts
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiment.prerequisites.map((p, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-2xs space-y-2"
                >
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {p.concept}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <MathText text={p.explanation} />
                  </p>
                  {p.example && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#162540] text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                      <span className="text-slate-400">Example: </span><MathText text={p.example} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: TRUTH TABLE (Matching Reference Image 1 & 2) */}
        {experiment.truthTable && (
          <section id="sec-truthtable" className="p-6 rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Binary className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                5. {experiment.truthTable.title || 'Functional Truth Table'}
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#1e2e4a]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-[#162540] text-slate-700 dark:text-slate-300 uppercase font-mono font-bold border-b border-slate-200 dark:border-[#1e2e4a]">
                  <tr>
                    {experiment.truthTable.headers.map((h, idx) => (
                      <th key={idx} className="px-4 py-3">
                        <MathText text={h} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#1e2e4a] bg-white dark:bg-[#0c1322]">
                  {experiment.truthTable.rows.map((row, rIdx) => {
                    const isForbidden = row.some((c) => String(c).toLowerCase().includes('forbidden') || String(c).toLowerCase().includes('invalid'));
                    return (
                      <tr
                        key={rIdx}
                        className={`hover:bg-slate-50 dark:hover:bg-[#111c30] transition-colors ${
                          isForbidden ? 'bg-rose-50/60 dark:bg-rose-950/20' : ''
                        }`}
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-4 py-2.5 font-mono ${
                              cIdx < 2
                                ? 'font-bold text-blue-700 dark:text-blue-400'
                                : isForbidden
                                ? 'text-rose-700 dark:text-rose-300 font-semibold'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <MathText text={String(cell)} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}


        {/* SECTION 7: SPICE NETLIST / COMPLETE SOURCE CODE */}
        {experiment.codeSnippets && experiment.codeSnippets.length > 0 && (
          <section id="sec-code" className="p-6 rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  6. Verified Simulation Netlist / Source Code
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                {experiment.codeSnippets[0].language.toUpperCase()}
              </span>
            </div>

            {experiment.codeSnippets.map((snip, idx) => (
              <div key={idx}>
                <CodeBlock
                  code={snip.code}
                  language={snip.language}
                  filename={snip.filename}
                />
              </div>
            ))}
          </section>
        )}

        {/* SECTION 8: RESULT & ENGINEERING CONCLUSION (Matching Reference Image 2 Bottom) */}
        {(experiment.result || experiment.conclusion) && (
          <section id="sec-result" className="space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                7. Result & Conclusion
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiment.result && (
                <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Experimental Result</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <MathText text={experiment.result} />
                  </p>
                </div>
              )}

              {experiment.conclusion && (
                <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                    <Lightbulb className="w-4 h-4" />
                    <span>Engineering Conclusion</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <MathText text={experiment.conclusion} />
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 9: VIVA VOCE QUESTIONS & ANSWERS */}
        {experiment.vivaQuestions && experiment.vivaQuestions.length > 0 && (
          <section id="sec-viva" className="p-6 rounded-3xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  8. Viva Voce Questions & Answers
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {experiment.vivaQuestions.length} Questions
              </span>
            </div>

            <div className="space-y-3">
              {experiment.vivaQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  isBookmarked={bookmarkedIds.includes(q.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM PAGINATION CONTROLS (Previous / Next Experiment) */}
        <div className="no-print pt-6 border-t border-slate-200 dark:border-[#1e2e4a] flex items-center justify-between gap-4 flex-wrap">
          {prevExp ? (
            <button
              onClick={() => onNavigateExperiment(prevExp.id)}
              className="px-5 py-2.5 rounded-full bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] hover:border-blue-500 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev: Exp {prevExp.expNumber}</span>
            </button>
          ) : <div />}

          {nextExp && (
            <button
              onClick={() => onNavigateExperiment(nextExp.id)}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer ml-auto"
            >
              <span>Next: Exp {nextExp.expNumber}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </article>

      {/* FULL RESOLUTION IMAGE INSPECTOR MODAL */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="flex items-center justify-between text-white p-2">
            <span className="font-bold text-sm font-mono">{modalImage.title}</span>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModalImage(null)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white ml-2"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img
              src={modalImage.url}
              alt={modalImage.caption}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-150"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="text-center text-xs text-slate-300 p-2 font-mono">
            {modalImage.caption}
          </div>
        </div>
      )}
    </div>
  );
};
