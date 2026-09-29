import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Wrench,
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Package,
  Layers,
  Repeat,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { RoomAnalysisData, Hotspot } from '../types';

interface RoomAnalysisViewProps {
  data: RoomAnalysisData;
  imageUrl: string;
  onOpenChat: (initialMessage?: string) => void;
  onNewAnalysis: () => void;
}

export const RoomAnalysisView: React.FC<RoomAnalysisViewProps> = ({
  data,
  imageUrl,
  onOpenChat,
  onNewAnalysis,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [activePhaseFilter, setActivePhaseFilter] = useState<number | 'all'>('all');
  const [expandedHotspots, setExpandedHotspots] = useState<Record<string, boolean>>({});

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const toggleHotspotExpand = (id: string) => {
    setExpandedHotspots((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate total steps and progress
  const allSteps = data.actionPlanPhases.flatMap((p) => p.steps);
  const totalStepsCount = allSteps.length;
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent =
    totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'high':
      case 'severe':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <Flame className="w-3 h-3 text-rose-500" />
            High Friction
          </span>
        );
      case 'medium':
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            Mild
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Overview */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-2">
              <span className="font-semibold text-neutral-900 uppercase tracking-wider">
                {data.roomType || 'Analyzed Room'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Clutter Level:</span>
              <span className="font-medium text-neutral-800">{data.overallClutterLevel}</span>
              <span aria-hidden="true">·</span>
              <span>Model: gemini-3.1-pro-preview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-display">
              Spatial Decluttering & Organization Assessment
            </h1>
            <p className="mt-2 text-sm text-neutral-600 max-w-3xl leading-relaxed">
              {data.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenChat(`Help me start organizing my ${data.roomType}. Where should I begin?`)}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Chat with AI Coach
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Plan
            </button>
            <button
              onClick={onNewAnalysis}
              className="px-3.5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
            >
              Upload Another Photo
            </button>
          </div>
        </div>

        {/* Progress Tracker Strip */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-600 mb-2">
            <span>Overall Action Plan Progress</span>
            <span className="font-mono tabular-nums font-semibold text-neutral-900">
              {completedStepsCount} of {totalStepsCount} steps completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-neutral-900 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Room Inspector & Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Room Photo & Detected Hotspot Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider font-display">
                Room Photo & Focus Areas
              </h2>
              <span className="text-xs text-neutral-400 font-mono tabular-nums">
                {data.hotspots.length} hotspots detected
              </span>
            </div>
            <div className="relative bg-neutral-900">
              <img
                src={imageUrl}
                alt="Analyzed Room"
                referrerPolicy="no-referrer"
                className="w-full max-h-[380px] object-contain mx-auto"
              />
            </div>
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-600">
              Select any hotspot below to inspect the recommended immediate action and sustainable storage solution.
            </div>
          </div>

          {/* Hotspot Cards List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Detected Clutter Hotspots
            </h3>
            {data.hotspots.map((hotspot, idx) => {
              const isSelected = selectedHotspotId === hotspot.id;
              const isExpanded = expandedHotspots[hotspot.id] ?? true;

              return (
                <div
                  key={hotspot.id || idx}
                  className={`bg-white border rounded-xl p-4 transition-all ${
                    isSelected
                      ? 'border-neutral-900 ring-2 ring-neutral-900/10 shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300 shadow-xs'
                  }`}
                  onClick={() => setSelectedHotspotId(hotspot.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-neutral-400">
                          0{idx + 1}.
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900 font-display">
                          {hotspot.title}
                        </h4>
                        {getSeverityBadge(hotspot.severity)}
                      </div>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {hotspot.issue}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHotspotExpand(hotspot.id);
                      }}
                      className="p-1 text-neutral-400 hover:text-neutral-700"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100 text-amber-900">
                        <span className="font-semibold text-amber-800">5-Min Quick Win: </span>
                        {hotspot.immediateAction}
                      </div>

                      <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-800">
                        <span className="font-semibold text-neutral-900">Permanent System: </span>
                        {hotspot.permanentSolution}
                      </div>

                      {hotspot.suggestedItems && hotspot.suggestedItems.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-neutral-500">
                          <span className="font-medium text-neutral-700">Tools:</span>
                          {hotspot.suggestedItems.map((item, itemIdx) => (
                            <span key={itemIdx} className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Est. Time: {hotspot.estimatedMinutes || 15} mins
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenChat(`How do I tackle "${hotspot.title}" step by step?`);
                          }}
                          className="text-neutral-900 font-medium hover:underline flex items-center gap-1"
                        >
                          Ask Coach &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3-Phase Action Plan Checklist & Tools */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Plan Container */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 font-display">
                  3-Phase Decluttering Action Plan
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Follow in sequential order to prevent overwhelm and keep momentum.
                </p>
              </div>

              {/* Segmented Phase Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                <button
                  onClick={() => setActivePhaseFilter('all')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    activePhaseFilter === 'all'
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All Steps
                </button>
                {data.actionPlanPhases.map((phase) => (
                  <button
                    key={phase.phaseNumber}
                    onClick={() => setActivePhaseFilter(phase.phaseNumber)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      activePhaseFilter === phase.phaseNumber
                        ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Phase {phase.phaseNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Phases */}
            <div className="mt-6 space-y-6">
              {data.actionPlanPhases
                .filter((p) => activePhaseFilter === 'all' || activePhaseFilter === p.phaseNumber)
                .map((phase) => (
                  <div key={phase.phaseNumber} className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs font-mono font-bold flex items-center justify-center">
                          {phase.phaseNumber}
                        </span>
                        <h3 className="text-sm font-bold text-neutral-900 font-display">
                          {phase.phaseTitle}
                        </h3>
                      </div>
                      <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        {phase.estimatedTime}
                      </span>
                    </div>

                    {/* Steps Checklist */}
                    <div className="space-y-2">
                      {phase.steps.map((step) => {
                        const isDone = Boolean(completedSteps[step.id]);

                        return (
                          <div
                            key={step.id}
                            onClick={() => toggleStep(step.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                              isDone
                                ? 'bg-neutral-50 border-neutral-200 text-neutral-400'
                                : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800 hover:bg-neutral-50/50'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 text-neutral-900 focus:outline-none shrink-0"
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-neutral-300 hover:text-neutral-500" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4
                                  className={`text-sm font-semibold ${
                                    isDone ? 'line-through text-neutral-400' : 'text-neutral-900'
                                  }`}
                                >
                                  {step.title}
                                </h4>
                                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-100">
                                  {step.category}
                                </span>
                              </div>
                              <p
                                className={`text-xs mt-1 leading-relaxed ${
                                  isDone ? 'text-neutral-400' : 'text-neutral-600'
                                }`}
                              >
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Recommended Storage Tools */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-neutral-700" />
              <h2 className="text-base font-bold text-neutral-900 font-display">
                Recommended Organizing & Storage Systems
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.recommendedStorageTools.map((tool, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-neutral-900 font-display">
                        {tool.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-neutral-700 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">
                        {tool.budgetLevel}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                      {tool.purpose}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-700">
                    <span className="font-semibold text-neutral-900">Zero-Cost DIY: </span>
                    {tool.diyAlternative}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Maintenance Rituals */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Repeat className="w-5 h-5 text-neutral-700" />
              <h2 className="text-base font-bold text-neutral-900 font-display">
                Daily Maintenance Rituals (Stay Tidy Forever)
              </h2>
            </div>
            <div className="space-y-2.5">
              {data.maintenanceRitual.map((ritual, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                  <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{ritual}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
