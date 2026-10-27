import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  HelpCircle,
  Code2,
  FileDown,
  Cpu,
  Binary,
  Layers,
  ArrowRight
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

  // Subject icon & color config
  const getEmblem = () => {
    switch (subject.id) {
      case 'dvlsi':
        return {
          icon: Cpu,
          bg: 'from-purple-600 to-indigo-600',
          badgeText: 'DVLSI',
          border: 'border-purple-200 dark:border-purple-900/60',
        };
      case 'dsa':
        return {
          icon: Binary,
          bg: 'from-cyan-500 to-blue-600',
          badgeText: 'DSA',
          border: 'border-cyan-200 dark:border-cyan-900/60',
        };
      case 'python':
        return {
          icon: Code2,
          bg: 'from-amber-500 to-blue-600',
          badgeText: 'PYTHON',
          border: 'border-amber-200 dark:border-amber-900/60',
        };
      default:
        return {
          icon: Layers,
          bg: 'from-blue-600 to-indigo-600',
          badgeText: subject.shortCode,
          border: 'border-blue-200 dark:border-blue-900/60',
        };
    }
  };

  const emblem = getEmblem();
  const IconComponent = emblem.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-sans">
        <button
          onClick={onNavigateHome}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={onNavigateHome}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Subjects
        </button>
        <span>/</span>
        <span className="text-blue-600 dark:text-blue-400 font-semibold">{subject.name}</span>
      </nav>

      {/* 2. SUBJECT HERO BANNER (Directly matching Reference Image 2 Top-Right) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white dark:from-[#131d33] dark:via-[#11192b] dark:to-[#0f172a] border border-slate-200 dark:border-[#1e2e4a] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Subject Big Emblem */}
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${emblem.bg} text-white flex items-center justify-center shadow-lg shrink-0 mt-1`}>
              <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white dark:bg-[#1a2942] border border-slate-200 dark:border-[#243755] text-blue-700 dark:text-blue-300">
                  {subject.shortCode}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Laboratory Syllabus & Viva Guide
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {subject.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {subject.description}
              </p>
            </div>
          </div>

          {/* Right Statistics & PDF Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="px-3 py-2 rounded-xl bg-white dark:bg-[#162540] border border-slate-200 dark:border-[#1e2e4a] text-center shadow-2xs">
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  {subject.experiments.length}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Experiments
                </div>
              </div>

              <div className="px-3 py-2 rounded-xl bg-white dark:bg-[#162540] border border-slate-200 dark:border-[#1e2e4a] text-center shadow-2xs">
                <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {subject.experiments.length}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  PDF Guides
                </div>
              </div>

              <div className="px-3 py-2 rounded-xl bg-white dark:bg-[#162540] border border-slate-200 dark:border-[#1e2e4a] text-center shadow-2xs">
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  100%
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Coverage
                </div>
              </div>
            </div>

            <button
              onClick={handleExportPdf}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              title="Download complete subject study guide"
            >
              <FileDown className="w-4 h-4" />
              <span>Download All PDFs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. SUB-NAVIGATION TABS (Experiments, Viva, Programs) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e2e4a] pb-1 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('experiments')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'experiments'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162540]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Experiments ({subject.experiments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'questions'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162540]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Viva Questions ({filteredQuestions.length})</span>
          </button>

          {totalPrograms > 0 && (
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'programs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#162540]'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Netlists / Source Code ({totalPrograms})</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. SEARCH & TOPIC FILTER PILLS (Matching Reference Image 2 & 3) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input within subject */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${subject.shortCode} experiments, aim, or circuits...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Topic filter pills */}
        {topics.length > 0 && activeTab === 'experiments' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTopic === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#162540] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Topics
            </button>

            {topics.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTopic === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#162540] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. EXPERIMENTS LIBRARY GRID (Matching Reference Image 2 & 3) */}
      {activeTab === 'experiments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExperiments.map((exp) => {
              const previewImg = exp.logicDiagrams?.[0]?.url || exp.waveforms?.[0]?.url;

              return (
                <div
                  key={exp.id}
                  onClick={() => onSelectExperiment(exp.id)}
                  className="rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between overflow-hidden group shadow-2xs"
                >
                  {/* Card Header & Preview */}
                  <div>
                    {/* Optional Thumbnail preview */}
                    {previewImg && (
                      <div className="h-36 bg-slate-900 dark:bg-[#070b14] p-3 flex items-center justify-center border-b border-slate-200 dark:border-[#1e2e4a] overflow-hidden relative">
                        <img
                          src={previewImg}
                          alt={exp.title}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white">
                          Verified Schematic
                        </div>
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      {/* Top Row: Exp Number & Tag */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                          {String(exp.expNumber).padStart(2, '0')}
                        </span>

                        {exp.topic && (
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                            {exp.topic}
                          </span>
                        )}
                      </div>

                      {/* Experiment Title */}
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {exp.title}
                      </h3>

                      {/* Aim snippet */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {exp.aim}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Badges & Arrow Action */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      {/* Feature pill icons */}
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {exp.logicDiagrams && exp.logicDiagrams.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#162540]">Circuit</span>
                        )}
                        {exp.waveforms && exp.waveforms.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#162540]">Waveform</span>
                        )}
                        {exp.truthTable && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#162540]">Table</span>
                        )}
                      </div>

                      {/* Action Circle Arrow */}
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#162540] group-hover:bg-blue-600 text-slate-600 dark:text-slate-300 group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredExperiments.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a]">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No experiments match "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTopic('all');
                }}
                className="mt-3 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. VIVA QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((qItem) => (
              <QuestionCard
                key={qItem.id}
                question={qItem}
                isBookmarked={bookmarkedIds.includes(qItem.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a]">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No viva questions found matching your search.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 7. NETLISTS / SOURCE CODE TAB */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subject.experiments
              .filter((e) => e.codeSnippets && e.codeSnippets.length > 0)
              .map((e) => (
                <div
                  key={e.id}
                  onClick={() => onSelectExperiment(e.id)}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] hover:border-blue-500 cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                    <span className="font-bold text-blue-600">Exp {e.expNumber}</span>
                    <span>{e.codeSnippets?.[0]?.language?.toUpperCase()}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">
                    {e.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                    {e.codeSnippets?.[0]?.filename || 'program.py'}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
