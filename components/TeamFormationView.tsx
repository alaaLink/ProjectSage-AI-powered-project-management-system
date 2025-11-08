import React, { useState, useEffect, DragEvent } from 'react';
import { User, SkillRequirement, TeamRecommendation, Skill } from '../types';
import { fetchUsers, getTeamRecommendations } from '../services/mockApi';
import { LoadingSpinner, SparklesIcon, TeamIcon, MinusCircleIcon, StarIcon, CheckCircleIcon, UserPlusIcon } from './icons';

const mockRequirements: SkillRequirement[] = [
    { id: 'req1', name: 'React', proficiency: 4, priority: 'Critical' },
    { id: 'req2', name: 'Node.js', proficiency: 4, priority: 'Critical' },
    { id: 'req3', name: 'Figma', proficiency: 3, priority: 'Important' },
    { id: 'req4', name: 'Docker', proficiency: 3, priority: 'Nice to Have' },
];

const ProficiencyStars: React.FC<{ level: number, setLevel?: (level: number) => void, interactive?: boolean }> = ({ level, setLevel, interactive }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
                <StarIcon 
                    key={star} 
                    className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${star <= level ? 'text-yellow-400' : 'text-gray-300'}`}
                    filled={star <= level}
                    onClick={() => interactive && setLevel && setLevel(star)}
                />
            ))}
        </div>
    );
};

const SkillRequirementsEditor: React.FC<{ requirements: SkillRequirement[], setRequirements: (reqs: SkillRequirement[]) => void }> = ({ requirements, setRequirements }) => {
    
    const addRequirement = () => {
        const newReq: SkillRequirement = { id: `req${Date.now()}`, name: 'New Skill', proficiency: 3, priority: 'Important'};
        setRequirements([...requirements, newReq]);
    };

    const removeRequirement = (id: string) => {
        setRequirements(requirements.filter(req => req.id !== id));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-text-primary mb-4">Skill Requirements</h3>
            <div className="space-y-3 mb-4">
                {requirements.map(req => (
                    <div key={req.id} className="bg-light-gray p-3 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{req.name}</p>
                            <p className="text-xs text-text-secondary">{req.priority}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                           <ProficiencyStars level={req.proficiency} />
                            <button onClick={() => removeRequirement(req.id)} className="text-gray-400 hover:text-red-500">
                                <MinusCircleIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex space-x-2">
                <button onClick={addRequirement} className="w-full px-4 py-2 bg-accent-gray text-text-primary font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm">Add Skill</button>
                <button onClick={() => setRequirements(mockRequirements)} className="w-full px-4 py-2 bg-secondary/20 text-secondary font-semibold rounded-lg hover:bg-secondary/30 transition-colors text-sm flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 mr-1"/> AI Suggest
                </button>
            </div>
        </div>
    );
}

const EmployeeCard: React.FC<{ user: User, isDraggable: boolean, onDragStart: (e: DragEvent<HTMLDivElement>, user: User) => void }> = ({ user, isDraggable, onDragStart }) => {
    const availabilityColor = {
        'Available': 'bg-green-500',
        'Partially Available': 'bg-yellow-500',
        'Unavailable': 'bg-red-500'
    };

    return (
        <div 
            className="bg-white p-4 rounded-xl shadow-sm border flex flex-col cursor-grab"
            draggable={isDraggable}
            onDragStart={(e) => onDragStart(e, user)}
        >
            <div className="flex items-center mb-3">
                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mr-3"/>
                <div>
                    <p className="font-bold text-text-primary">{user.name}</p>
                    <p className="text-sm text-text-secondary">{user.role}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm flex-grow">
                {user.skills.map(skill => (
                    <div key={skill.name} className="flex justify-between items-center">
                        <span className="text-text-secondary">{skill.name}</span>
                        <ProficiencyStars level={skill.proficiency}/>
                    </div>
                ))}
            </div>
            <div className="text-xs font-semibold flex items-center mt-3">
                <span className={`w-3 h-3 rounded-full mr-2 ${availabilityColor[user.availability]}`}></span>
                {user.availability}
            </div>
        </div>
    );
};


const TeamBuilder: React.FC<{ team: User[], setTeam: (team: User[]) => void, requirements: SkillRequirement[] }> = ({ team, setTeam, requirements }) => {
    
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const userData = e.dataTransfer.getData("user");
        if (userData) {
            const user = JSON.parse(userData) as User;
            if (!team.some(member => member.id === user.id)) {
                setTeam([...team, user]);
            }
        }
    };
    
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

    const removeMember = (id: string) => {
        setTeam(team.filter(member => member.id !== id));
    };

    const calculateCoverage = () => {
        if (requirements.length === 0) return 100;
        let covered = 0;
        requirements.forEach(req => {
            const hasMemberWithSkill = team.some(member => 
                member.skills.some(skill => skill.name === req.name && skill.proficiency >= req.proficiency)
            );
            if (hasMemberWithSkill) covered++;
        });
        return Math.round((covered / requirements.length) * 100);
    };

    const coverage = calculateCoverage();

    return (
        <div 
            className="bg-white p-6 rounded-xl shadow-md"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-text-primary">Project Team</h3>
                <div>
                    <p className="text-sm text-text-secondary">Skill Coverage</p>
                    <div className="flex items-center">
                        <div className="w-24 bg-light-gray rounded-full h-2.5 mr-2">
                           <div className="bg-primary h-2.5 rounded-full" style={{ width: `${coverage}%` }}></div>
                        </div>
                        <span className="font-bold text-text-primary">{coverage}%</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[200px]">
                {team.map(member => (
                     <div key={member.id} className="bg-light-gray p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full mr-3"/>
                            <div>
                                <p className="font-semibold text-sm">{member.name}</p>
                                <p className="text-xs text-text-secondary">{member.role}</p>
                            </div>
                        </div>
                        <button onClick={() => removeMember(member.id)} className="text-gray-400 hover:text-red-500">
                           <MinusCircleIcon className="w-6 h-6"/>
                        </button>
                    </div>
                ))}
                 {team.length === 0 && (
                    <div className="col-span-full flex flex-col justify-center items-center text-center text-text-secondary border-2 border-dashed border-accent-gray rounded-lg p-4">
                       <UserPlusIcon className="w-12 h-12 mb-2"/>
                       <p className="font-semibold">Drag employees here to build your team</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TeamFormationView: React.FC = () => {
    const [requirements, setRequirements] = useState<SkillRequirement[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);
    const [team, setTeam] = useState<User[]>([]);
    const [recommendations, setRecommendations] = useState<TeamRecommendation[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const loadUsers = async () => {
            const users = await fetchUsers();
            setEmployees(users);
        };
        loadUsers();
    }, []);

    const handleFindTeam = async () => {
        setIsLoading(true);
        setRecommendations(null);
        const recs = await getTeamRecommendations(requirements);
        setRecommendations(recs);
        setIsLoading(false);
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, user: User) => {
        e.dataTransfer.setData("user", JSON.stringify(user));
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">AI Team Builder</h2>
            <p className="text-text-secondary mb-6">Define your project's needs, and let our AI assemble the perfect team for success.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <SkillRequirementsEditor requirements={requirements} setRequirements={setRequirements} />
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-text-primary mb-4">AI Actions</h3>
                        <button 
                            onClick={handleFindTeam} 
                            disabled={isLoading || requirements.length === 0}
                            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isLoading ? <LoadingSpinner className="w-6 h-6 mr-2" /> : <SparklesIcon className="w-6 h-6 mr-2" />}
                            {isLoading ? 'Analyzing...' : 'Find Best Team'}
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <TeamBuilder team={team} setTeam={setTeam} requirements={requirements} />
                    {recommendations && (
                         <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold text-text-primary mb-4">AI Team Recommendations</h3>
                            <div className="space-y-4">
                                {recommendations.map(rec => (
                                    <div key={rec.id} className="border border-accent-gray rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-secondary">Match Score: {rec.matchScore}%</p>
                                                <p className="text-sm text-text-secondary italic">{rec.justification}</p>
                                            </div>
                                            <button onClick={() => setTeam(rec.team)} className="px-3 py-1.5 bg-secondary text-white font-semibold rounded-lg hover:bg-teal-700 text-sm">Select Team</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {rec.team.map(member => (
                                                <div key={member.id} className="flex items-center bg-light-gray px-2 py-1 rounded-full" title={member.role}>
                                                    <img src={member.avatarUrl} alt={member.name} className="w-6 h-6 rounded-full mr-2"/>
                                                    <span className="text-sm font-medium">{member.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-text-primary mb-4">Employee Directory</h3>
                {/* Add search/filter controls here in a real app */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {employees.map(user => (
                        <EmployeeCard key={user.id} user={user} isDraggable={true} onDragStart={handleDragStart}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamFormationView;
