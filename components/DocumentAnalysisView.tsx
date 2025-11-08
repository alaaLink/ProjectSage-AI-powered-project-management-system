import React, { useState, DragEvent, useRef } from 'react';
import { AIAnalysis, ExtractedItem } from '../types';
import { analyzeDocument } from '../services/mockApi';
import { LoadingSpinner, UploadCloudIcon, DocumentsIcon, CheckCircleIcon, XCircleIcon, EditIcon } from './icons';

const ANALYSIS_STEPS = [
    "Uploading File",
    "Extracting Text Content",
    "Running AI Analysis",
    "Finalizing Results",
];

const ConfidenceIndicator: React.FC<{ score: number }> = ({ score }) => {
    const percentage = Math.round(score * 100);
    const color = score > 0.9 ? 'text-green-500' : score > 0.75 ? 'text-yellow-500' : 'text-red-500';
    const bgColor = score > 0.9 ? 'bg-green-100' : score > 0.75 ? 'bg-yellow-100' : 'bg-red-100';
    
    return (
        <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${bgColor} ${color}`}>
            <span>{percentage}% Confidence</span>
        </div>
    );
};

const AnalysisItemCard: React.FC<{ item: ExtractedItem }> = ({ item }) => (
    <div className="bg-light-gray p-4 rounded-lg border border-accent-gray relative group">
        <p className="text-text-primary pr-16">{item.description}</p>
        <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
            <ConfidenceIndicator score={item.confidence} />
            <span className="font-mono text-xs">Source: {item.source}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-gray-400 hover:text-primary"><EditIcon className="w-4 h-4" /></button>
            <button className="text-gray-400 hover:text-red-500"><XCircleIcon className="w-4 h-4" /></button>
        </div>
    </div>
);

const AnalysisResult: React.FC<{ analysis: AIAnalysis }> = ({ analysis }) => {
    const [activeTab, setActiveTab] = useState('functional');
    
    const renderContent = () => {
        switch(activeTab) {
            case 'functional':
                return analysis.functionalRequirements.map(item => <AnalysisItemCard key={item.id} item={item} />);
            case 'non-functional':
                return analysis.nonFunctionalRequirements.map(item => <AnalysisItemCard key={item.id} item={item} />);
            case 'timeline':
                return analysis.timelineIndicators.map(item => <AnalysisItemCard key={item.id} item={item} />);
            default:
                return null;
        }
    }

    const TabButton: React.FC<{tabKey: string, label: string, count: number}> = ({tabKey, label, count}) => (
        <button onClick={() => setActiveTab(tabKey)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabKey ? 'bg-primary text-white' : 'text-text-secondary hover:bg-accent-gray'}`}>
            {label} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tabKey ? 'bg-white text-primary' : 'bg-accent-gray text-text-primary'}`}>{count}</span>
        </button>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h3 className="text-lg font-semibold text-text-primary border-b pb-2 mb-3">Analysis Summary</h3>
                <p className="text-text-secondary">{analysis.summary}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-accent-gray">
                <div className="flex items-center space-x-2 border-b border-accent-gray pb-3 mb-4">
                    <TabButton tabKey="functional" label="Functional" count={analysis.functionalRequirements.length} />
                    <TabButton tabKey="non-functional" label="Non-Functional" count={analysis.nonFunctionalRequirements.length} />
                    <TabButton tabKey="timeline" label="Timeline" count={analysis.timelineIndicators.length} />
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {renderContent()}
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary border-b pb-2 mb-3">Suggested Architecture</h3>
                     <ul className="text-text-secondary space-y-2 text-sm">
                        <li className="flex items-start"><strong className="w-24 font-semibold text-text-primary">Frontend:</strong> <span>{analysis.suggestedArchitecture.frontend}</span></li>
                        <li className="flex items-start"><strong className="w-24 font-semibold text-text-primary">Backend:</strong> <span>{analysis.suggestedArchitecture.backend}</span></li>
                        <li className="flex items-start"><strong className="w-24 font-semibold text-text-primary">Database:</strong> <span>{analysis.suggestedArchitecture.database}</span></li>
                        <li className="flex items-start"><strong className="w-24 font-semibold text-text-primary">Deployment:</strong> <span>{analysis.suggestedArchitecture.deployment}</span></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-text-primary border-b pb-2 mb-3">Suggested Team</h3>
                    <div className="flex flex-wrap gap-3">
                        {analysis.suggestedTeam.map(user => (
                            <div key={user.id} className="flex items-center bg-light-gray p-2 rounded-lg" title={`${user.name} - ${user.role}`}>
                                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-2"/>
                                <div>
                                    <p className="font-semibold text-sm">{user.name}</p>
                                    <p className="text-xs text-text-secondary">{user.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const DocumentAnalysisView: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFile = (selectedFile: File) => {
        if (selectedFile && ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
            setFile(selectedFile);
            setError(null);
            setAnalysis(null);
        } else {
            setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
        }
    };
    
    const handleDrag = (e: DragEvent<HTMLDivElement>, dragState: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragState);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        handleDrag(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please upload a document to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setAnalysisProgress(0);

        const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
        }, 1000);

        try {
            const result = await analyzeDocument("mock content");
            setAnalysis(result);
        } catch (err) {
            setError('Failed to analyze document. Please try again.');
        } finally {
            clearInterval(progressInterval);
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Document AI Analyzer</h2>
            <p className="text-text-secondary mb-6">Upload a project document (PDF, DOCX, TXT) to get AI-powered insights, requirements, and recommendations.</p>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                {!analysis && !isLoading && (
                     <div
                        onDragEnter={(e) => handleDrag(e, true)}
                        onDragLeave={(e) => handleDrag(e, false)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-blue-50' : 'border-accent-gray hover:border-primary'}`}
                    >
                        <UploadCloudIcon className={`w-12 h-12 mx-auto mb-3 transition-colors ${isDragging ? 'text-primary' : 'text-text-secondary'}`} />
                        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFile(e.target.files[0])} className="hidden" accept=".pdf,.docx,.txt" />
                        
                        {file ? (
                            <div>
                                <p className="font-semibold text-text-primary">{file.name}</p>
                                <p className="text-sm text-text-secondary">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        ) : (
                            <div>
                                <p className="font-semibold text-text-primary">Drag & drop your document here</p>
                                <p className="text-sm text-text-secondary">or click to browse</p>
                            </div>
                        )}
                    </div>
                )}

                {isLoading && (
                    <div className="text-center">
                        <LoadingSpinner className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-primary">Analyzing Document...</h3>
                        <p className="text-text-secondary mb-4">{file?.name}</p>
                        <div className="w-full max-w-md mx-auto space-y-2 text-left">
                           {ANALYSIS_STEPS.map((step, index) => (
                               <div key={step} className={`flex items-center transition-opacity duration-300 ${index <= analysisProgress ? 'opacity-100' : 'opacity-40'}`}>
                                   {index < analysisProgress ? <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> : <LoadingSpinner className={`w-5 h-5 mr-2 ${index === analysisProgress ? 'text-primary' : 'text-transparent'}`} />}
                                   <span>{step}</span>
                               </div>
                           ))}
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                
                {!isLoading && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleAnalyze}
                            disabled={!file}
                            className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                           <DocumentsIcon className="w-5 h-5 mr-2" />
                            Analyze with AI
                        </button>
                        {analysis && (
                            <button
                                onClick={() => { setAnalysis(null); setFile(null); }}
                                className="w-full sm:w-auto px-6 py-3 bg-accent-gray text-text-primary font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Start New Analysis
                            </button>
                        )}
                    </div>
                )}
            </div>

            {analysis && (
                <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
                    <AnalysisResult analysis={analysis} />
                </div>
            )}
        </div>
    );
};

export default DocumentAnalysisView;