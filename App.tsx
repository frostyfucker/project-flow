import React, { useState, useCallback, useMemo } from 'react';
import { Project, Subtask, ProjectStatus, ProjectPriority } from './types';
import { MOCK_PROJECTS } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import ProjectDetailsModal from './components/ProjectDetailsModal';
import ArchivedProjectsModal from './components/ArchivedProjectsModal';


export type View = 'Dashboard' | 'Timeline';

const App: React.FC = () => {
    const [view, setView] = useState<View>('Dashboard');
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
    const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);

    const handleSelectProject = (projectId: string | null) => {
        setSelectedProjectId(projectId);
        if(projectId === null) {
            setIsCreatingNewProject(false);
        }
    };

    const handleCreateNewProject = () => {
        setIsCreatingNewProject(true);
        setSelectedProjectId(null); 
    }

    const handleSaveProject = (projectToSave: Project) => {
        const existingProjectIndex = projects.findIndex(p => p.id === projectToSave.id);
        if (existingProjectIndex > -1) {
            const updatedProjects = [...projects];
            updatedProjects[existingProjectIndex] = projectToSave;
            setProjects(updatedProjects);
        } else {
             setProjects([...projects, projectToSave]);
        }
        handleSelectProject(null);
    };
    
    const handleDeleteProject = (projectId: string) => {
        setProjects(projects.filter(p => p.id !== projectId));
        handleSelectProject(null);
    };

    const handleArchiveProject = (projectId: string) => {
        setProjects(projects.map(p => p.id === projectId ? { ...p, isArchived: true } : p));
        handleSelectProject(null);
    };
    
    const handleUnarchiveProject = (projectId: string) => {
         setProjects(projects.map(p => p.id === projectId ? { ...p, isArchived: false } : p));
    };

    const handleExport = () => {
        try {
            const jsonString = JSON.stringify(projects, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "projectflow_data.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export projects:", error);
            alert("An error occurred while exporting projects.");
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text !== 'string') {
                        throw new Error("File could not be read.");
                    }
                    const importedProjects: Project[] = JSON.parse(text);
                    
                    if (Array.isArray(importedProjects) && importedProjects.every(p => p.id && p.title && p.status)) {
                        const sanitizedProjects = importedProjects.map(p => ({ ...p, isArchived: p.isArchived || false }));
                        setProjects(sanitizedProjects);
                        alert('Projects imported successfully!');
                    } else {
                        throw new Error('Invalid project file format.');
                    }
                } catch (error: any) {
                    console.error('Failed to import projects:', error);
                    alert(`Failed to import projects. Please check the file format. Error: ${error.message}`);
                }
            };
            reader.onerror = () => {
                 alert('Error reading file.');
            }
            reader.readAsText(file);
        };
        input.click();
    };

    const { activeProjects, archivedProjects } = useMemo(() => {
        return projects.reduce<{ activeProjects: Project[]; archivedProjects: Project[] }>(
            (acc, project) => {
                if (project.isArchived) {
                    acc.archivedProjects.push(project);
                } else {
                    acc.activeProjects.push(project);
                }
                return acc;
            },
            { activeProjects: [], archivedProjects: [] }
        );
    }, [projects]);


    const selectedProject = useMemo(() => {
        return projects.find(p => p.id === selectedProjectId) || null;
    }, [selectedProjectId, projects]);

    return (
        <div className="min-h-screen bg-background font-sans">
            <Header 
                currentView={view} 
                setView={setView} 
                onImport={handleImport} 
                onExport={handleExport}
                onShowArchived={() => setIsArchivedModalOpen(true)}
            />
            <main className="p-4 sm:p-6 lg:p-8">
                {view === 'Dashboard' ? (
                    <Dashboard 
                        projects={activeProjects} 
                        onSelectProject={handleSelectProject}
                        onCreateNewProject={handleCreateNewProject}
                    />
                ) : (
                    <Timeline projects={activeProjects} onSelectProject={handleSelectProject} />
                )}
            </main>

            {(selectedProject || isCreatingNewProject) && (
                <ProjectDetailsModal
                    project={selectedProject}
                    onClose={() => handleSelectProject(null)}
                    onSave={handleSaveProject}
                    onDelete={handleDeleteProject}
                    onArchive={handleArchiveProject}
                />
            )}

            {isArchivedModalOpen && (
                <ArchivedProjectsModal
                    projects={archivedProjects}
                    onClose={() => setIsArchivedModalOpen(false)}
                    onUnarchive={handleUnarchiveProject}
                />
            )}
        </div>
    );
};

export default App;