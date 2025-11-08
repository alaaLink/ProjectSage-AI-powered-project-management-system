
import React from 'react';
import { View } from '../types';
import { DashboardIcon, ProjectsIcon, DocumentsIcon, TeamIcon, SettingsIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  setProjectId: (id: string | null) => void;
  isSidebarOpen: boolean;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-md'
          : 'text-text-secondary hover:bg-accent-gray hover:text-text-primary'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, setProjectId, isSidebarOpen }) => {
  const handleNavigation = (view: View) => {
    setView(view);
    if (view !== 'project') {
      setProjectId(null);
    }
  };

  return (
    <aside className={`bg-white text-text-primary w-64 p-4 flex flex-col fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center mb-8 px-2">
        <svg className="w-10 h-10 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5L6 12l1.41-1.41L10.5 13.67l5.09-5.09L17 10l-6.5 6.5z"/>
        </svg>
        <h1 className="text-2xl font-bold ml-2">ProjectSage</h1>
      </div>
      <nav>
        <ul>
          <NavItem
            icon={<DashboardIcon className="w-6 h-6" />}
            label="Dashboard"
            isActive={currentView === 'dashboard'}
            onClick={() => handleNavigation('dashboard')}
          />
          <NavItem
            icon={<ProjectsIcon className="w-6 h-6" />}
            label="Projects"
            isActive={currentView === 'project'}
            onClick={() => handleNavigation('dashboard')} // Go to dashboard to select a project
          />
          <NavItem
            icon={<DocumentsIcon className="w-6 h-6" />}
            label="Documents AI"
            isActive={currentView === 'documents'}
            onClick={() => handleNavigation('documents')}
          />
          <NavItem
            icon={<TeamIcon className="w-6 h-6" />}
            label="Team"
            isActive={currentView === 'team'}
            onClick={() => handleNavigation('team')}
          />
        </ul>
      </nav>
      <div className="mt-auto">
        <NavItem
          icon={<SettingsIcon className="w-6 h-6" />}
          label="Settings"
          isActive={currentView === 'settings'}
          onClick={() => handleNavigation('settings')}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
