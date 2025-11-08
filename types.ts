export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  skills: Skill[];
  availability: 'Available' | 'Partially Available' | 'Unavailable';
}

export interface Skill {
  name: string;
  proficiency: 1 | 2 | 3 | 4 | 5; // 1 = Novice, 5 = Expert
}

export interface SkillRequirement {
  id: string;
  name: string;
  proficiency: number;
  priority: 'Critical' | 'Important' | 'Nice to Have';
}

export interface TeamRecommendation {
  id: string;
  team: User[];
  matchScore: number; // A score from 0 to 100
  justification: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
  assignee: User;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Document {
  id: string;
  name: string;
  type: 'Requirements' | 'Architecture' | 'Meeting Notes';
  uploadDate: string;
  status: 'Pending Analysis' | 'Analyzing' | 'Analyzed' | 'Error';
}

// Fix: Added the missing Project interface to resolve compilation errors.
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'On Track' | 'At Risk' | 'Off Track';
  progress: number;
  startDate: string;
  endDate: string;
  team: User[];
  tasks: Task[];
  documents: Document[];
}

export interface ExtractedItem {
  id:string;
  description: string;
  confidence: number; // A score from 0 to 1
  source: string; // e.g., "Page 2, Paragraph 3"
}

export interface AIAnalysis {
  summary: string;
  functionalRequirements: ExtractedItem[];
  nonFunctionalRequirements: ExtractedItem[];
  timelineIndicators: ExtractedItem[];
  suggestedTeam: User[];
  suggestedArchitecture: {
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  };
}


export type View = 'dashboard' | 'project' | 'documents' | 'team' | 'settings';