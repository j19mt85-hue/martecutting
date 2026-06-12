import { Layers, Cuboid, Map, ArchiveRestore, Box, Scissors, X, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PartsTable } from './PartsTable';
import { ModulesTable } from './ModulesTable';
import { SheetsTable } from './SheetsTable';
import { RemnantsTable } from './RemnantsTable';
import { MaterialsTable } from './MaterialsTable';
import { EdgebandsTable } from './EdgebandsTable';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { motion, AnimatePresence } from 'motion/react';

export function LeftPanel() {
  const { activeTab, setActiveTab, isSidebarOpen, setSidebarOpen } = useAppStore();

  const tabs = [
    { id: 'modules', icon: Cuboid, label: 'მოდულები' },
    { id: 'parts', icon: Layers, label: 'დეტალები' },
    { id: 'sheets', icon: Map, label: 'ფურცლები' },
    { id: 'remnants', icon: ArchiveRestore, label: 'ნარჩენები' },
    { id: 'materials', icon: Box, label: 'მასალები' },
    { id: 'edgebands', icon: Scissors, label: 'წიბოები' },
    { id: 'analytics', icon: BarChart3, label: 'ანალიტიკა' }
  ] as const;

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setSidebarOpen(false)}
             className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`fixed lg:static inset-y-0 left-0 w-[85vw] sm:w-[420px] shrink-0 flex h-full border-r border-slate-800/80 glass-panel bg-slate-950/95 lg:bg-slate-950/70 z-40 lg:z-10 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Mobile Close Button inside panel */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg lg:hidden z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Side Tabs Rail */}
      <div className="w-[72px] bg-slate-950/90 border-r border-slate-800/80 flex flex-col items-center py-6 gap-3 z-20 overflow-y-auto custom-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex flex-col items-center justify-center p-3 w-14 h-14 rounded-2xl transition-all duration-300 group`}
                title={tab.label}
             >
                {isActive && (
                  <motion.div 
                    layoutId="active-tab-rail" 
                    className="absolute inset-0 bg-blue-600/10 border border-blue-500/30 rounded-2xl -z-10 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <Icon className={`w-5 h-5 mb-1.5 transition-colors ${isActive ? 'text-blue-400 stroke-[2.5px]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className={`text-[8px] font-bold tracking-wider uppercase transition-colors ${isActive ? 'text-blue-300' : 'text-slate-500 group-hover:text-slate-400'}`}>
                  {tab.label.slice(0, 3)}
                </span>
             </button>
          )
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 bg-slate-900/30 overflow-hidden relative">
        {activeTab === 'parts' && <PartsTable />}
        {activeTab === 'modules' && <ModulesTable />}
        {activeTab === 'sheets' && <SheetsTable />}
        {activeTab === 'remnants' && <RemnantsTable />}
        {activeTab === 'materials' && <MaterialsTable />}
        {activeTab === 'edgebands' && <EdgebandsTable />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
    </>
  );
}
