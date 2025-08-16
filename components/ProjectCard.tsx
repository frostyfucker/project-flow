
import React from 'react';
import { Project, ProjectStatus } from '../types';
import { STATUS_COLORS } from '../constants';

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
);

const ProjectCard: React.FC<{ project: Project, onSelectProject: (id: string) => void }> = ({ project, onSelectProject }) => {

    const progress = React.useMemo(() => {
        if (project.status === ProjectStatus.Completed) return 100;
        if (project.subtasks.length === 0) return 0;
        const completed = project.subtasks.filter(t => t.isCompleted).length;
        return Math.round((completed / project.subtasks.length) * 100);
    }, [project.subtasks, project.status]);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div
            onClick={() => onSelectProject(project.id)}
            className="bg-card rounded-lg shadow-lg flex flex-col cursor-pointer hover:bg-card-hover border border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
        >
            <img src={project.imageUrl} alt={project.title} className="w-full h-32 object-cover" />
            <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${STATUS_COLORS[project.status]}`}>
                            {project.status}
                        </span>
                        {project.projectLink && <LinkIcon className="w-5 h-5 text-text-secondary" />}
                    </div>

                    <h3 className="text-lg font-bold text-text-main truncate">{project.title}</h3>
                    <p className="text-sm text-text-secondary h-10 overflow-hidden">{project.description}</p>
                     <div className="mt-2">
                        <span className="text-xs font-medium bg-gray-700 text-text-secondary px-2 py-1 rounded">
                            {project.category}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="text-xs text-text-secondary flex justify-between">
                        <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-text-secondary">Progress</span>
                            <span className="text-sm font-medium text-primary">{progress}%</span>
                        </div>
                        <ProgressBar progress={progress} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
