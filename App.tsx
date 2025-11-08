
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ProjectDetailView from './components/ProjectDetailView';
import DocumentAnalysisView from './components/DocumentAnalysisView';
import TeamFormationView from './components/TeamFormationView';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'project':
        return currentProjectId ? <ProjectDetailView projectId={currentProjectId} /> : <DashboardView setView={setCurrentView} setProjectId={setCurrentProjectId} />;
      case 'documents':
        return <DocumentAnalysisView />;
      case 'team':
        return <TeamFormationView />;
      case 'dashboard':
      default:
        return <DashboardView setView={setCurrentView} setProjectId={setCurrentProjectId} />;
    }
  };
  
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-light-gray">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        setProjectId={setCurrentProjectId}
        isSidebarOpen={isSidebarOpen}
      />
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-20 md:hidden"></div>}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
