import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, AlertCircle, FileText, Code2 } from 'lucide-react';
import type { QuestionItem } from '../types';
import { CodeBlock } from './CodeBlock';

interface QuestionCardProps {
  question: QuestionItem;
  subjectName?: string;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  defaultExpanded?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  subjectName,
  isBookmarked,
  onToggleBookmark,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const isNotFound = question.answer.toLowerCase().includes('answer not found') || question.reviewNeeded;

  return (
    <div
      id={`question-${question.id}`}
      className="my-3 rounded-xl border border-slate-200 dark:border-[#1f293d] bg-white dark:bg-[#111827] transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm overflow-hidden"
    >
      {/* Header / Question bar */}
      <div
        className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-[#151d2e]/60 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1">
          {question.questionNumber && (
            <span className="shrink-0 px-2 py-0.5 text-xs font-mono font-semibold rounded bg-slate-100 dark:bg-[#182234] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1f293d]">
              Q{question.questionNumber}
            </span>
          )}

          <div className="flex-1">
            <h4 className="text-sm md:text-base font-semibold text-slate-900 dark:text-white leading-snug">
              {question.question}
            </h4>

            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
              {subjectName && (
                <span className="text-blue-600 dark:text-blue-400 font-mono font-medium">{subjectName}</span>
              )}
              {question.category && (
                <span className="capitalize px-1.5 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-[#182234] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1f293d]">
                  {question.category}
                </span>
              )}
              {question.sourceDoc && (
                <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                  <FileText className="w-3 h-3" />
                  {question.sourceDoc} {question.pageNumber ? `(p. ${question.pageNumber})` : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleBookmark(question.id)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#182234] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-blue-600 fill-blue-600/20" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#182234] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            title={expanded ? 'Collapse answer' : 'Expand answer'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Answer Body */}
      {expanded && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-200 dark:border-[#1f293d] text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/30 dark:bg-transparent">
          {isNotFound ? (
            <div className="flex items-center gap-2 p-3 my-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                {question.answer || 'Answer not found in supplied material — flagged for manual review.'}
              </span>
            </div>
          ) : (
            <div className="max-w-none text-xs md:text-sm whitespace-pre-line text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
              {question.answer}
            </div>
          )}

          {/* Related Code Snippet if present */}
          {question.codeSnippet && (
            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Related Snippet:
              </div>
              <CodeBlock
                code={question.codeSnippet.code}
                language={question.codeSnippet.language}
                filename={question.codeSnippet.filename}
              />
            </div>
          )}

          {/* Related Diagram if present */}
          {question.diagramUrl && (
            <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-[#0c101d] border border-slate-200 dark:border-[#1f293d] inline-block max-w-full shadow-sm">
              <img
                src={question.diagramUrl}
                alt={question.question}
                className="max-h-64 rounded object-contain"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
