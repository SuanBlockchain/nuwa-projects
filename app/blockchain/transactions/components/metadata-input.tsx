'use client';

import { useState, useCallback } from 'react';
import type { MetadataMode } from '@/app/lib/cardano/transaction-types';
import { CloudArrowUpIcon, CodeBracketIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface MetadataInputProps {
  mode: MetadataMode;
  onModeChange: (mode: MetadataMode) => void;
  textMessage: string;
  onTextMessageChange: (message: string) => void;
  jsonData: string;
  onJsonDataChange: (json: string) => void;
}

export function MetadataInput({
  mode,
  onModeChange,
  textMessage,
  onTextMessageChange,
  jsonData,
  onJsonDataChange,
}: MetadataInputProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    if (file.type !== 'application/json') {
      alert('Please upload a JSON file');
      return;
    }

    if (file.size > 16 * 1024) {
      alert('File size must be less than 16KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        // Validate JSON
        JSON.parse(content);
        onJsonDataChange(content);
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }, [onJsonDataChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 md:p-8 shadow-sm">
      {/* Header with Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <CodeBracketIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Metadata</h2>
        </div>

        {/* Toggle Switch */}
        <div className="bg-gray-100 dark:bg-background-dark p-1 rounded-lg flex border border-gray-300 dark:border-border-dark">
          <button
            type="button"
            onClick={() => onModeChange('json')}
            className={`px-4 py-1.5 rounded text-xs font-bold shadow-sm transition-all ${
              mode === 'json'
                ? 'bg-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            JSON Upload
          </button>
          <button
            type="button"
            onClick={() => onModeChange('text')}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${
              mode === 'text'
                ? 'bg-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Text Message
          </button>
          <button
            type="button"
            onClick={() => onModeChange('none')}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${
              mode === 'none'
                ? 'bg-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            None
          </button>
        </div>
      </div>

      {/* JSON Upload Mode */}
      {mode === 'json' && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl bg-gray-50 dark:bg-background-dark/50 hover:bg-gray-100 dark:hover:bg-background-dark/80 transition-all cursor-pointer group relative overflow-hidden ${
              isDragging ? 'border-primary bg-gray-100 dark:bg-background-dark' : 'border-gray-300 dark:border-border-dark'
            }`}
          >
            <input
              type="file"
              accept="application/json"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 mb-4 rounded-full bg-gray-200 dark:bg-surface-dark flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <CloudArrowUpIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-600 dark:text-gray-500 text-sm">JSON files only (max 16KB)</p>
            </div>
          </div>

          {/* JSON Preview */}
          {jsonData && (
            <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-[#0a0f0d] border border-gray-300 dark:border-border-dark font-mono text-xs text-gray-800 dark:text-gray-400 overflow-x-auto">
              <pre>{jsonData}</pre>
            </div>
          )}
        </>
      )}

      {/* Text Message Mode */}
      {mode === 'text' && (
        <div>
          <textarea
            value={textMessage}
            onChange={(e) => onTextMessageChange(e.target.value)}
            placeholder="Enter a message to attach to this transaction..."
            className="w-full bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-border-dark text-gray-900 dark:text-white rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
            maxLength={500}
          />
          <p className="text-gray-600 dark:text-gray-500 text-xs mt-2">
            {textMessage.length}/500 characters
          </p>
        </div>
      )}

      {/* None Mode */}
      {mode === 'none' && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 text-sm">No metadata will be attached to this transaction</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-gray-900 dark:text-white text-sm font-bold mb-1">
              {mode === 'json' ? 'JSON Metadata Format' : 'Metadata Info'}
            </h4>
            {mode === 'json' ? (
              <div className="text-gray-700 dark:text-gray-400 text-xs leading-relaxed space-y-1">
                <p>JSON keys must be strings. Example:</p>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-background-dark rounded text-[11px] overflow-x-auto">
{`{
  "msg": "Your message here",
  "type": "payment",
  "amount": 100
}`}
                </pre>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-400 text-xs leading-relaxed">
                Cardano transactions can carry arbitrary metadata, allowing you to attach
                messages or structured data directly on-chain.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
