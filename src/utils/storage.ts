import type { UserProgress, Subject } from '../types';

const PROGRESS_KEY = 'studycode_progress_v1';
const SITE_TITLE_KEY = 'studycode_site_title_v1';
const CUSTOM_SUBJECTS_KEY = 'studycode_custom_subjects_v2';
const THEME_KEY = 'studycode_theme_v1';

export type ThemeMode = 'light' | 'dark';

export function getSavedTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to light mode as explicitly requested
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

export function getSavedSiteTitle(defaultTitle: string = 'StudyCode Hub'): string {
  try {
    const saved = localStorage.getItem(SITE_TITLE_KEY);
    return saved && saved.trim() ? saved : defaultTitle;
  } catch {
    return defaultTitle;
  }
}

export function saveSiteTitle(title: string): void {
  try {
    localStorage.setItem(SITE_TITLE_KEY, title.trim());
  } catch (e) {
    console.error('Failed to save site title:', e);
  }
}

export function getUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return { bookmarks: [], reviewedItems: [], recentlyViewed: [] };
    }
    return JSON.parse(raw);
  } catch {
    return { bookmarks: [], reviewedItems: [], recentlyViewed: [] };
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function toggleBookmark(id: string): boolean {
  const current = getUserProgress();
  const exists = current.bookmarks.includes(id);
  const updatedBookmarks = exists
    ? current.bookmarks.filter((b) => b !== id)
    : [...current.bookmarks, id];

  saveUserProgress({
    ...current,
    bookmarks: updatedBookmarks,
  });

  return !exists;
}

export function toggleReviewed(id: string): boolean {
  const current = getUserProgress();
  const exists = current.reviewedItems.includes(id);
  const updatedReviewed = exists
    ? current.reviewedItems.filter((r) => r !== id)
    : [...current.reviewedItems, id];

  saveUserProgress({
    ...current,
    reviewedItems: updatedReviewed,
  });

  return !exists;
}

export function addRecentlyViewed(item: {
  id: string;
  type: 'experiment' | 'question';
  subjectId: string;
  title: string;
}): void {
  const current = getUserProgress();
  const filtered = current.recentlyViewed.filter((r) => r.id !== item.id);
  const updated = [
    { ...item, timestamp: Date.now() },
    ...filtered,
  ].slice(0, 15);

  saveUserProgress({
    ...current,
    recentlyViewed: updated,
  });
}

export function getCustomSubjects(): Subject[] | null {
  try {
    const data = localStorage.getItem(CUSTOM_SUBJECTS_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveCustomSubjects(subjects: Subject[]): void {
  try {
    localStorage.setItem(CUSTOM_SUBJECTS_KEY, JSON.stringify(subjects));
  } catch (e) {
    console.error('Failed to persist subjects:', e);
  }
}
