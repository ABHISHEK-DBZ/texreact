import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

const PIN = 'vlsi1';
const UNLOCK_KEY = 'studycode_unlocked_v1';

function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

export const PinGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().toLowerCase() === PIN) {
      try {
        sessionStorage.setItem(UNLOCK_KEY, '1');
      } catch {
        // private mode: unlock for this page load only
      }
      setUnlocked(true);
    } else {
      setError(true);
      setPin('');
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 flex items-center justify-center p-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-xl p-6 space-y-5"
      >
        <div className="flex flex-col items-center text-center gap-2">
          <Logo className="w-12 h-12 shadow-sm" />
          <h1 className="text-base font-bold text-slate-900 dark:text-white">StudyHub</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-500" />
            Enter access PIN to continue
          </p>
        </div>

        <div className="space-y-2">
          <input
            autoFocus
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={5}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="5-character PIN"
            aria-label="Access PIN"
            aria-invalid={error}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-[#182234] border font-mono text-center text-lg tracking-[0.4em] text-slate-900 dark:text-white focus:outline-none ${
              error
                ? 'border-rose-500'
                : 'border-slate-200 dark:border-[#1f293d] focus:border-blue-500'
            }`}
          />
          {error && <p className="text-xs text-rose-600 dark:text-rose-400">Incorrect PIN. Try again.</p>}
        </div>

        <button
          type="submit"
          disabled={pin.trim().length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          <span>Unlock</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
