import React from 'react';
import { Project } from '../types';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const UnarchiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const ArchivedProjectsModal: React.FC<{
    projects: Project[];
    onClose: () => void;
    onUnarchive: (projectId: string) => void;
}> = ({ projects, onClose, onUnarchive }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center p-4">
            <div className="bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-text-main">Archived Projects</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-6 space-y-3">
                    {projects.length > 0 ? (
                        projects.map(project => (
                             <div key={project.id} className="flex items-center justify-between bg-background p-3 rounded-md">
                                <div>
                                    <p className="font-semibold text-text-main">{project.title}</p>
                                    <p className="text-xs text-text-secondary">{project.category} - Completed: {new Date(project.endDate).toLocaleDateString()}</p>
                                </div>
                                <button 
                                    onClick={() => onUnarchive(project.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-primary text-white rounded-md hover:bg-purple-700"
                                    aria-label={`Unarchive ${project.title}`}
                                >
                                    <UnarchiveIcon className="w-4 h-4" />
                                    <span>Unarchive</span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-text-secondary text-center py-8">No archived projects found.</p>
                    )}
                </div>

                <div className="p-6 bg-card-hover rounded-b-lg flex justify-end items-center gap-4 border-t border-border">
                     <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-500">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ArchivedProjectsModal;