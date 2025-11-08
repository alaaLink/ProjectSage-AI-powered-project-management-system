
import React, { useState, useEffect } from 'react';
import { Project, User, View } from '../types';
import { fetchProjects } from '../services/mockApi';
import { LoadingSpinner, ProjectsIcon } from './icons';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'On Track': return 'bg-green-100 text-green-700';
      case 'At Risk': return 'bg-yellow-100 text-yellow-700';
      case 'Off Track': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => onSelectProject(project.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-text-primary">{project.name}</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>
      <p className="text-sm text-text-secondary mt-2 mb-4 h-10 overflow-hidden">{project.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-text-secondary mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-light-gray rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-text-secondary">
        <div>
          <p className="font-semibold">Due Date</p>
          <p>{new Date(project.endDate).toLocaleDateString()}</p>
        </div>
        <div className="flex -space-x-2">
          {project.team.slice(0, 4).map((user: User) => (
            <img key={user.id} src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white" title={user.name} />
          ))}
          {project.team.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
              +{project.team.length - 4}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DashboardViewProps {
  setView: (view: View) => void;
  setProjectId: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setView, setProjectId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setIsLoading(false);
    };
    loadProjects();
  }, []);

  const handleSelectProject = (id: string) => {
    setProjectId(id);
    setView('project');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner className="w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Projects Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onSelectProject={handleSelectProject} />
        ))}
         <div className="bg-white/50 border-2 border-dashed border-accent-gray rounded-xl flex flex-col justify-center items-center p-6 hover:bg-white hover:border-primary transition-all duration-300 cursor-pointer text-text-secondary hover:text-primary">
            <ProjectsIcon className="w-12 h-12 mb-2" />
            <span className="font-semibold">Create New Project</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
