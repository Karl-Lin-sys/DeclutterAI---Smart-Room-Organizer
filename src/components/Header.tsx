import React from 'react';
import { Sparkles, Camera, BookOpen, MessageSquare, CheckSquare } from 'lucide-react';

interface HeaderProps {
  activeTab: 'upload' | 'analysis' | 'chat' | 'guide';
  onSelectTab: (tab: 'upload' | 'analysis' | 'chat' | 'guide') => void;
  hasAnalysis: boolean;
  onNewUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  hasAnalysis,
  onNewUpload,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark in display face */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('upload');
          }}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 font-display">
            DeclutterAI
          </span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('upload')}
            className={`transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            Upload Space
          </button>

          <button
            onClick={() => onSelectTab('analysis')}
            disabled={!hasAnalysis}
            className={`transition-colors flex items-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'text-neutral-900 font-semibold'
                : hasAnalysis
                ? 'text-neutral-500 hover:text-neutral-900'
                : 'text-neutral-300 cursor-not-allowed'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Room Analysis & Plan
          </button>

          <button
            onClick={() => onSelectTab('chat')}
            className={`transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Declutter Coach
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Organizing Playbook
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewUpload}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shadow-sm hover:shadow"
          >
            + Analyze Room Photo
          </button>
        </div>
      </div>
    </header>
  );
};
