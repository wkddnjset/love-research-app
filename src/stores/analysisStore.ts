import { create } from 'zustand';

import type { AnalysisModuleType } from '@/types';

interface AnalysisState {
  isAnalyzing: boolean;
  currentModule: AnalysisModuleType | null;
  setAnalyzing: (analyzing: boolean) => void;
  setCurrentModule: (module: AnalysisModuleType | null) => void;
}

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  isAnalyzing: false,
  currentModule: null,
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setCurrentModule: (currentModule) => set({ currentModule }),
}));
