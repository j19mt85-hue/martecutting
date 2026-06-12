import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Part, Module, SawType, OptMode, Sheet, Remnant, Material, Edgeband } from '../types';
import { BinResult } from '../engine/types';

export interface AppState {
  sawType: SawType;
  mode: OptMode;
  activeTab: 'modules' | 'parts' | 'sheets' | 'remnants' | 'materials' | 'edgebands' | 'analytics';
  isSidebarOpen: boolean;
  modules: Module[];
  parts: Part[];
  sheets: Sheet[];
  remnants: Remnant[];
  materials: Material[];
  edgebands: Edgeband[];
  aiPrompt: string;
  isOptimizing: boolean;
  results: BinResult[] | null;
  setSidebarOpen: (val: boolean) => void;
  setSawType: (val: SawType) => void;
  setMode: (val: OptMode) => void;
  setActiveTab: (val: 'modules' | 'parts' | 'sheets' | 'remnants' | 'materials' | 'edgebands' | 'analytics') => void;
  setAiPrompt: (val: string) => void;
  updatePart: (id: string, updates: Partial<Part>) => void;
  addPart: () => void;
  removePart: (id: string) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  addModule: () => void;
  removeModule: (id: string) => void;
  updateSheet: (id: string, updates: Partial<Sheet>) => void;
  addSheet: () => void;
  removeSheet: (id: string) => void;
  updateRemnant: (id: string, updates: Partial<Remnant>) => void;
  addRemnant: () => void;
  removeRemnant: (id: string) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  addMaterial: () => void;
  removeMaterial: (id: string) => void;
  updateEdgeband: (id: string, updates: Partial<Edgeband>) => void;
  addEdgeband: () => void;
  removeEdgeband: (id: string) => void;
  runOptimization: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sawType: 'horizontal',
      mode: 'smart',
      activeTab: 'parts',
      isSidebarOpen: false,
      aiPrompt: '',
      isOptimizing: false,
      results: null,
      modules: [
        { id: 'm1', name: 'კარადა 1', color: '#3b82f6' },
        { id: 'm2', name: 'სამზარეულო', color: '#10b981' },
        { id: 'm3', name: 'მაგიდა', color: '#f59e0b' }
      ],
      parts: [
        { id: 'p1', name: 'კარადის გვერდი', w: 2000, h: 600, qty: 2, grain: 'none', edges: { top: 0, bottom: 0, left: 4, right: 4 }, moduleId: 'm1' },
        { id: 'p2', name: 'თარო', w: 564, h: 500, qty: 4, grain: 'horizontal', edges: { top: 4, bottom: 0, left: 0, right: 0 }, moduleId: 'm1' },
        { id: 'p3', name: 'ფასადი', w: 715, h: 396, qty: 2, grain: 'vertical', edges: { top: 4, bottom: 4, left: 4, right: 4 }, moduleId: 'm2' }
      ],
      sheets: [
        { id: 's1', w: 2800, h: 2070, cost: 150, qty: 10, trim: 15, defects: [] }
      ],
      remnants: [],
      materials: [
        { id: 'mat1', name: 'MDF White', thickness: 18 }
      ],
      edgebands: [
        { id: 'eb1', name: 'White 2mm', thickness: 2 },
        { id: 'eb2', name: 'White 0.4mm', thickness: 0.4 }
      ],
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
      setSawType: (sawType) => set({ sawType }),
      setMode: (mode) => set({ mode }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setAiPrompt: (aiPrompt) => set({ aiPrompt }),
      updatePart: (id, updates) => set((state) => ({ 
        parts: state.parts.map(p => p.id === id ? { ...p, ...updates } : p) 
      })),
      addPart: () => set((state) => ({ 
        parts: [{ 
          id: Date.now().toString(), 
          name: 'ახალი დეტალი', 
          w: 100, 
          h: 100, 
          qty: 1, 
          grain: 'none', 
          edges: { top: 0, bottom: 0, left: 0, right: 0 }, 
          moduleId: state.modules[0]?.id 
        }, ...state.parts] 
      })),
      removePart: (id) => set((state) => ({ 
        parts: state.parts.filter(p => p.id !== id) 
      })),
      updateModule: (id, updates) => set((state) => ({
        modules: state.modules.map(m => m.id === id ? { ...m, ...updates } : m)
      })),
      addModule: () => set((state) => {
        const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return {
          modules: [{
            id: Date.now().toString(),
            name: 'ახალი მოდული',
            color: randomColor
          }, ...state.modules]
        };
      }),
      removeModule: (id) => set((state) => ({
        modules: state.modules.filter(m => m.id !== id),
        parts: state.parts.map(p => p.moduleId === id ? { ...p, moduleId: undefined } : p)
      })),
      updateSheet: (id, updates) => set((state) => ({
        sheets: state.sheets.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      addSheet: () => set((state) => ({
        sheets: [{ id: Date.now().toString(), w: 2800, h: 2070, cost: 0, qty: 1, trim: 15, defects: [] }, ...state.sheets]
      })),
      removeSheet: (id) => set((state) => ({
        sheets: state.sheets.filter(s => s.id !== id)
      })),
      updateRemnant: (id, updates) => set((state) => ({
        remnants: state.remnants.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      addRemnant: () => set((state) => ({
        remnants: [{ id: Date.now().toString(), w: 1000, h: 500, label: 'N-' + Date.now().toString().slice(-4), material: 'MDF' }, ...state.remnants]
      })),
      removeRemnant: (id) => set((state) => ({
        remnants: state.remnants.filter(r => r.id !== id)
      })),
      updateMaterial: (id, updates) => set((state) => ({
        materials: state.materials.map(m => m.id === id ? { ...m, ...updates } : m)
      })),
      addMaterial: () => set((state) => ({
        materials: [{ id: Date.now().toString(), name: 'ახალი მასალა', thickness: 18 }, ...state.materials]
      })),
      removeMaterial: (id) => set((state) => ({
        materials: state.materials.filter(m => m.id !== id)
      })),
      updateEdgeband: (id, updates) => set((state) => ({
        edgebands: state.edgebands.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      addEdgeband: () => set((state) => ({
        edgebands: [{ id: Date.now().toString(), name: 'ახალი წიბო', thickness: 2 }, ...state.edgebands]
      })),
      removeEdgeband: (id) => set((state) => ({
        edgebands: state.edgebands.filter(e => e.id !== id)
      })),
      runOptimization: () => {
        set({ isOptimizing: true, results: null });
        
        const { parts, sheets, sawType, mode } = get();
        
        setTimeout(() => {
          import('../engine/guillotine').then(({ optimize }) => {
            const mappedItems = parts.flatMap(p => 
              Array.from({ length: p.qty }).map((_, i) => ({
                id: `${p.id}-${i}`,
                w: p.w,
                h: p.h,
                canRotate: p.grain === 'none'
              }))
            );
            
            const mappedBins = sheets.flatMap(s => 
              Array.from({ length: s.qty }).map(() => ({
                w: s.w,
                h: s.h
              }))
            );

            // Using mock layout engine directly on client for demonstration
            const generatedResults = optimize(mappedItems, mappedBins, 4);
            set({ isOptimizing: false, results: generatedResults });
          }).catch(err => {
            console.error(err);
            set({ isOptimizing: false });
          });
        }, 1500);
      }
    }),
    {
      name: 'smart-raskroi-storage',
      partialize: (state) => ({
        sawType: state.sawType,
        mode: state.mode,
        activeTab: state.activeTab,
        modules: state.modules,
        parts: state.parts,
        sheets: state.sheets,
        remnants: state.remnants,
        materials: state.materials,
        edgebands: state.edgebands,
        aiPrompt: state.aiPrompt,
      }), // only persist these fields
    }
  )
);
