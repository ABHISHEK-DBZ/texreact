import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, BookOpen, HelpCircle, Code2, Layers } from 'lucide-react';
import type { Subject, SearchResultItem } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onSelectResult: (subjectId: string, experimentId?: string, questionId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global search algorithm
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const hits: SearchResultItem[] = [];

    subjects.forEach((subj) => {
      if (selectedSubjectFilter !== 'all' && subj.id !== selectedSubjectFilter) {
        return;
      }

      // 1. Search in subject name / desc
      if (subj.name.toLowerCase().includes(q) || subj.shortCode.toLowerCase().includes(q)) {
        if (selectedTypeFilter === 'all' || selectedTypeFilter === 'subject') {
          hits.push({
            type: 'theory',
            subjectId: subj.id,
            subjectName: subj.name,
            title: subj.name,
            snippet: subj.description,
            matchField: 'Subject Name / Code',
            item: subj.experiments[0] || ({} as any),
          });
        }
      }

      // 2. Search in Experiments
      subj.experiments.forEach((exp) => {
        const matchesExpTitle = exp.title.toLowerCase().includes(q);
        const matchesExpNum = String(exp.expNumber).includes(q);
        const matchesAim = exp.aim.toLowerCase().includes(q);
        const matchesTheory = exp.theory?.toLowerCase().includes(q);
        const matchesAlgo = exp.algorithm?.some((step) => step.toLowerCase().includes(q));

        if (matchesExpTitle || matchesExpNum || matchesAim || matchesTheory || matchesAlgo) {
          if (selectedTypeFilter === 'all' || selectedTypeFilter === 'experiment') {
            hits.push({
              type: 'experiment',
              subjectId: subj.id,
              subjectName: subj.name,
              experimentId: exp.id,
              experimentNumber: exp.expNumber,
              title: `Exp ${exp.expNumber}: ${exp.title}`,
              snippet: matchesAim ? exp.aim : matchesTheory ? (exp.theory?.slice(0, 160) + '...') : exp.aim,
              matchField: matchesExpTitle ? 'Experiment Title' : matchesAim ? 'Aim' : 'Theory / Algorithm',
              item: exp,
            });
          }
        }

        // Code matches
        exp.codeSnippets?.forEach((codeSnip) => {
          if (
            codeSnip.code.toLowerCase().includes(q) ||
            codeSnip.language.toLowerCase().includes(q) ||
            codeSnip.filename?.toLowerCase().includes(q)
          ) {
            if (selectedTypeFilter === 'all' || selectedTypeFilter === 'code') {
              const codeLine = codeSnip.code
                .split('\n')
                .find((l) => l.toLowerCase().includes(q)) || codeSnip.code.slice(0, 100);

              hits.push({
                type: 'code',
                subjectId: subj.id,
                subjectName: subj.name,
                experimentId: exp.id,
                experimentNumber: exp.expNumber,
                title: `${exp.title} — ${codeSnip.language.toUpperCase()} Code`,
                snippet: codeLine.trim(),
                matchField: 'Source Code',
                item: exp,
              });
            }
          }
        });

        // Viva / Questions inside experiment
        exp.vivaQuestions?.forEach((viva) => {
          if (viva.question.toLowerCase().includes(q) || viva.answer.toLowerCase().includes(q)) {
            if (selectedTypeFilter === 'all' || selectedTypeFilter === 'question') {
              hits.push({
                type: 'viva',
                subjectId: subj.id,
                subjectName: subj.name,
                experimentId: exp.id,
                experimentNumber: exp.expNumber,
                title: `Viva: ${viva.question}`,
                snippet: viva.answer,
                matchField: 'Viva Question / Answer',
                item: viva as any,
              });
            }
          }
        });
      });

      // 3. Search in Question Bank
      subj.questionBank.forEach((qb) => {
        if (
          qb.question.toLowerCase().includes(q) ||
          qb.answer.toLowerCase().includes(q)
        ) {
          if (selectedTypeFilter === 'all' || selectedTypeFilter === 'question') {
            hits.push({
              type: 'question',
              subjectId: subj.id,
              subjectName: subj.name,
              experimentId: qb.experimentId,
              title: `Q: ${qb.question}`,
              snippet: qb.answer.slice(0, 160) + '...',
              matchField: 'Subject Question Bank',
              item: qb,
            });
          }
        }
      });
    });

    return hits.slice(0, 40); // limit to top 40 for speed
  }, [subjects, query, selectedSubjectFilter, selectedTypeFilter]);

  // Group results by subject
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: SearchResultItem[] } = {};
    results.forEach((r) => {
      if (!groups[r.subjectName]) groups[r.subjectName] = [];
      groups[r.subjectName].push(r);
    });
    return groups;
  }, [results]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-[#1f293d] flex items-center gap-3 bg-slate-50/50 dark:bg-transparent">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search experiments, algorithms, code snippets, or viva questions…"
            className="w-full bg-transparent text-sm md:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono text-slate-500 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-[#1f293d] hover:bg-slate-100 dark:hover:bg-[#182234]"
          >
            ESC
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0c101d] border-b border-slate-200 dark:border-[#1f293d] flex items-center justify-between text-xs gap-2 flex-wrap">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-white dark:bg-[#182234] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1f293d] rounded px-2 py-0.5 focus:outline-none text-xs"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortCode}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Type:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="bg-white dark:bg-[#182234] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1f293d] rounded px-2 py-0.5 focus:outline-none text-xs"
            >
              <option value="all">All Types</option>
              <option value="experiment">Experiments</option>
              <option value="code">Source Code</option>
              <option value="question">Questions &amp; Viva</option>
            </select>
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {!query.trim() ? (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
              <Search className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              <span>Type keywords to search across Python, DSA, MPM, and DVLSI content.</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No results found for "<span className="text-slate-900 dark:text-white font-medium">{query}</span>"
            </div>
          ) : (
            (Object.entries(groupedResults) as [string, SearchResultItem[]][]).map(([subjName, items]) => (
              <div key={subjName}>
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 px-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{subjName} ({items.length})</span>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectResult(
                          item.subjectId,
                          item.experimentId,
                          item.type === 'question' || item.type === 'viva'
                            ? (item.item as any).id
                            : undefined
                        );
                        onClose();
                      }}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#151d2e] border border-slate-200 dark:border-[#1f293d] hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer group transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          {item.type === 'experiment' && (
                            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          )}
                          {item.type === 'code' && (
                            <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          )}
                          {(item.type === 'question' || item.type === 'viva') && (
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          )}
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#182234] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1f293d]">
                          {item.matchField}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
