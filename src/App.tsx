import { useState, useEffect } from 'react';
import type { Subject, UserProgress } from './types';
import { INITIAL_SUBJECTS } from './data/initialData';
import {
  getSavedSiteTitle,
  saveSiteTitle,
  getSavedTheme,
  saveTheme,
  type ThemeMode,
  getUserProgress,
  toggleBookmark as storageToggleBookmark,
  toggleReviewed as storageToggleReviewed,
  addRecentlyViewed,
  getCustomSubjects,
  saveCustomSubjects,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SubjectPage } from './components/SubjectPage';
import { ExperimentView } from './components/ExperimentView';
import { BookmarksView } from './components/BookmarksView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { RevisionQuizModal } from './components/RevisionQuizModal';
import { ContentUploaderModal } from './components/ContentUploaderModal';
import { PdfStudyModal } from './components/PdfStudyModal';

export function App() {
  // Theme state (Light-first by default)
  const [theme, setTheme] = useState<ThemeMode>(() => getSavedTheme());

  // Site Title
  const [siteTitle, setSiteTitle] = useState(() => getSavedSiteTitle('StudyCode Hub'));

  // Subjects Library
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const custom = getCustomSubjects();
      if (custom && custom.length > 0) {
        const dsaSub = custom.find((s) => s.id === 'dsa');
        // Ensure DSA contains the verified 9 experiments extracted from the PDF
        if (
          dsaSub &&
          dsaSub.experiments.length >= 9 &&
          dsaSub.experiments[0].codeSnippets?.[0]?.language === 'python'
        ) {
          return custom;
        }
      }
      // Stale cache detected; clear and default to authentic INITIAL_SUBJECTS
      localStorage.removeItem('studycode_custom_subjects_v1');
    } catch {
      // ignore
    }
    return INITIAL_SUBJECTS;
  });

  // User Progress (Bookmarks, Reviewed items, Recent)
  const [progress, setProgress] = useState<UserProgress>(() => getUserProgress());

  // Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'subject' | 'experiment' | 'bookmarks'>('dashboard');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeExperimentId, setActiveExperimentId] = useState<string | null>(null);

  // Modals & Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Ensure HTML element has appropriate class on mount and change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsRevisionOpen(false);
        setIsUploaderOpen(false);
        setIsPdfModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme toggle handler
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveTheme(nextTheme);
  };

  // Update site title
  const handleUpdateSiteTitle = (newTitle: string) => {
    setSiteTitle(newTitle);
    saveSiteTitle(newTitle);
  };

  // Toggle bookmark
  const handleToggleBookmark = (id: string) => {
    storageToggleBookmark(id);
    setProgress(getUserProgress());
  };

  // Toggle reviewed
  const handleToggleReviewed = (id: string) => {
    storageToggleReviewed(id);
    setProgress(getUserProgress());
  };

  // Navigate to Home
  const handleNavigateHome = () => {
    setCurrentView('dashboard');
    setActiveSubjectId(null);
    setActiveExperimentId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Subject
  const handleSelectSubject = (subjectId: string) => {
    setActiveSubjectId(subjectId);
    setActiveExperimentId(null);
    setCurrentView('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Experiment
  const handleSelectExperiment = (subjectId: string, expId: string) => {
    const targetSub = subjects.find((s) => s.id === subjectId);
    const targetExp = targetSub?.experiments.find((e) => e.id === expId);

    if (targetExp) {
      addRecentlyViewed({
        id: targetExp.id,
        type: 'experiment',
        subjectId: subjectId,
        title: `Exp ${targetExp.expNumber}: ${targetExp.title}`,
      });
      setProgress(getUserProgress());
    }

    setActiveSubjectId(subjectId);
    setActiveExperimentId(expId);
    setCurrentView('experiment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search result handler
  const handleSelectSearchResult = (subjectId: string, experimentId?: string) => {
    if (experimentId) {
      handleSelectExperiment(subjectId, experimentId);
    } else {
      handleSelectSubject(subjectId);
    }
  };

  // Custom data update
  const handleUpdateSubjects = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    saveCustomSubjects(newSubjects);
  };

  // Reset to default data
  const handleResetToDefaults = () => {
    setSubjects(INITIAL_SUBJECTS);
    localStorage.removeItem('studycode_custom_subjects_v1');
  };

  // Active Subject & Experiment references
  const currentSubject = subjects.find((s) => s.id === activeSubjectId);
  const currentExperiment = currentSubject?.experiments.find((e) => e.id === activeExperimentId);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 flex flex-col font-sans transition-colors duration-150 selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300">
      {/* Top Navbar */}
      <Navbar
        siteTitle={siteTitle}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onUpdateSiteTitle={handleUpdateSiteTitle}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateHome={handleNavigateHome}
        onNavigateBookmarks={() => setCurrentView('bookmarks')}
        onOpenPdfMenu={() => setIsPdfModalOpen(true)}
        bookmarksCount={progress.bookmarks.length}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          subjects={subjects}
          currentSubjectId={activeSubjectId || undefined}
          currentExperimentId={activeExperimentId || undefined}
          onSelectSubject={handleSelectSubject}
          onSelectExperiment={handleSelectExperiment}
          onNavigateHome={handleNavigateHome}
          onNavigateBookmarks={() => setCurrentView('bookmarks')}
          onOpenRevisionModal={() => setIsRevisionOpen(true)}
          onOpenPdfMenu={() => setIsPdfModalOpen(true)}
          onOpenUploader={() => setIsUploaderOpen(true)}
        />

        {/* Content Area (with margin offset for fixed desktop sidebar) */}
        <main className="flex-1 md:ml-72 min-w-0 pb-16">
          {currentView === 'dashboard' && (
            <Dashboard
              siteTitle={siteTitle}
              subjects={subjects}
              progress={progress}
              onOpenSearch={() => setIsSearchOpen(true)}
              onSelectSubject={handleSelectSubject}
              onSelectExperiment={handleSelectExperiment}
              onNavigateBookmarks={() => setCurrentView('bookmarks')}
              onOpenRevisionModal={() => setIsRevisionOpen(true)}
              onOpenUploader={() => setIsUploaderOpen(true)}
            />
          )}

          {currentView === 'subject' && currentSubject && (
            <SubjectPage
              subject={currentSubject}
              onSelectExperiment={(expId) => handleSelectExperiment(currentSubject.id, expId)}
              bookmarkedIds={progress.bookmarks}
              reviewedIds={progress.reviewedItems}
              onToggleBookmark={handleToggleBookmark}
              onNavigateHome={handleNavigateHome}
            />
          )}

          {currentView === 'experiment' && currentSubject && currentExperiment && (
            <ExperimentView
              experiment={currentExperiment}
              subject={currentSubject}
              isBookmarked={progress.bookmarks.includes(currentExperiment.id)}
              isReviewed={progress.reviewedItems.includes(currentExperiment.id)}
              onToggleBookmark={handleToggleBookmark}
              onToggleReviewed={handleToggleReviewed}
              onNavigateHome={handleNavigateHome}
              onNavigateSubject={handleSelectSubject}
              onNavigateExperiment={(expId) => handleSelectExperiment(currentSubject.id, expId)}
              bookmarkedIds={progress.bookmarks}
            />
          )}

          {currentView === 'bookmarks' && (
            <BookmarksView
              subjects={subjects}
              progress={progress}
              onToggleBookmark={handleToggleBookmark}
              onSelectExperiment={handleSelectExperiment}
              onNavigateHome={handleNavigateHome}
            />
          )}
        </main>
      </div>

      {/* Study Guides & PDF Export Modal */}
      <PdfStudyModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        subjects={subjects}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        subjects={subjects}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Revision & Practice Viva Modal */}
      <RevisionQuizModal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        subjects={subjects}
      />

      {/* Content Management & Ingestion Modal */}
      <ContentUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        subjects={subjects}
        onUpdateSubjects={handleUpdateSubjects}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
}

export default App;

