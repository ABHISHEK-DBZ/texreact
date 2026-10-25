import React, { useState, useMemo } from 'react';
import { X, Sparkles, Eye, EyeOff, ChevronRight, RotateCcw, HelpCircle } from 'lucide-react';
import type { Subject, QuestionItem } from '../types';

interface RevisionQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
}

export const RevisionQuizModal: React.FC<RevisionQuizModalProps> = ({
  isOpen,
  onClose,
  subjects,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Pool questions from actual uploaded question bank & experiments
  const pool = useMemo(() => {
    const list: { q: QuestionItem; subjectName: string }[] = [];

    subjects.forEach((s) => {
      if (selectedSubjectId !== 'all' && s.id !== selectedSubjectId) return;

      s.questionBank.forEach((q) => {
        list.push({ q, subjectName: s.name });
      });

      s.experiments.forEach((e) => {
        (e.vivaQuestions || []).forEach((q) => {
          list.push({ q, subjectName: s.name });
        });
        (e.postExpQuestions || []).forEach((q) => {
          list.push({ q, subjectName: s.name });
        });
      });
    });

    return list;
  }, [subjects, selectedSubjectId]);

  if (!isOpen) return null;

  const currentItem = pool[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < pool.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setReviewedCount(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#1f293d] flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Viva &amp; Rapid Revision Flashcards
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182234]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0c101d] border-b border-slate-200 dark:border-[#1f293d] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setCurrentIndex(0);
                setShowAnswer(false);
              }}
              className="bg-white dark:bg-[#182234] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1f293d] rounded px-2 py-0.5 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortCode}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            {reviewedCount > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">({reviewedCount} reviewed)</span>
            )}
            <span>Card {pool.length > 0 ? currentIndex + 1 : 0} of {pool.length}</span>
          </div>
        </div>

        {/* Question Card Content */}
        <div className="p-6 flex-1 min-h-[220px] flex flex-col justify-center">
          {pool.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                No questions found in this category yet.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 mb-3">
                <span className="font-semibold">{currentItem.subjectName}</span>
                {currentItem.q.category && (
                  <span className="text-slate-400">· {currentItem.q.category}</span>
                )}
              </div>

              <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed mb-6">
                {currentItem.q.question}
              </h2>

              {showAnswer ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c101d] border border-slate-200 dark:border-[#1f293d] text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
                  <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    Verified Answer:
                  </div>
                  {currentItem.q.answer}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAnswer(true);
                    setReviewedCount((prev) => prev + 1);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-[#182234] hover:bg-slate-200 dark:hover:bg-[#1f293d] border border-slate-200 dark:border-[#1f293d] text-xs font-mono font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Reveal Verified Answer</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        {pool.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-[#1f293d] bg-slate-50/50 dark:bg-[#0c101d] flex items-center justify-between">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-3">
              {showAnswer && (
                <button
                  onClick={() => setShowAnswer(false)}
                  className="flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-mono font-medium text-white transition-colors shadow-sm"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
