
import React, { useState, useEffect } from 'react';
import { Project, Task, User } from '../types';
import { fetchProjectById } from '../services/mockApi';
// Fix: Imported DocumentsIcon to be used in the component.
import { LoadingSpinner, DocumentsIcon } from './icons';

interface ProjectDetailViewProps {
  projectId: string;
}

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const statusColors = {
    'To Do': 'bg-gray-200 text-gray-800',
    'In Progress': 'bg-blue-200 text-blue-800',
    'Done': 'bg-green-200 text-green-800',
    'Blocked': 'bg-red-200 text-red-800'
  };
  const priorityColors = {
      'High': 'border-l-red-500',
      'Medium': 'border-l-yellow-500',
      'Low': 'border-l-green-500',
  }
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border-l-4 ${priorityColors[task.priority]}`}>
      <div>
        <p className="font-semibold text-text-primary">{task.title}</p>
        <p className="text-sm text-text-secondary">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[task.status]}`}>{task.status}</span>
        <img src={task.assignee.avatarUrl} alt={task.assignee.name} title={task.assignee.name} className="w-8 h-8 rounded-full border-2 border-white shadow"/>
      </div>
    </div>
  );
};

const GanttChart: React.FC<{ project: Project }> = ({ project }) => {
    const projectStart = new Date(project.startDate).getTime();
    const projectEnd = new Date(project.endDate).getTime();
    const totalDuration = projectEnd - projectStart;

    const taskBars = project.tasks.map(task => {
        const taskStart = new Date(project.startDate).getTime() + Math.random() * (totalDuration / 2); // Mock start date
        const taskEnd = taskStart + Math.random() * (totalDuration / 2);
        
        const left = ((taskStart - projectStart) / totalDuration) * 100;
        const width = ((taskEnd - taskStart) / totalDuration) * 100;
        
        return { ...task, left, width };
    });

    return (
        <div className="space-y-3 p-2">
            {taskBars.map(task => (
                <div key={task.id} className="flex items-center group">
                    <div className="w-1/4 text-sm text-text-primary truncate pr-2">{task.title}</div>
                    <div className="w-3/4 bg-light-gray rounded-full h-8 relative">
                         <div
                            className="absolute top-0 left-0 h-full bg-secondary rounded-full flex items-center pl-2"
                            style={{ left: `${task.left}%`, width: `${task.width}%` }}
                        >
                            <img src={task.assignee.avatarUrl} className="w-6 h-6 rounded-full border-2 border-white"/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      const data = await fetchProjectById(projectId);
      setProject(data || null);
      setIsLoading(false);
    };
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner className="w-12 h-12 text-primary" /></div>;
  }

  if (!project) {
    return <div className="p-6 text-center text-text-secondary">Project not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-text-primary">{project.name}</h2>
        <p className="text-text-secondary mt-1">{project.description}</p>
        <div className="mt-4 flex items-center space-x-6">
            <div className="flex -space-x-3">
              {project.team.map((user: User) => (
                <img key={user.id} src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white" title={user.name} />
              ))}
            </div>
            <div>
                <p className="text-sm text-text-secondary">Due Date</p>
                <p className="font-semibold">{new Date(project.endDate).toLocaleDateString()}</p>
            </div>
            <div>
                 <p className="text-sm text-text-secondary">Status</p>
                <p className="font-semibold">{project.status}</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-text-primary mb-4">Task List</h3>
            <div className="space-y-3">
              {project.tasks.map(task => <TaskItem key={task.id} task={task} />)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-text-primary mb-4">Documents</h3>
            <ul className="space-y-2">
                {project.documents.map(doc => (
                    <li key={doc.id} className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                        <div className="flex items-center">
                            <DocumentsIcon className="w-5 h-5 text-secondary mr-3" />
                            <span className="text-text-primary font-medium">{doc.name}</span>
                        </div>
                        <span className={`text-xs font-semibold ${doc.status === 'Analyzed' ? 'text-green-600' : 'text-yellow-600'}`}>{doc.status}</span>
                    </li>
                ))}
            </ul>
          </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-text-primary mb-4">Project Timeline</h3>
        <GanttChart project={project} />
      </div>

    </div>
  );
};

export default ProjectDetailView;
