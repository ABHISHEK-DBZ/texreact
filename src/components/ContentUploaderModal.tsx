import React, { useState } from 'react';
import { X, Upload, Download, Check, AlertCircle, RefreshCw, FolderOpen, FileCode } from 'lucide-react';
import type { Subject } from '../types';

interface ContentUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onUpdateSubjects: (newSubjects: Subject[]) => void;
  onResetToDefaults: () => void;
}

export const ContentUploaderModal: React.FC<ContentUploaderModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onUpdateSubjects,
  onResetToDefaults,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(subjects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'studyhub_library.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error('Imported data must be an array of Subject objects.');
      }
      onUpdateSubjects(parsed);
      setStatusMessage({ type: 'success', text: `Successfully updated ${parsed.length} subjects!` });
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1200);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Invalid JSON format' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f293d] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#1f293d] flex items-center justify-between bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Content Management &amp; Asset Ingestion
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182234]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {/* Method 1: Drop Raw Assets */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c101d] border border-slate-200 dark:border-[#1f293d]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-1">
              <FolderOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Direct Asset Directory (Local Workspace)</span>
            </div>
            <p className="mt-1">
              Place PDFs, DOCX, images, code files, and lab notes directly into:
            </p>
            <div className="mt-2 font-mono text-[11px] bg-white dark:bg-[#182234] p-2.5 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#1f293d] select-all">
              rawasset/dsa/<br/>
              rawasset/python/<br/>
              rawasset/mpm/<br/>
              rawasset/dvlsi/
            </div>
            <p className="mt-2 text-slate-500">
              The platform inventories documents placed in these directories and links them with exact page and section citations.
            </p>
          </div>

          {/* Method 2: Import / Export JSON */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c101d] border border-slate-200 dark:border-[#1f293d]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Import Structured JSON Library</span>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#182234] hover:bg-slate-100 dark:hover:bg-[#1f293d] border border-slate-200 dark:border-[#1f293d] text-xs font-mono text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Current JSON</span>
              </button>
            </div>
            <p className="mb-3">
              Paste structured JSON data conforming to the Microsoft Store content schema below to update experiments, viva questions, and programs:
            </p>

            <textarea
              rows={6}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON array of Subject objects here..."
              className="w-full p-2.5 rounded-lg bg-white dark:bg-[#182234] border border-slate-200 dark:border-[#1f293d] font-mono text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            />

            {statusMessage && (
              <div
                className={`mt-2 p-2.5 rounded-lg text-xs flex items-center gap-1.5 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={handleImport}
                disabled={!jsonInput.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-mono text-xs font-medium transition-colors shadow-sm"
              >
                Apply Imported Data
              </button>
            </div>
          </div>

          {/* Reset to defaults */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">Reset library back to initial structure:</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all subjects back to initial library state?')) {
                  onResetToDefaults();
                  onClose();
                }
              }}
              className="flex items-center gap-1 text-xs font-mono text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
