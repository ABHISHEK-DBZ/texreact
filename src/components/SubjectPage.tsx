import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  HelpCircle,
  Code2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  Filter,
  FileDown
} from 'lucide-react';
import type { Subject } from '../types';
import { QuestionCard } from './QuestionCard';
import { exportSubjectPdf } from '../utils/pdfExport';

interface SubjectPageProps {
  subject: Subject;
  onSelectExperiment: (expId: string) => void;
  bookmarkedIds: string[];
  reviewedIds: string[];
  onToggleBookmark: (id: string) => void;
  onNavigateHome: () => void;
}

export const SubjectPage: React.FC<SubjectPageProps> = ({
  subject,
  onSelectExperiment,
  bookmarkedIds,
  reviewedIds,
  onToggleBookmark,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'experiments' | 'questions' | 'programs'>('experiments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const handleExportPdf = () => {
    exportSubjectPdf(subject);
  };

  const topics = useMemo(() => {
    const list = new Set<string>();
    subject.experiments.forEach((e) => {
      if (e.topic) list.add(e.topic);
      if (e.chapter) list.add(e.chapter);
    });
    return Array.from(list);
  }, [subject]);

  const filteredExperiments = useMemo(() => {
    return subject.experiments.filter((exp) => {
      const matchesSearch =
        searchQuery === '' ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(exp.expNumber).includes(searchQuery) ||
        exp.aim.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic =
        selectedTopic === 'all' ||
        exp.topic === selectedTopic ||
        exp.chapter === selectedTopic;

      return matchesSearch && matchesTopic;
    });
  }, [subject.experiments, searchQuery, selectedTopic]);

  const filteredQuestions = useMemo(() => {
    const allQuestions = [
      ...subject.questionBank,
      ...subject.experiments.flatMap((e) => [
        ...(e.vivaQuestions || []),
        ...(e.postExpQuestions || []),
      ]),
    ];

    if (!searchQuery) return allQuestions;
    const q = searchQuery.toLowerCase();
    return allQuestions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [subject, searchQuery]);

  const totalPrograms = subject.experiments.reduce(
    (acc, exp) => acc + (exp.codeSnippets?.length || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4 font-mono">
        <button onClick={onNavigateHome} className="hover:text-slate-900 dark:hover:text-white transition-colors">
          Home
        </button>
        <span>/</span>
        <span className="text-blue-600 dark:text-blue-400 font-medium">{subject.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                {subject.shortCode}
              </span>
              {!subject.isConfirmedName && (
                <span className="text-amber-600 dark:text-amber-400 text-[11px] font-sans">
                  (Exact label pending verification)
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {subject.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Quick PDF download & stats */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-sm"
              title="Download complete subject handbook as PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download Subject PDF</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0c0d12] border border-slate-200 dark:border-[#1f293d] text-center min-w-[64px]">
                <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {subject.experiments.length}
                </div>
                <div className="text-[10px] uppercase font-mono text-slate-500">Exps</div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0c0d12] border border-slate-200 dark:border-[#1f293d] text-center min-w-[64px]">
                <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {totalPrograms}
                </div>
                <div className="text-[10px] uppercase font-mono text-slate-500">Codes</div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0c0d12] border border-slate-200 dark:border-[#1f293d] text-center min-w-[64px]">
                <div className="text-sm font-bold font-mono text-purple-600 dark:text-purple-400">
                  {filteredQuestions.length}
                </div>
                <div className="text-[10px] uppercase font-mono text-slate-500">Q&As</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${subject.name} (title, aim, code)...`}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        {topics.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="py-2 px-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="all">All Topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1f293d] mb-6">
        <button
          onClick={() => setActiveTab('experiments')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs md:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'experiments'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Experiments ({filteredExperiments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs md:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'questions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Question Bank & Viva ({filteredQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs md:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'programs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Programs ({totalPrograms})</span>
        </button>
      </div>

      {/* Experiments List Tab */}
      {activeTab === 'experiments' && (
        <div className="space-y-3">
          {filteredExperiments.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d]">
              <p className="text-sm text-slate-500">No experiments matched your search query.</p>
            </div>
          ) : (
            filteredExperiments.map((exp) => {
              const isDone = reviewedIds.includes(exp.id);
              const isBkm = bookmarkedIds.includes(exp.id);

              return (
                <div
                  key={exp.id}
                  onClick={() => onSelectExperiment(exp.id)}
                  className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm transition-all cursor-pointer group flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                        EXP {exp.expNumber}
                      </span>
                      {exp.topic && <span>{exp.topic}</span>}
                      {exp.sourceReference && (
                        <span className="text-slate-400">· p. {exp.sourceReference.pageNumber}</span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                      {exp.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {exp.aim}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                      {exp.codeSnippets?.length > 0 && (
                        <span className="flex items-center gap-1 font-mono">
                          <Code2 className="w-3.5 h-3.5 text-blue-500" />
                          {exp.codeSnippets[0].language.toUpperCase()}
                        </span>
                      )}
                      {exp.dryRun && (
                        <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium">
                          Dry Run Included
                        </span>
                      )}
                      {(exp.vivaQuestions?.length || 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-purple-500" />
                          {exp.vivaQuestions?.length} Viva Qs
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
                    {isDone && (
                      <span className="p-1 text-emerald-600 dark:text-emerald-400" title="Completed">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}

                    <button
                      onClick={() => onToggleBookmark(exp.id)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#182234] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      title={isBkm ? 'Remove bookmark' : 'Bookmark'}
                    >
                      {isBkm ? <BookmarkCheck className="w-4 h-4 text-blue-600 fill-current" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d]">
              <p className="text-sm text-slate-500">No questions found.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                subjectName={subject.name}
                isBookmarked={bookmarkedIds.includes(q.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))
          )}
        </div>
      )}

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          {subject.experiments.map((exp) => (
            <div key={exp.id} className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  Exp {exp.expNumber}: {exp.title}
                </span>
                <button
                  onClick={() => onSelectExperiment(exp.id)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 font-mono"
                >
                  View Experiment <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {exp.codeSnippets.map((c, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-mono mb-1">
                    {c.filename || `Program #${i + 1}`} ({c.language})
                  </div>
                  <pre className="p-3 bg-slate-50 dark:bg-[#070a12] border border-slate-200 dark:border-[#1f293d] rounded font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto max-h-48">
                    <code>{c.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
