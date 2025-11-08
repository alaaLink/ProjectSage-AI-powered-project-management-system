import { Project, User, AIAnalysis, SkillRequirement, TeamRecommendation } from '../types';
import { GoogleGenAI, Type } from "@google/genai";


const users: User[] = [
  { id: 'u1', name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/alice/100', role: 'Frontend Dev', availability: 'Available', skills: [{ name: 'React', proficiency: 5 }, { name: 'TypeScript', proficiency: 4 }, { name: 'CSS', proficiency: 3 }] },
  { id: 'u2', name: 'Bob Williams', avatarUrl: 'https://picsum.photos/seed/bob/100', role: 'Backend Dev', availability: 'Available', skills: [{ name: 'Node.js', proficiency: 5 }, { name: 'PostgreSQL', proficiency: 4 }, { name: 'Docker', proficiency: 4 }] },
  { id: 'u3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/charlie/100', role: 'UI/UX Designer', availability: 'Partially Available', skills: [{ name: 'Figma', proficiency: 5 }, { name: 'User Research', proficiency: 4 }, { name: 'HTML', proficiency: 3 }] },
  { id: 'u4', name: 'Diana Miller', avatarUrl: 'https://picsum.photos/seed/diana/100', role: 'Project Manager', availability: 'Available', skills: [{ name: 'Agile', proficiency: 5 }, { name: 'Jira', proficiency: 5 }, { name: 'Communication', proficiency: 5 }] },
  { id: 'u5', name: 'Ethan Davis', avatarUrl: 'https://picsum.photos/seed/ethan/100', role: 'DevOps Engineer', availability: 'Available', skills: [{ name: 'GKE', proficiency: 5 }, { name: 'CI/CD', proficiency: 4 }, { name: 'Terraform', proficiency: 3 }] },
  { id: 'u6', name: 'Fiona Garcia', avatarUrl: 'https://picsum.photos/seed/fiona/100', role: 'QA Tester', availability: 'Unavailable', skills: [{ name: 'Cypress', proficiency: 4 }, { name: 'Playwright', proficiency: 3 }, { name: 'Jira', proficiency: 4 }] },
  { id: 'u7', name: 'George Clark', avatarUrl: 'https://picsum.photos/seed/george/100', role: 'Backend Dev', availability: 'Available', skills: [{ name: 'Python', proficiency: 4 }, { name: 'MongoDB', proficiency: 5 }, { name: 'Docker', proficiency: 3 }] },
  { id: 'u8', name: 'Hannah Scott', avatarUrl: 'https://picsum.photos/seed/hannah/100', role: 'Frontend Dev', availability: 'Partially Available', skills: [{ name: 'React', proficiency: 4 }, { name: 'GraphQL', proficiency: 3 }, { name: 'TypeScript', proficiency: 5 }] },
];

const projects: Project[] = [
  {
    id: 'p1',
    name: 'E-commerce Platform Relaunch',
    description: 'A complete overhaul of the existing e-commerce platform with a new UI and microservices architecture.',
    status: 'On Track',
    progress: 75,
    startDate: '2024-05-01',
    endDate: '2024-09-30',
    team: [users[0], users[1], users[3], users[5]],
    tasks: [
      { id: 't1', title: 'Design new UI mockups', status: 'Done', assignee: users[3], dueDate: '2024-05-20', priority: 'High' },
      { id: 't2', title: 'Develop user authentication service', status: 'In Progress', assignee: users[1], dueDate: '2024-07-15', priority: 'High' },
      { id: 't3', title: 'Build product catalog component', status: 'In Progress', assignee: users[0], dueDate: '2024-07-30', priority: 'Medium' },
      { id: 't4', title: 'Set up testing pipeline', status: 'To Do', assignee: users[5], dueDate: '2024-08-10', priority: 'Medium' },
    ],
    documents: [
      { id: 'd1', name: 'Initial Project Brief.docx', type: 'Requirements', uploadDate: '2024-05-02', status: 'Analyzed' },
      { id: 'd2', name: 'Q2 Stakeholder Meeting.pdf', type: 'Meeting Notes', uploadDate: '2024-06-15', status: 'Analyzed' },
    ]
  },
  {
    id: 'p2',
    name: 'Mobile Banking App',
    description: 'A new native mobile application for iOS and Android for personal banking services.',
    status: 'At Risk',
    progress: 40,
    startDate: '2024-06-15',
    endDate: '2024-12-20',
    team: [users[0], users[1], users[2], users[4]],
    tasks: [
      { id: 't5', title: 'Finalize app branding and style guide', status: 'In Progress', assignee: users[2], dueDate: '2024-07-10', priority: 'High' },
      { id: 't6', title: 'API gateway implementation', status: 'Blocked', assignee: users[1], dueDate: '2024-08-01', priority: 'High' },
      { id: 't7', title: 'CI/CD environment setup', status: 'Done', assignee: users[4], dueDate: '2024-06-30', priority: 'Medium' },
    ],
    documents: [
       { id: 'd3', name: 'Product Requirements Document.pdf', type: 'Requirements', uploadDate: '2024-06-16', status: 'Pending Analysis' },
    ]
  }
];

const mockDelay = <T,>(data: T, delay: number = 800): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}

export const fetchProjects = (): Promise<Project[]> => {
    return mockDelay(projects);
}

export const fetchProjectById = (id: string): Promise<Project | undefined> => {
    return mockDelay(projects.find(p => p.id === id));
}

export const fetchUsers = (): Promise<User[]> => {
    return mockDelay(users);
}

