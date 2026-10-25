import React, { useState } from 'react';
import {
  X,
  FileDown,
  BookOpen,
  CheckCircle2,
  Download,
  Sparkles
} from 'lucide-react';
import type { Subject, Experiment } from '../types';
import { exportSubjectPdf, exportExperimentPdf } from '../utils/pdfExport';

interface PdfStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
}

export const PdfStudyModal: React.FC<PdfStudyModalProps> = ({
  isOpen,
  onClose,
  subjects,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('dsa');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleDownloadSubject = async (subject: Subject) => {
    try {
      setDownloadingId(`subject-${subject.id}`);
      exportSubjectPdf(subject);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  const handleDownloadExperiment = async (subject: Subject, exp: Experiment) => {
    try {
      setDownloadingId(`exp-${exp.id}`);
      exportExperimentPdf(exp, subject);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-[#1f293d] flex items-center justify-between bg-slate-50/50 dark:bg-[#0b0f19]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">
                Study Guides &amp; PDF Exports
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download formatted, print-ready laboratory guides and experiments for offline study
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182234] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Tab Selector */}
        <div className="px-6 pt-4 border-b border-slate-200 dark:border-[#1f293d] flex gap-2 overflow-x-auto">
          {subjects.map((sub) => {
            const isActive = sub.id === selectedSubjectId;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`pb-3 px-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{sub.name}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-[#182234] text-slate-600 dark:text-slate-400">
                  {sub.experiments.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Complete Subject Export Card */}
          <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complete Subject Manual</span>
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-white">
                {currentSubject.name} — Comprehensive Study Guide
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg">
                Includes all {currentSubject.experiments.length} experiments with complete source code,
                algorithms, line-by-line explanations, dry-run tables, sample output, and viva voce questions.
              </p>
            </div>
            <button
              onClick={() => handleDownloadSubject(currentSubject)}
              disabled={downloadingId === `subject-${currentSubject.id}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all shadow-sm shrink-0 disabled:opacity-70"
            >
              {downloadingId === `subject-${currentSubject.id}` ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF…</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Full Guide</span>
                </>
              )}
            </button>
          </div>

          {/* Individual Experiments Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Individual Experiment PDFs ({currentSubject.experiments.length})
              </h4>
              <span className="text-[11px] text-slate-400">
                Click any experiment to generate a standalone PDF
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSubject.experiments.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-[#1f293d] bg-white dark:bg-[#151d2e] hover:border-blue-400 dark:hover:border-blue-600 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#182234] text-blue-600 dark:text-blue-400">
                        Exp {exp.expNumber}
                      </span>
                      {exp.sourceReference?.pageNumber && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          p. {exp.sourceReference.pageNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {exp.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {exp.aim || exp.problemStatement}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadExperiment(currentSubject, exp)}
                    disabled={downloadingId === `exp-${exp.id}`}
                    title="Download this experiment as PDF"
                    className="p-2 rounded-lg bg-slate-50 dark:bg-[#1b263b] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0 border border-slate-200 dark:border-slate-800"
                  >
                    {downloadingId === `exp-${exp.id}` ? (
                      <CheckCircle2 className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <FileDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Offline & Printing Notice */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1f293d] bg-slate-50/70 dark:bg-[#0e1422] text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                A4 Formatting &amp; Offline Accessibility:
              </span>
              <p>
                Generated PDFs use standard A4 layout, clean typography, syntax-aligned code blocks, and page numbers. Once downloaded to your computer or phone, you can open and study them completely offline in Acrobat Reader, Chrome, Apple Books, or print directly on paper.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-[#1f293d] bg-slate-50/50 dark:bg-[#0b0f19]/50 flex items-center justify-between text-xs text-slate-500">
          <span>Source: <strong className="font-mono text-slate-700 dark:text-slate-300">rawasset/dsa</strong> (DSA Experiments – Code Reference.pdf)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-[#1f293d] hover:bg-slate-100 dark:hover:bg-[#182234] text-slate-700 dark:text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
