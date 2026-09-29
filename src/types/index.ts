export interface Hotspot {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low' | string;
  issue: string;
  immediateAction: string;
  permanentSolution: string;
  suggestedItems: string[];
  estimatedMinutes: number;
}

export interface ActionStep {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface ActionPlanPhase {
  phaseNumber: number;
  phaseTitle: string;
  estimatedTime: string;
  steps: ActionStep[];
}

export interface StorageTool {
  name: string;
  purpose: string;
  budgetLevel: string;
  diyAlternative: string;
}

export interface RoomAnalysisData {
  roomType: string;
  overallClutterLevel: string;
  summary: string;
  hotspots: Hotspot[];
  actionPlanPhases: ActionPlanPhase[];
  recommendedStorageTools: StorageTool[];
  maintenanceRitual: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export type PersonaType = 'organizer' | 'minimalist' | 'spatial_architect' | 'fast_budget';

export type TaskComplexity = 'complex' | 'general' | 'fast';
