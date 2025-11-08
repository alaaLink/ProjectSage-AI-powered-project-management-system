
import React from 'react';
import { ChevronDownIcon } from './icons';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-500 mr-4 md:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="w-40 sm:w-64 pl-4 pr-10 py-2 rounded-full bg-light-gray border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <svg className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src="https://picsum.photos/seed/diana/100"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-primary"
            />
            <div className="hidden sm:block">
              <p className="font-semibold text-text-primary">Diana Miller</p>
              <p className="text-sm text-text-secondary">Project Manager</p>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-gray-500 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
