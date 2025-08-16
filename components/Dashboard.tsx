
import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface DashboardProps {
    projects: Project[];
    onSelectProject: (projectId: string) => void;
    onCreateNewProject: () => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);


const Dashboard: React.FC<DashboardProps> = ({ projects, onSelectProject, onCreateNewProject }) => {

    return (
        <div className="container mx-auto">
             <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-text-main">Projects Dashboard</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} onSelectProject={onSelectProject} />
                ))}
            </div>

            <button
                onClick={onCreateNewProject}
                className="fixed bottom-8 right-8 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110"
                aria-label="Add New Project"
            >
                <PlusIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

export default Dashboard;
