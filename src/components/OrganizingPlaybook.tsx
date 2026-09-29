import React from 'react';
import { Box, Layers, Sparkles, Check, ArrowRight, Zap, Target, BookmarkCheck } from 'lucide-react';

interface OrganizingPlaybookProps {
  onStartAnalysis: () => void;
  onOpenChat: (prompt: string) => void;
}

export const OrganizingPlaybook: React.FC<OrganizingPlaybookProps> = ({
  onStartAnalysis,
  onOpenChat,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookmarkCheck className="w-3.5 h-3.5" />
          Master Decluttering Framework
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display mb-3">
          The Science of Spatial Order
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed">
          Decluttering isn't about throwing everything away—it is about establishing sustainable
          boundaries, frictionless homes for your possessions, and cultivating mental clarity.
        </p>
      </div>

      {/* The 4-Box Method */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Box className="w-5 h-5 text-neutral-900" />
          <h2 className="text-lg font-bold text-neutral-900 font-display">
            01. The Classic 4-Box Triage System
          </h2>
        </div>
        <p className="text-xs text-neutral-500 mb-6">
          Whenever you approach a cluttered space, label four physical receptacles before touching a single item.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <div className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider mb-1">
              Box 1
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-display mb-1.5">
              Trash & Recycle
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Expired items, broken plastic, old papers, dried-up pens, obsolete cables. Zero hesitation.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider mb-1">
              Box 2
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-display mb-1.5">
              Donate & Sell
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Clothes unworn in 12 months, duplicated kitchenware, books read once, unwanted gifts.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <div className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
              Box 3
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-display mb-1.5">
              Relocate
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Items that belong in another room (e.g. coffee mug on desk &rarr; kitchen dishwasher).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
              Box 4
            </div>
            <h3 className="text-sm font-bold text-neutral-900 font-display mb-1.5">
              Keep & Zone
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Beloved, essential daily items assigned to a permanent, labeled home within arm’s reach.
            </p>
          </div>
        </div>
      </div>

      {/* Golden Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 font-display mb-2">
            The 1-In-1-Out Rule
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            For every new object brought into the home (a shirt, mug, or notebook), one existing item must be donated or recycled. This maintains equilibrium.
          </p>
          <button
            onClick={() => onOpenChat('How do I enforce the 1-In-1-Out rule with my wardrobe and books?')}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
          >
            Ask Coach about this &rarr;
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 font-display mb-2">
            The 20/20 "Just-In-Case" Rule
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            If an item can be replaced for less than $20 in less than 20 minutes from your home, do not hold onto it "just in case" it might be needed someday.
          </p>
          <button
            onClick={() => onOpenChat('How does the 20/20 rule apply to spare cables and household gadgets?')}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
          >
            Ask Coach about this &rarr;
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 font-display mb-2">
            The 3 Ergonomic Reach Zones
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed mb-4">
            <strong>Zone 1 (Primary):</strong> Waist to chest height for daily items.<br />
            <strong>Zone 2 (Secondary):</strong> Bending or reaching for weekly gear.<br />
            <strong>Zone 3 (Tertiary):</strong> Top shelves for seasonal/holiday items.
          </p>
          <button
            onClick={() => onOpenChat('How do I zone my closet shelves using reach zones?')}
            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
          >
            Ask Coach about this &rarr;
          </button>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 bg-neutral-900 text-white rounded-2xl text-center space-y-4">
        <h3 className="text-2xl font-bold font-display">
          Ready to transform your actual room?
        </h3>
        <p className="text-sm text-neutral-300 max-w-xl mx-auto">
          Take a photo of your desk, closet, or living room and let Gemini 3.1 Pro generate your custom
          spatial breakdown and action checklist.
        </p>
        <button
          onClick={onStartAnalysis}
          className="px-6 py-3 bg-white text-neutral-900 font-bold text-sm rounded-xl hover:bg-neutral-100 transition-all shadow-md inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Analyze My Room Photo Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
