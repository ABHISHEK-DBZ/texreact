import React, { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { highlightCode } from '../utils/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  defaultExpanded?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  filename,
  defaultExpanded = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const lines = code.trim().split('\n');
  const highlighted = highlightCode(code, language);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Pure source code only, never line numbers or headers
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="my-4 rounded-lg border border-slate-200 dark:border-[#1f293d] bg-white dark:bg-[#070a12] overflow-hidden text-sm shadow-sm transition-colors">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#1f293d]">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
          <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
            {language}
          </span>
          {filename && <span className="text-slate-400 dark:text-slate-500">/ {filename}</span>}
          <span className="text-slate-400 dark:text-slate-500 font-sans">({lines.length} lines)</span>
        </div>

        <div className="flex items-center gap-2">
          {lines.length > 28 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-[#182234] border border-slate-200 dark:border-[#1f293d] transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  <span>Expand</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors bg-white dark:bg-[#182234] hover:bg-slate-100 dark:hover:bg-[#1f293d] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#1f293d]"
            title="Copy clean code only"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div
        className={`relative overflow-x-auto font-mono leading-relaxed transition-all ${
          !isExpanded && lines.length > 28 ? 'max-h-80 overflow-y-hidden' : ''
        }`}
      >
        <div className="flex min-w-full">
          {/* Line Numbers - Non Selectable */}
          <div className="select-none py-3 pl-3 pr-2.5 text-right text-xs text-slate-400 dark:text-slate-600 bg-slate-50/70 dark:bg-[#0b0f19] border-r border-slate-200/80 dark:border-[#1f293d] sticky left-0 z-10 font-mono">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Syntax Highlighted Code */}
          <pre className="p-3 text-xs leading-6 text-slate-800 dark:text-slate-100 font-mono whitespace-pre flex-1 focus:outline-none">
            <code
              dangerouslySetInnerHTML={{ __html: highlighted }}
              className={`language-${language}`}
            />
          </pre>
        </div>

        {!isExpanded && lines.length > 28 && (
          <div
            onClick={() => setIsExpanded(true)}
            className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-[#070a12] to-transparent flex items-end justify-center pb-2 cursor-pointer group"
          >
            <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1 bg-slate-100 dark:bg-[#111827] px-3 py-1 rounded-full border border-slate-200 dark:border-[#1f293d] shadow-sm">
              <ChevronDown className="w-3 h-3" /> Show remaining {lines.length - 14} lines
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
