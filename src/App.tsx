/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TopBar } from './components/TopBar';
import { LeftPanel } from './components/LeftPanel';
import { Workspace } from './components/Workspace';
import { BottomBar } from './components/BottomBar';
import { PublicTrackingPage } from './components/PublicTrackingPage';

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith('/track') || path.startsWith('/quote')) {
    return <PublicTrackingPage />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 font-sans text-slate-200 overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden relative">
        <LeftPanel />
        <Workspace />
      </div>
      <BottomBar />
    </div>
  );
}