export const getTeamRecommendations = (requirements: SkillRequirement[]): Promise<TeamRecommendation[]> => {
    // Simulate a complex AI analysis
    const availableUsers = users.filter(u => u.availability !== 'Unavailable');

    const calculateMatch = (user: User): number => {
        let score = 0;
        let reqCount = 0;
        for (const req of requirements) {
            const userSkill = user.skills.find(s => s.name === req.name);
            if (userSkill) {
                const proficiencyMatch = Math.min(userSkill.proficiency / req.proficiency, 1.0);
                const priorityWeight = req.priority === 'Critical' ? 3 : req.priority === 'Important' ? 2 : 1;
                score += proficiencyMatch * priorityWeight;
            }
            reqCount++;
        }
        return reqCount > 0 ? (score / (requirements.map(r=>r.priority === 'Critical' ? 3 : r.priority === 'Important' ? 2 : 1).reduce((a,b)=>a+b,0))) * 100 : 0;
    };
    
    const scoredUsers = availableUsers.map(user => ({ user, score: calculateMatch(user) })).sort((a, b) => b.score - a.score);

    // Mock recommendations
    const recommendations: TeamRecommendation[] = [];
    
    // Rec 1: Best skill match
    const bestFitTeam = scoredUsers.slice(0, 4).map(su => su.user);
    if(bestFitTeam.length > 0) {
        recommendations.push({
            id: 'rec1',
            team: bestFitTeam,
            matchScore: 92,
            justification: 'This team has the highest overall skill proficiency match. Optimized for technical excellence.'
        });
    }

    // Rec 2: Balanced Team
    const roles = ['Frontend Dev', 'Backend Dev', 'UI/UX Designer', 'Project Manager'];
    const balancedTeam: User[] = [];
    roles.forEach(role => {
        const userForRole = scoredUsers.find(su => su.user.role === role && !balancedTeam.some(u => u.id === su.user.id));
        if (userForRole) balancedTeam.push(userForRole.user);
    });
     if(balancedTeam.length > 0) {
        recommendations.push({
            id: 'rec2',
            team: balancedTeam,
            matchScore: 85,
            justification: 'This composition ensures all key roles are filled with skilled individuals, providing a balanced approach.'
        });
    }
    
    // Rec 3: Most Available
    const mostAvailableTeam = availableUsers.filter(u => u.availability === 'Available').slice(0, 4);
    if(mostAvailableTeam.length > 0) {
        recommendations.push({
            id: 'rec3',
            team: mostAvailableTeam,
            matchScore: 78,
            justification: 'This team is composed of members with full availability, optimizing for project velocity and responsiveness.'
        });
    }

    return mockDelay(recommendations, 2500);
}

export const analyzeDocument = async (documentContent: string): Promise<AIAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const extractedItemSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique identifier for the item, e.g., 'fr1'" },
          description: { type: Type.STRING, description: "The detailed description of the requirement or indicator." },
          confidence: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 indicating the confidence of the extraction." },
          source: { type: Type.STRING, description: "The source of the information in the document, e.g., 'Section 2.1'." },
        },
        required: ['id', 'description', 'confidence', 'source'],
    };

    const analysisSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "A brief, one-paragraph summary of the document's purpose and key goals." },
        functionalRequirements: {
          type: Type.ARRAY,
          description: "A list of specific functional requirements for the project.",
          items: extractedItemSchema,
        },
        nonFunctionalRequirements: {
          type: Type.ARRAY,
          description: "A list of non-functional requirements, such as performance or security.",
          items: extractedItemSchema,
        },
        timelineIndicators: {
          type: Type.ARRAY,
          description: "Any mentions of deadlines, phases, or timelines.",
          items: extractedItemSchema,
        },
        suggestedTeam: {
          type: Type.ARRAY,
          description: "A suggested team composition based on the document's needs. Use realistic names and roles.",
          items: {
             type: Type.OBJECT,
             properties: {
                id: { type: Type.STRING, description: "Unique user ID, e.g., 'u1'" },
                name: { type: Type.STRING },
                avatarUrl: { type: Type.STRING, description: "A placeholder image URL from picsum.photos." },
                role: { type: Type.STRING },
                skills: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            proficiency: { type: Type.INTEGER, description: "Proficiency from 1 (Novice) to 5 (Expert)." }
                        },
                        required: ['name', 'proficiency']
                    }
                },
                availability: { type: Type.STRING, enum: ['Available', 'Partially Available', 'Unavailable'] }
             },
             required: ['id', 'name', 'avatarUrl', 'role', 'skills', 'availability']
          }
        },
        suggestedArchitecture: {
          type: Type.OBJECT,
          description: "A recommended technology stack.",
          properties: {
            frontend: { type: Type.STRING },
            backend: { type: Type.STRING },
            database: { type: Type.STRING },
            deployment: { type: Type.STRING },
          },
          required: ['frontend', 'backend', 'database', 'deployment'],
        },
      },
      required: ['summary', 'functionalRequirements', 'nonFunctionalRequirements', 'timelineIndicators', 'suggestedTeam', 'suggestedArchitecture'],
    };

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: `Analyze the following project document and extract the key information. Populate all fields in the JSON schema. Document: "Project Brief: E-commerce Overhaul. We will rebuild our web platform using a microservices architecture to support 10,000 concurrent users with a response time under 200ms. Key features include user auth, product search, and a Stripe payment gateway. The design phase must end by Q3. The platform must be WCAG 2.1 AA compliant. We need a team of frontend, backend, and DevOps engineers."`,
       config: {
         responseMimeType: "application/json",
         responseSchema: analysisSchema,
       },
    });

    const analysisResult = JSON.parse(response.text);
    return analysisResult as AIAnalysis;
}