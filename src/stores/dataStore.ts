import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ExPartner, CurrentRelationship, ConflictRecord, EmotionRecord, AnalysisResult, AnalysisModuleType } from '@/types';

interface DataState {
  exPartners: ExPartner[];
  relationships: CurrentRelationship[];
  conflicts: ConflictRecord[];
  emotions: EmotionRecord[];
  analysisHistory: AnalysisResult[];

  addExPartner: (data: Omit<ExPartner, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateExPartner: (id: string, data: Partial<ExPartner>) => void;
  deleteExPartner: (id: string) => void;

  addRelationship: (data: Omit<CurrentRelationship, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateRelationship: (id: string, data: Partial<CurrentRelationship>) => void;
  deleteRelationship: (id: string) => void;

  addConflict: (data: Omit<ConflictRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateConflict: (id: string, data: Partial<ConflictRecord>) => void;
  deleteConflict: (id: string) => void;

  addEmotion: (data: Omit<EmotionRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  deleteEmotion: (id: string) => void;

  addAnalysisResult: (moduleType: AnalysisModuleType, inputData: Record<string, unknown>, result: Record<string, unknown>, score?: number) => void;
}

const now = () => new Date().toISOString();

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      exPartners: [],
      relationships: [],
      conflicts: [],
      emotions: [],
      analysisHistory: [],

      addExPartner: (data) =>
        set((state) => ({
          exPartners: [
            ...state.exPartners,
            { ...data, id: crypto.randomUUID(), userId: '', createdAt: now(), updatedAt: now() },
          ],
        })),
      updateExPartner: (id, data) =>
        set((state) => ({
          exPartners: state.exPartners.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: now() } : p
          ),
        })),
      deleteExPartner: (id) =>
        set((state) => ({
          exPartners: state.exPartners.filter((p) => p.id !== id),
        })),

      addRelationship: (data) =>
        set((state) => ({
          relationships: [
            ...state.relationships,
            { ...data, id: crypto.randomUUID(), userId: '', createdAt: now(), updatedAt: now() },
          ],
        })),
      updateRelationship: (id, data) =>
        set((state) => ({
          relationships: state.relationships.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: now() } : r
          ),
        })),
      deleteRelationship: (id) =>
        set((state) => ({
          relationships: state.relationships.filter((r) => r.id !== id),
        })),

      addConflict: (data) =>
        set((state) => ({
          conflicts: [
            ...state.conflicts,
            { ...data, id: crypto.randomUUID(), userId: '', createdAt: now(), updatedAt: now() },
          ],
        })),
      updateConflict: (id, data) =>
        set((state) => ({
          conflicts: state.conflicts.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: now() } : c
          ),
        })),
      deleteConflict: (id) =>
        set((state) => ({
          conflicts: state.conflicts.filter((c) => c.id !== id),
        })),

      addEmotion: (data) =>
        set((state) => ({
          emotions: [
            ...state.emotions,
            { ...data, id: crypto.randomUUID(), userId: '', createdAt: now(), updatedAt: now() },
          ],
        })),
      deleteEmotion: (id) =>
        set((state) => ({
          emotions: state.emotions.filter((e) => e.id !== id),
        })),

      addAnalysisResult: (moduleType, inputData, result, score) =>
        set((state) => ({
          analysisHistory: [
            {
              id: crypto.randomUUID(),
              userId: '',
              moduleType,
              inputData,
              result,
              score,
              createdAt: now(),
            },
            ...state.analysisHistory,
          ],
        })),
    }),
    { name: 'love-research-data' }
  )
);
