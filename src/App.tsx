import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { RoomAnalysisView } from './components/RoomAnalysisView';
import { DeclutterChat } from './components/DeclutterChat';
import { OrganizingPlaybook } from './components/OrganizingPlaybook';
import { RoomAnalysisData } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'chat' | 'guide'>('upload');
  const [analysisData, setAnalysisData] = useState<RoomAnalysisData | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);

  const handleAnalyze = async (
    image: string,
    mimeType: string,
    roomType: string,
    goal: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          mimeType,
          roomType,
          goal,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned status ${res.status}`);
      }

      const result = await res.json();
      if (!result.data) {
        throw new Error('No structured analysis returned from Gemini.');
      }

      setAnalysisData(result.data);
      setActiveImageUrl(image);
      setActiveTab('analysis');
    } catch (err: any) {
      console.error('Failed to analyze room:', err);
      setErrorMessage(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChatWithPrompt = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasAnalysis={Boolean(analysisData)}
        onNewUpload={() => setActiveTab('upload')}
      />

      <main className="flex-1 pb-16">
        {errorMessage && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-sm text-rose-800">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold text-rose-700 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Upload & Image selection */}
        {activeTab === 'upload' && (
          <ImageUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {/* Tab 2: Visual Room Analysis & Action Plan */}
        {activeTab === 'analysis' && analysisData && activeImageUrl && (
          <RoomAnalysisView
            data={analysisData}
            imageUrl={activeImageUrl}
            onOpenChat={handleOpenChatWithPrompt}
            onNewAnalysis={() => setActiveTab('upload')}
          />
        )}

        {/* Tab 3: Gemini Chatbot */}
        {activeTab === 'chat' && (
          <DeclutterChat
            roomContext={analysisData}
            initialMessage={chatInitialPrompt}
            onClearInitialMessage={() => setChatInitialPrompt(undefined)}
          />
        )}

        {/* Tab 4: Organizing Playbook & Principles */}
        {activeTab === 'guide' && (
          <OrganizingPlaybook
            onStartAnalysis={() => setActiveTab('upload')}
            onOpenChat={handleOpenChatWithPrompt}
          />
        )}
      </main>

      {/* Clean, quiet footer following anti-slop rules (no fake telemetry tickers) */}
      <footer className="border-t border-neutral-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 font-display">DeclutterAI</span>
            <span>·</span>
            <span>AI Spatial Organization & Decluttering</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Gemini 3.1 Pro & 3.5 Flash</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-neutral-900 transition-colors"
            >
              Organizing Playbook
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
