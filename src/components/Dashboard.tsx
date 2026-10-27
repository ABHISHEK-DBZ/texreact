import React from 'react';
import {
  Search,
  BookOpen,
  Code2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Cpu,
  Binary,
  GraduationCap,
  Download,
  Zap,
  ShieldCheck
} from 'lucide-react';
import type { Subject, UserProgress } from '../types';

interface DashboardProps {
  siteTitle: string;
  subjects: Subject[];
  progress: UserProgress;
  onOpenSearch: () => void;
  onSelectSubject: (subjectId: string) => void;
  onSelectExperiment: (subjectId: string, expId: string) => void;
  onNavigateBookmarks: () => void;
  onOpenRevisionModal: () => void;
  onOpenUploader: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  subjects,
  progress,
  onOpenSearch,
  onSelectSubject,
  onSelectExperiment,
  onOpenRevisionModal,
}) => {
  // Real content calculations
  const totalSubjects = subjects.length;
  const totalExperiments = subjects.reduce((acc, s) => acc + s.experiments.length, 0);

  const lastViewed = progress.recentlyViewed[0];
  const lastViewedSubject = lastViewed
    ? subjects.find((s) => s.id === lastViewed.subjectId)
    : null;

  const scrollToSubjects = () => {
    const el = document.getElementById('subjects-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to get matching subject styles and icons
  const getSubjectConfig = (subId: string) => {
    switch (subId) {
      case 'dsa':
        return {
          icon: Binary,
          color: 'from-cyan-500 to-blue-600',
          textColor: 'text-cyan-600 dark:text-cyan-400',
          badgeBg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
          cardBg: 'bg-gradient-to-br from-cyan-50/60 via-white to-blue-50/30 dark:from-[#0d1f30] dark:via-[#0e1726] dark:to-[#101b2b]',
          cardBorder: 'border-cyan-200/70 hover:border-cyan-500 dark:border-cyan-900/50 dark:hover:border-cyan-400',
          pillCount: '9 Experiments (PDF Verified)',
          sublabel: 'Data Structures & Algorithms',
        };
      case 'dvlsi':
        return {
          icon: Cpu,
          color: 'from-purple-500 to-indigo-600',
          textColor: 'text-purple-600 dark:text-purple-400',
          badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
          cardBg: 'bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/30 dark:from-[#1b142f] dark:via-[#111827] dark:to-[#161a33]',
          cardBorder: 'border-purple-200/70 hover:border-purple-500 dark:border-purple-900/50 dark:hover:border-purple-400',
          pillCount: '5 Experiments (LTspice Schematics)',
          sublabel: 'Digital VLSI Design & SPICE',
        };
      case 'python':
        return {
          icon: Code2,
          color: 'from-amber-500 to-blue-600',
          textColor: 'text-blue-600 dark:text-blue-400',
          badgeBg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
          cardBg: 'bg-gradient-to-br from-amber-50/40 via-white to-blue-50/30 dark:from-[#1e1c15] dark:via-[#111827] dark:to-[#121c2e]',
          cardBorder: 'border-amber-200/70 hover:border-amber-500 dark:border-amber-900/50 dark:hover:border-amber-400',
          pillCount: 'Core & Advanced Routines',
          sublabel: 'Codes, Programs & Syntax',
        };
      default:
        return {
          icon: Layers,
          color: 'from-blue-600 to-indigo-600',
          textColor: 'text-blue-600 dark:text-blue-400',
          badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
          cardBg: 'bg-gradient-to-br from-slate-50/80 via-white to-blue-50/20 dark:from-[#131d33] dark:via-[#111827] dark:to-[#0f172a]',
          cardBorder: 'border-slate-200 hover:border-blue-500 dark:border-[#1e293b] dark:hover:border-blue-400',
          pillCount: 'Experiments & Notes',
          sublabel: 'Laboratory Guide',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-12">
      {/* 1. HERO SECTION (Directly inspired by Reference Image 1 & 2) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white dark:from-[#111c33] dark:via-[#0c1322] dark:to-[#0b1120] border border-blue-100 dark:border-[#1e2e4a] p-6 sm:p-8 md:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Subtitle, Actions, Stat Pills */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Master Your Practical Knowledge</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Your Complete{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">
                Engineering Study Companion
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Explore well-structured notes, practical experiments, verified code, circuit schematics, and study materials for all your engineering subjects in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={scrollToSubjects}
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Subjects</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenSearch}
                className="px-6 py-3 rounded-full bg-white dark:bg-[#15233d] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a2c4e] border border-slate-200 dark:border-[#223554] font-semibold text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search All Experiments</span>
              </button>
            </div>

            {/* 4 Feature Badges (Matching Reference Image 1) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#121e33] border border-emerald-200/80 dark:border-emerald-900/50 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">{totalSubjects}+ Subjects</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Curated Labs</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#121e33] border border-cyan-200/80 dark:border-cyan-900/50 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">{totalExperiments}+ Experiments</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Verified Steps</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#121e33] border border-blue-200/80 dark:border-blue-900/50 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">Code & PDFs</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">All in One Place</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#121e33] border border-amber-200/80 dark:border-amber-900/50 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">Offline Ready</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">For Exam Prep</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Isometric Study Setup Illustration (Matching Image 1) */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
            <div className="relative w-full max-w-[420px] aspect-4/3 flex items-center justify-center">
              {/* Soft ambient glowing backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* 3D Isometric Workspace Container */}
              <div className="relative z-10 w-full p-4 rounded-3xl bg-white/70 dark:bg-[#111c30]/80 backdrop-blur-md border border-white/80 dark:border-blue-500/20 shadow-xl">
                {/* Simulated Laptop Screen */}
                <div className="rounded-2xl bg-slate-900 dark:bg-[#070b14] border border-slate-700/60 p-4 shadow-inner">
                  {/* Laptop Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-purple-400" />
                      <span>DVLSI Experiments</span>
                    </div>
                  </div>

                  {/* Circuit Simulation Visualization on Screen */}
                  <div className="pt-3 pb-1 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-blue-400">
                      <span>SR Latch Using NOR (8T CMOS)</span>
                      <span className="text-emerald-400 font-bold">ACTIVE</span>
                    </div>

                    {/* Waveform Graphic */}
                    <div className="h-16 rounded-lg bg-slate-950 p-2 border border-slate-800 flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-emerald-400">S:</span>
                        <div className="flex-1 h-2 flex items-end">
                          <div className="w-6 h-2 bg-emerald-500/60 rounded-xs" />
                          <div className="w-8 h-0.5 bg-emerald-500/30" />
                          <div className="w-6 h-2 bg-emerald-500/60 rounded-xs" />
                          <div className="w-10 h-0.5 bg-emerald-500/30" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-blue-400">Q:</span>
                        <div className="flex-1 h-2 flex items-end">
                          <div className="w-10 h-0.5 bg-blue-500/30" />
                          <div className="w-12 h-2 bg-blue-500/60 rounded-xs" />
                          <div className="w-8 h-0.5 bg-blue-500/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Study Card 1: Python Codes */}
                <div className="absolute -top-3 -left-3 p-2.5 rounded-2xl bg-white dark:bg-[#16233b] border border-amber-200 dark:border-amber-800/60 shadow-lg flex items-center gap-2 transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-xs">
                    🐍
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">Python Codes</div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">Algorithms & Syntax</div>
                  </div>
                </div>

                {/* Floating Study Card 2: DSA Solutions */}
                <div className="absolute -top-3 -right-3 p-2.5 rounded-2xl bg-white dark:bg-[#16233b] border border-cyan-200 dark:border-cyan-800/60 shadow-lg flex items-center gap-2 transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="w-7 h-7 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">DSA Solutions</div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">9 Core Programs</div>
                  </div>
                </div>

                {/* Floating Study Card 3: Subject Notes & PDFs */}
                <div className="absolute -bottom-3 right-6 p-2.5 rounded-2xl bg-white dark:bg-[#16233b] border border-emerald-200 dark:border-emerald-800/60 shadow-lg flex items-center gap-2 transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    📄
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white">Subject Notes</div>
                    <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">PDF Downloads</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTINUE STUDYING / RECENTLY VIEWED (if available) */}
      {lastViewed && lastViewedSubject && (
        <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111c30] border border-blue-200/80 dark:border-blue-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                Continue Where You Left Off
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {lastViewed.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lastViewedSubject.name} • Click resume to continue reading
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectExperiment(lastViewed.subjectId, lastViewed.id)}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all self-start sm:self-center cursor-pointer"
          >
            <span>Resume Experiment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* 3. CHOOSE YOUR SUBJECT (Matching Reference Image 1 & 2) */}
      <section id="subjects-section" className="space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Choose Your Subject
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select an engineering subject to explore notes, experiments, netlists, and viva questions.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 self-start sm:self-end">
            {subjects.length} Verified Subject{subjects.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => {
            const config = getSubjectConfig(sub.id);
            const IconComponent = config.icon;
            const expCount = sub.experiments.length;

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar with Icon Emblem & Code Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.color} text-white flex items-center justify-center shadow-md shadow-blue-500/10`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/80 dark:bg-[#162540] border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200">
                      {sub.shortCode}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
                    {sub.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {sub.description}
                  </p>
                </div>

                {/* Bottom Pill Badge & Action Arrow */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeBg}`}>
                    {expCount} Experiments
                  </span>

                  <div className="w-8 h-8 rounded-full bg-white dark:bg-[#162540] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 flex items-center justify-center transition-all shadow-xs">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE STUDYHUB? (Matching Reference Image 1) */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Choose StudyHub?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything you need for your engineering laboratory and semester exams, designed for maximum comprehension.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Organized Content</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Curated experiments organized by topic with aims, circuits, working principles, and results.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Detailed Explanations</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Step-by-step device physics, line-by-line code breakdowns, and dry runs with memory matrices.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Code & Schematics</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Real LTspice netlists and Python programs tested for 100% correctness and zero compile bugs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111c30] border border-slate-200 dark:border-[#1e2e4a] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Download PDFs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export individual experiments or complete subject study guides formatted for clean printing.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CALL-TO-ACTION BANNER (Matching Reference Image 1) */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full border-8 border-white/10 pointer-events-none" />
        <div className="absolute right-20 -top-20 w-56 h-56 rounded-full border-4 border-white/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
            <GraduationCap className="w-4 h-4" />
            <span>Ready for Lab Practicals & Viva?</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Start Exploring StudyHub Now
          </h2>

          <p className="text-sm text-blue-100 leading-relaxed">
            Access all subjects, experiments, netlists, and answers directly verified from faculty laboratory manuals.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={scrollToSubjects}
              className="px-6 py-3 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Get Started →
            </button>
            <button
              onClick={onOpenRevisionModal}
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Practice Viva Flashcards
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
