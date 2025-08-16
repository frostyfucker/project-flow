
import React, { useMemo } from 'react';
import { Project, ProjectStatus } from '../types';
import { STATUS_COLORS } from '../constants';

const Timeline: React.FC<{ projects: Project[], onSelectProject: (id: string) => void }> = ({ projects, onSelectProject }) => {

    const { timeRange, minDate, maxDate, monthMarkers } = useMemo(() => {
        if (projects.length === 0) {
            const today = new Date();
            const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
            const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
             return { timeRange: 30, minDate, maxDate, monthMarkers: [] };
        }

        const dates = projects.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

        // Add some padding
        minDate.setDate(minDate.getDate() - 15);
        maxDate.setDate(maxDate.getDate() + 15);

        const timeRange = (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24);

        const markers = [];
        let currentDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        while (currentDate <= maxDate) {
            const offset = (currentDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24);
            markers.push({
                date: new Date(currentDate),
                offsetPercent: (offset / timeRange) * 100,
                label: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return { timeRange, minDate, maxDate, monthMarkers: markers };
    }, [projects]);


    const getProjectPosition = (project: Project) => {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);

        const startOffset = (startDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24);
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

        const left = (startOffset / timeRange) * 100;
        const width = (duration / timeRange) * 100;

        return { left: `${left}%`, width: `${width}%` };
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-text-main mb-6">Projects Timeline</h2>
             <div className="flex justify-end space-x-4 mb-4 text-sm">
                {Object.entries(STATUS_COLORS).map(([status, colorClass]) => (
                    <div key={status} className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${colorClass}`}></div>
                        <span>{status}</span>
                    </div>
                ))}
            </div>
            <div className="bg-card p-4 rounded-lg overflow-x-auto">
                <div className="relative" style={{ minWidth: '1200px' }}>
                     {/* Month Markers */}
                    <div className="relative h-6 mb-2 border-b border-border">
                        {monthMarkers.map(marker => (
                            <div key={marker.label} className="absolute top-0 h-full flex items-center" style={{ left: `${marker.offsetPercent}%` }}>
                                <div className="w-px h-2 bg-border absolute -top-2"></div>
                                <span className="text-xs text-text-secondary ml-1">{marker.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Projects List */}
                    <div className="space-y-3">
                        {projects.map(project => {
                            const { left, width } = getProjectPosition(project);
                            const bgColor = STATUS_COLORS[project.status];
                            
                            return (
                                <div key={project.id} className="w-full h-10 flex items-center relative rounded">
                                    <div 
                                        onClick={() => onSelectProject(project.id)}
                                        className={`absolute h-full ${bgColor} rounded cursor-pointer transition-all duration-200 hover:opacity-80 flex items-center px-2`}
                                        style={{ left, width }}
                                    >
                                        <span className="text-white text-sm font-medium truncate">{project.title}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
