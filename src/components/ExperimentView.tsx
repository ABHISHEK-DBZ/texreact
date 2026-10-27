import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Cpu,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Layers,
  Settings,
  ShieldCheck,
  Binary
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
  const [activeSection, setActiveSection] = useState<string>('aim');
  const [modalImage, setModalImage] = useState<ImageModalState | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentIndex = subject.experiments.findIndex((e) => e.id === experiment.id);
  const prevExp = currentIndex > 0 ? subject.experiments[currentIndex - 1] : null;
  const nextExp = currentIndex < subject.experiments.length - 1 ? subject.experiments[currentIndex + 1] : null;

  const handlePrint = () => {
    window.print();
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

  // Helper to parse markdown text with math blocks and bolding
  // Helper to convert raw LaTeX expressions to clean, human-readable mathematical typography
  const cleanMathText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\\mu_n/g, 'μₙ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\epsilon_{ox}/g, 'ε_ox')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\cdot/g, ' · ')
      .replace(/\\approx/g, '≈')
      .replace(/\\le(q)?/g, '≤')
      .replace(/\\ge(q)?/g, '≥')
      .replace(/\\ll/g, '≪')
      .replace(/\\gg/g, '≫')
      .replace(/\\times/g, '×')
      .replace(/\\frac\{1\}\{2\}/g, '½')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
      .replace(/\\left\[/g, '[')
      .replace(/\\right\]/g, ']')
      .replace(/\\left\(/g, '(')
      .replace(/\\right\)/g, ')')
      .replace(/\\overline\{([^}]+)\}/g, '$1̅')
      .replace(/\\bar\{Q\}/g, 'Q̅')
      .replace(/\\bar\{R\}/g, 'R̅')
      .replace(/\\bar\{([^}]+)\}/g, '$1̅')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\quad/g, '   ')
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/k_n'/g, "k'ₙ")
      .replace(/k_n/g, 'kₙ')
      .replace(/k_p'/g, "k'ₚ")
      .replace(/k_p/g, 'kₚ')
      .replace(/C_\{ox\}'/g, "C'ox")
      .replace(/C_\{ox\}/g, 'Cox')
      .replace(/C_{ox}/g, 'Cox')
      .replace(/t_\{ox\}'/g, "t'ox")
      .replace(/t_\{ox\}/g, 'tox')
      .replace(/t_{ox}/g, 'tox')
      .replace(/V_\{GS\}/g, 'V_GS')
      .replace(/V_\{DS\}/g, 'V_DS')
      .replace(/V_\{TO\}/g, 'V_TO')
      .replace(/V_\{DD\}/g, 'V_DD')
      .replace(/V_\{TH\}/g, 'V_TH')
      .replace(/V_{GS}/g, 'V_GS')
      .replace(/V_{DS}/g, 'V_DS')
      .replace(/V_{TO}/g, 'V_TO')
      .replace(/V_{DD}/g, 'V_DD')
      .replace(/V_{TH}/g, 'V_TH')
      .replace(/I_D/g, 'I_D')
      .replace(/\\/g, '');
  };

  // Helper to parse markdown text with math blocks, cards, and bolding
  const renderFormattedTheory = (theoryText: string) => {
    // Normalize newlines before major blocks so they don't congest
    const normalized = theoryText
      .replace(/\r\n/g, '\n')
      .replace(/\n(####\s+)/g, '\n\n$1')
      .replace(/\n(###\s+)/g, '\n\n$1')
      .replace(/\n(---)/g, '\n\n$1\n\n');

    const paragraphs = normalized.split(/\n\s*\n/);

    const renderInlineFormatted = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*|\$.*?\$|`.*?`)/g);
      return parts.map((seg, sIdx) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return (
            <strong key={sIdx} className="font-semibold text-slate-900 dark:text-white">
              {cleanMathText(seg.slice(2, -2))}
            </strong>
          );
        }
        if (seg.startsWith('$') && seg.endsWith('$')) {
          return (
            <code
              key={sIdx}
              className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-[#1a263c] font-mono text-[11px] sm:text-xs text-blue-700 dark:text-blue-300 font-medium border border-blue-200/50 dark:border-blue-900/40"
            >
              {cleanMathText(seg.slice(1, -1))}
            </code>
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
        return cleanMathText(seg);
      });
    };

    return (
      <div className="space-y-4 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        {paragraphs.map((p, pIdx) => {
          const trimmed = p.trim();
          if (!trimmed) return null;

          // Horizontal rule separator
          if (trimmed === '---') {
            return (
              <hr
                key={pIdx}
                className="my-6 border-t border-dashed border-slate-200 dark:border-[#22314d]"
              />
            );
          }

          // H3 Heading (Major Section)
          if (trimmed.startsWith('### ')) {
            return (
              <div
                key={pIdx}
                className="pt-5 pb-2 border-b border-slate-200 dark:border-[#22314d] flex items-center gap-2.5"
              >
                <div className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full shrink-0"></div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono tracking-wide">
                  {cleanMathText(trimmed.replace('### ', ''))}
                </h3>
              </div>
            );
          }

          // H4 Sub-Card (Physical Region, Operating Mode, State Analysis)
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
                    {cleanMathText(header)}
                  </h4>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                  {bodyLines.map((line, lIdx) => {
                    const lTrimmed = line.trim();
                    if (!lTrimmed) return null;

                    // Math equation inside card
                    if (lTrimmed.startsWith('$$') && lTrimmed.endsWith('$$')) {
                      const math = cleanMathText(lTrimmed.slice(2, -2).trim());
                      return (
                        <div
                          key={lIdx}
                          className="my-2.5 p-3 rounded-lg bg-blue-50/90 dark:bg-[#192742] border border-blue-200/80 dark:border-blue-800/60 font-mono text-center text-xs sm:text-sm text-blue-950 dark:text-blue-100 font-semibold shadow-inner overflow-x-auto"
                        >
                          {math}
                        </div>
                      );
                    }

                    // Bullet item inside card
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

                    // Sub-bullet inside card
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

                    // Numbered item inside card
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

          // Math display block ($$ ... $$)
          if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
            const math = cleanMathText(trimmed.slice(2, -2).trim());
            return (
              <div
                key={pIdx}
                className="my-3.5 p-3.5 rounded-xl bg-blue-50/80 dark:bg-[#162238] border border-blue-200 dark:border-blue-900/60 font-mono text-center text-xs md:text-sm text-blue-950 dark:text-blue-200 font-semibold overflow-x-auto shadow-inner"
              >
                {math}
              </div>
            );
          }

          // Markdown Table
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
                            {cleanMathText(h)}
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

          // Bullet list items outside cards
          if (
            trimmed.startsWith('1. ') ||
            trimmed.startsWith('2. ') ||
            trimmed.startsWith('3. ') ||
            trimmed.startsWith('4. ') ||
            trimmed.startsWith('5. ') ||
            trimmed.startsWith('- ') ||
            trimmed.startsWith('* ')
          ) {
            const listItems = trimmed.split('\n');
            return (
              <ul key={pIdx} className="space-y-2 pl-2">
                {listItems.map((item, iIdx) => {
                  const cleaned = item.replace(/^[0-9]+\.\s+/, '').replace(/^[-*]\s+/, '');
                  return (
                    <li key={iIdx} className="flex items-start gap-2.5 text-xs md:text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      <div className="flex-1">{renderInlineFormatted(cleaned)}</div>
                    </li>
                  );
                })}
              </ul>
            );
          }

          // Standard paragraph with bold/code segments
          return (
            <p key={pIdx} className="leading-relaxed">
              {renderInlineFormatted(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  // Table of Contents anchor links
  const tocSections = [
    { id: 'sec-aim', label: 'Aim & Overview' },
    ...(experiment.theory ? [{ id: 'sec-theory', label: 'Theory & Physics' }] : []),
    ...(experiment.prerequisites && experiment.prerequisites.length > 0 ? [{ id: 'sec-prereq', label: 'Prerequisites' }] : []),
    ...(experiment.logicDiagrams && experiment.logicDiagrams.length > 0 ? [{ id: 'sec-schematic', label: 'Circuit Schematics' }] : []),
    ...(experiment.truthTable ? [{ id: 'sec-truthtable', label: 'Truth Table' }] : []),
    ...(experiment.algorithm && experiment.algorithm.length > 0 ? [{ id: 'sec-algo', label: 'Algorithm / Procedure' }] : []),
    ...(experiment.simulationSetup ? [{ id: 'sec-simsetup', label: 'Simulation Setup' }] : []),
    ...(experiment.waveforms && experiment.waveforms.length > 0 ? [{ id: 'sec-waveforms', label: 'Waveform Analysis' }] : []),
    ...(experiment.observationTable ? [{ id: 'sec-observation', label: 'Observation Table' }] : []),
    ...(experiment.codeSnippets && experiment.codeSnippets.length > 0 ? [{ id: 'sec-code', label: 'Netlist / Source Code' }] : []),
    ...(experiment.lineByLineExplanation && experiment.lineByLineExplanation.length > 0 ? [{ id: 'sec-linebyline', label: 'Code Breakdown' }] : []),
    ...(experiment.dryRun ? [{ id: 'sec-dryrun', label: 'Dry Run' }] : []),
    ...((experiment.sampleInput || experiment.sampleOutput) ? [{ id: 'sec-io', label: 'Sample I/O' }] : []),
    ...((experiment.timeComplexity || experiment.spaceComplexity) ? [{ id: 'sec-complexity', label: 'Complexity' }] : []),
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
                {experiment.sourceReference?.docName && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300">
                    <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    Source: {experiment.sourceReference.docName}
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
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

          {experiment.booleanExpression && (
            <div className="mt-3.5 p-3.5 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 dark:from-[#131d33] dark:via-[#162238] dark:to-[#0f172a] border border-blue-200/80 dark:border-blue-900/60 flex items-center gap-3 text-xs md:text-sm text-slate-800 dark:text-blue-100 shadow-sm overflow-x-auto">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 dark:bg-blue-500 text-white font-mono font-bold text-[11px] tracking-wider uppercase shrink-0">
                Governing Equation
              </span>
              <span className="font-mono font-semibold tracking-wide">
                {cleanMathText(experiment.booleanExpression)}
              </span>
            </div>
          )}
        </section>

        {/* SECTION 2: THEORY & DEVICE PHYSICS (for VLSI/Hardware) */}
        {experiment.theory && (
          <section id="sec-theory" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Theory & Fundamental Principles
              </h2>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
              {renderFormattedTheory(experiment.theory)}
            </div>
          </section>
        )}

        {/* SECTION 3: PREREQUISITES */}
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

        {/* SECTION 4: CIRCUIT SCHEMATICS & DIAGRAMS */}
        {experiment.logicDiagrams && experiment.logicDiagrams.length > 0 && (
          <section id="sec-schematic" className="mb-10 scroll-mt-20">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Original Circuit Schematics & Simulation Diagrams
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {experiment.logicDiagrams.length} Schematic{experiment.logicDiagrams.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-6">
              {experiment.logicDiagrams.map((diag, idx) => (
                <div
                  key={diag.id || idx}
                  className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] overflow-hidden shadow-sm"
                >
                  <div className="relative group bg-slate-900 dark:bg-black/80 flex items-center justify-center p-3 sm:p-4 min-h-[220px]">
                    <img
                      src={diag.url}
                      alt={diag.alt || diag.caption}
                      className="max-h-[380px] w-auto max-w-full object-contain rounded transition-transform duration-200 cursor-pointer"
                      onClick={() => openImageModal(diag.url, diag.caption, `Circuit Schematic ${idx + 1}`)}
                    />
                    <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openImageModal(diag.url, diag.caption, `Circuit Schematic ${idx + 1}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-mono border border-slate-700 shadow-lg backdrop-blur"
                        title="Click to view full-resolution image"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-3.5 border-t border-slate-200 dark:border-[#1f293d] bg-slate-50 dark:bg-[#162032] text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <span className="font-medium">{diag.caption}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Components List Table (if provided) */}
            {experiment.componentsList && experiment.componentsList.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
                <h3 className="text-xs uppercase font-mono font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span>Identified Circuit Components & Connections</span>
                </h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1f293d]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#182234] text-slate-700 dark:text-slate-300 uppercase font-mono font-semibold border-b border-slate-200 dark:border-[#1f293d]">
                      <tr>
                        <th className="px-3 py-2">Designator</th>
                        <th className="px-3 py-2">Component Type</th>
                        <th className="px-3 py-2">Value / SPICE Model</th>
                        <th className="px-3 py-2">Circuit Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#1f293d]">
                      {experiment.componentsList.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#111827]">
                          <td className="px-3 py-2 font-mono font-bold text-purple-600 dark:text-purple-400">{c.designator}</td>
                          <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{c.component}</td>
                          <td className="px-3 py-2 font-mono text-blue-600 dark:text-blue-400">{c.value}</td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{c.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* SECTION 5: TRUTH TABLE (for digital / latch experiments) */}
        {experiment.truthTable && (
          <section id="sec-truthtable" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <Binary className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                {experiment.truthTable.title || 'Functional Truth Table & State Transitions'}
              </h2>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1f293d]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#182234] text-slate-700 dark:text-slate-300 uppercase font-mono font-semibold border-b border-slate-200 dark:border-[#1f293d]">
                    <tr>
                      {experiment.truthTable.headers.map((h, idx) => (
                        <th key={idx} className="px-3.5 py-2.5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#1f293d] bg-white dark:bg-[#0c0d12]">
                    {experiment.truthTable.rows.map((row, rIdx) => {
                      const isForbidden = row.some((c) => String(c).toLowerCase().includes('forbidden') || String(c).toLowerCase().includes('invalid'));
                      return (
                        <tr
                          key={rIdx}
                          className={`hover:bg-slate-50 dark:hover:bg-[#111827] ${
                            isForbidden ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                          }`}
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-3.5 py-2 font-mono ${
                                cIdx < 2
                                  ? 'font-bold text-blue-700 dark:text-blue-400'
                                  : isForbidden
                                  ? 'text-rose-700 dark:text-rose-300 font-semibold'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 6: STEP-BY-STEP ALGORITHM / PROCEDURE */}
        {experiment.algorithm && experiment.algorithm.length > 0 && (
          <section id="sec-algo" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <ListOrdered className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Step-by-Step Procedure & Execution
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

        {/* SECTION 7: SIMULATION SETUP & DIRECTIVES */}
        {experiment.simulationSetup && (
          <section id="sec-simsetup" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Simulation Setup & SPICE Directives
              </h2>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Software Environment:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-bold">
                  {experiment.simulationSetup.software}
                </span>
              </div>

              {experiment.simulationSetup.directives && experiment.simulationSetup.directives.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    SPICE Analysis Directives:
                  </h4>
                  <div className="p-3 rounded-lg bg-slate-900 dark:bg-[#070a12] border border-slate-800 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto">
                    {experiment.simulationSetup.directives.map((dir, i) => (
                      <div key={i}>{dir}</div>
                    ))}
                  </div>
                </div>
              )}

              {experiment.simulationSetup.parameters && experiment.simulationSetup.parameters.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Key Input Parameters:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {experiment.simulationSetup.parameters.map((p, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#182234] border border-slate-200 dark:border-[#1f293d]">
                        <div className="flex items-center justify-between font-mono mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                          <span className="text-blue-600 dark:text-blue-400">{p.value}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 8: ORIGINAL OUTPUT WAVEFORMS & SIGNAL ANALYSIS */}
        {experiment.waveforms && experiment.waveforms.length > 0 && (
          <section id="sec-waveforms" className="mb-10 scroll-mt-20">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Original Output Waveforms & Signal Analysis
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {experiment.waveforms.length} Waveform{experiment.waveforms.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-6">
              {experiment.waveforms.map((wave, idx) => (
                <div
                  key={wave.id || idx}
                  className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] overflow-hidden shadow-sm"
                >
                  <div className="relative group bg-slate-950 flex items-center justify-center p-3 sm:p-4 min-h-[220px]">
                    <img
                      src={wave.url}
                      alt={wave.alt || wave.caption}
                      className="max-h-[420px] w-auto max-w-full object-contain rounded transition-transform duration-200 cursor-pointer"
                      onClick={() => openImageModal(wave.url, wave.caption, `Simulation Waveform ${idx + 1}`)}
                    />
                    <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openImageModal(wave.url, wave.caption, `Simulation Waveform ${idx + 1}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-mono border border-slate-700 shadow-lg backdrop-blur"
                        title="Click to view full-resolution waveform"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-3.5 border-t border-slate-200 dark:border-[#1f293d] bg-slate-50 dark:bg-[#162032] text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span className="font-medium">{wave.caption}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trace-by-Trace Analysis Breakdown */}
            {experiment.traceBreakdown && experiment.traceBreakdown.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
                <h3 className="text-xs uppercase font-mono font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Signal-by-Signal Trace Interpretation</span>
                </h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1f293d]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#182234] text-slate-700 dark:text-slate-300 uppercase font-mono font-semibold border-b border-slate-200 dark:border-[#1f293d]">
                      <tr>
                        <th className="px-3 py-2">Signal Label</th>
                        <th className="px-3 py-2">Color</th>
                        <th className="px-3 py-2">Trace Type</th>
                        <th className="px-3 py-2">Observed Behavior & Phase Relation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#1f293d]">
                      {experiment.traceBreakdown.map((tr, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#111827]">
                          <td className="px-3 py-2 font-mono font-bold text-blue-600 dark:text-blue-400">{tr.label}</td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{tr.color}</td>
                          <td className="px-3 py-2 font-mono text-[11px] text-purple-600 dark:text-purple-400">{tr.type}</td>
                          <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{tr.behavior}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* SECTION 9: OBSERVATION TABLE */}
        {experiment.observationTable && (
          <section id="sec-observation" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <TableIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                {experiment.observationTable.title || 'Experimental Observation & Parametric Data'}
              </h2>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#1f293d]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#182234] text-slate-700 dark:text-slate-300 uppercase font-mono font-semibold border-b border-slate-200 dark:border-[#1f293d]">
                    <tr>
                      {experiment.observationTable.headers.map((h, idx) => (
                        <th key={idx} className="px-3.5 py-2.5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#1f293d] bg-white dark:bg-[#0c0d12]">
                    {experiment.observationTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-[#111827]">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-3.5 py-2 font-mono ${
                              cIdx === 0
                                ? 'font-bold text-blue-600 dark:text-blue-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 10: COMPLETE SOURCE CODE / SPICE NETLIST */}
        {experiment.codeSnippets && experiment.codeSnippets.length > 0 && (
          <section id="sec-code" className="mb-10 scroll-mt-20">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  {experiment.codeSnippets[0].language.toLowerCase() === 'spice'
                    ? 'Verified SPICE Simulation Netlist'
                    : 'Complete Source Code'}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {experiment.codeSnippets[0].language.toUpperCase()}
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

        {/* SECTION 11: LINE-BY-LINE EXPLANATION (for software code) */}
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

        {/* SECTION 12: DRY RUN (for algorithm code) */}
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

        {/* SECTION 13: SAMPLE I/O (for programs) */}
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

        {/* SECTION 14: COMPLEXITY ANALYSIS (if relevant) */}
        {(experiment.timeComplexity || experiment.spaceComplexity) && (
          <section id="sec-complexity" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                Complexity Analysis
              </h2>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
              <div className="flex flex-wrap gap-4 mb-3">
                {experiment.timeComplexity && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1f293d] text-xs font-mono">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-500">Time:</span>
                    <span className="text-slate-900 dark:text-white font-bold">{experiment.timeComplexity}</span>
                  </div>
                )}

                {experiment.spaceComplexity && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1f293d] text-xs font-mono">
                    <HardDrive className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-500">Space:</span>
                    <span className="text-slate-900 dark:text-white font-bold">{experiment.spaceComplexity}</span>
                  </div>
                )}
              </div>

              {experiment.complexityExplanation && (
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {experiment.complexityExplanation}
                </p>
              )}
            </div>
          </section>
        )}

        {/* SECTION 15: VIVA VOCE QUESTIONS & ANSWERS */}
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

        {/* SECTION 16: RESULT & CONCLUSION */}
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
                  <h3 className="text-xs uppercase font-mono font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Experimental Result</span>
                  </h3>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {experiment.result}
                  </p>
                </div>
              )}

              {experiment.conclusion && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
                  <h3 className="text-xs uppercase font-mono font-semibold text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Engineering Conclusion</span>
                  </h3>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {experiment.conclusion}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 17: QUICK REVISION SUMMARY BOX */}
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
        <div className="sticky top-20 p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
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

      {/* FULLSCREEN ZOOMABLE IMAGE LIGHTBOX MODAL */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => {
            setModalImage(null);
            setZoomLevel(1);
          }}
        >
          {/* Top Control Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between pb-3 text-white no-print"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-xs font-mono font-bold">
                HIGH RESOLUTION
              </span>
              <span className="text-sm font-semibold truncate max-w-xs md:max-w-md">
                {modalImage.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-xs text-slate-300">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white border-l border-slate-700 ml-0.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setModalImage(null);
                  setZoomLevel(1);
                }}
                className="p-1.5 bg-slate-800 hover:bg-red-600/80 rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Close Viewer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Centered Image Container */}
          <div
            className="w-full max-w-5xl flex-1 flex items-center justify-center overflow-auto rounded-xl bg-slate-950/80 border border-slate-800 p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage.url}
              alt={modalImage.caption}
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease-out' }}
              className="max-h-[75vh] w-auto max-w-full object-contain select-none cursor-grab active:cursor-grabbing"
            />
          </div>

          {/* Bottom Caption Bar */}
          <div
            className="w-full max-w-5xl pt-3 text-center text-xs md:text-sm text-slate-300 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {modalImage.caption}
          </div>
        </div>
      )}
    </div>
  );
};
