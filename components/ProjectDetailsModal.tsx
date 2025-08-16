import React, { useState, useEffect } from 'react';
import { Project, Subtask, ProjectStatus, ProjectPriority } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const ArchiveIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

const ProjectDetailsModal: React.FC<{
    project: Project | null;
    onClose: () => void;
    onSave: (project: Project) => void;
    onDelete: (projectId: string) => void;
    onArchive: (projectId: string) => void;
}> = ({ project, onClose, onSave, onDelete, onArchive }) => {
    const isNewProject = project === null;
    const [isEditing, setIsEditing] = useState(isNewProject);
    const [editedProject, setEditedProject] = useState<Project>(
        project || {
            id: `proj_${Date.now()}`,
            title: '',
            description: '',
            category: 'Web Development',
            priority: ProjectPriority.Medium,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            status: ProjectStatus.NotStarted,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/1200/400`,
            projectLink: '',
            subtasks: [],
            isArchived: false,
        }
    );
    const [newSubtask, setNewSubtask] = useState('');

    useEffect(() => {
        if (project) {
            setEditedProject(project);
            setIsEditing(false);
        } else {
            setIsEditing(true);
             setEditedProject({
                id: `proj_${Date.now()}`,
                title: '',
                description: '',
                category: 'Web Development',
                priority: ProjectPriority.Medium,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                status: ProjectStatus.NotStarted,
                imageUrl: `https://picsum.photos/seed/${Date.now()}/1200/400`,
                projectLink: '',
                subtasks: [],
                isArchived: false,
            });
        }
    }, [project]);

    const handleInputChange = <K extends keyof Project,>(field: K, value: Project[K]) => {
        setEditedProject(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    handleInputChange('imageUrl', reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubtaskToggle = (subtaskId: string) => {
        const updatedSubtasks = editedProject.subtasks.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, isCompleted: !subtask.isCompleted } : subtask
        );
        handleInputChange('subtasks', updatedSubtasks);
    };

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            const subtask: Subtask = {
                id: `sub_${Date.now()}`,
                projectId: editedProject.id,
                description: newSubtask.trim(),
                isCompleted: false,
            };
            handleInputChange('subtasks', [...editedProject.subtasks, subtask]);
            setNewSubtask('');
        }
    };
    
    const handleSave = () => {
        onSave(editedProject);
        setIsEditing(false);
    }
    
    const handleCancel = () => {
        if (isNewProject) {
            onClose();
        } else {
            setEditedProject(project!);
            setIsEditing(false);
        }
    }

    const progress = React.useMemo(() => {
        if (editedProject.status === ProjectStatus.Completed) return 100;
        if (editedProject.subtasks.length === 0) return 0;
        const completed = editedProject.subtasks.filter(t => t.isCompleted).length;
        return Math.round((completed / editedProject.subtasks.length) * 100);
    }, [editedProject.subtasks, editedProject.status]);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center p-4">
            <div className="bg-card rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <img src={editedProject.imageUrl} alt={editedProject.title} className="w-full h-48 object-cover rounded-t-lg" />
                
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div className="flex justify-between items-start">
                        {isEditing ? (
                             <input type="text" value={editedProject.title} onChange={e => handleInputChange('title', e.target.value)} className="text-3xl font-bold bg-background border border-border rounded px-2 py-1 w-full" />
                        ) : (
                             <h2 className="text-3xl font-bold text-text-main">{editedProject.title}</h2>
                        )}
                       
                        {!isEditing && (
                           <button onClick={() => setIsEditing(true)} className="bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-700 ml-4 flex-shrink-0">Edit</button>
                        )}
                    </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <InfoItem label="Status" value={editedProject.status} color={STATUS_COLORS[editedProject.status]} isEditing={isEditing} onChange={v => handleInputChange('status', v as ProjectStatus)} options={Object.values(ProjectStatus)} />
                        <InfoItem label="Priority" value={editedProject.priority} color={PRIORITY_COLORS[editedProject.priority]} isEditing={isEditing} onChange={v => handleInputChange('priority', v as ProjectPriority)} options={Object.values(ProjectPriority)} />
                        <InfoItem label="Start Date" value={editedProject.startDate} isEditing={isEditing} onChange={v => handleInputChange('startDate', v)} type="date" />
                        <InfoItem label="End Date" value={editedProject.endDate} isEditing={isEditing} onChange={v => handleInputChange('endDate', v)} type="date" />
                        <InfoItem label="Category" value={editedProject.category} isEditing={isEditing} onChange={v => handleInputChange('category', v)} />
                        <InfoItem label="Project Link" value={editedProject.projectLink} isEditing={isEditing} onChange={v => handleInputChange('projectLink', v)} type="url"/>
                    </div>
                    
                    {isEditing && (
                        <div>
                            <h3 className="font-semibold mb-2 text-text-secondary">Project Header Image</h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Enter image URL"
                                    value={editedProject.imageUrl}
                                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                                    className="w-full bg-background border border-border rounded p-2 text-sm"
                                />
                                 <div className="text-center text-xs text-text-secondary">OR</div>
                                <div>
                                    <label htmlFor="imageUpload" className="text-sm text-text-secondary sr-only">Upload an image</label>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-purple-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                         <h3 className="font-semibold mb-1 text-text-secondary">Description</h3>
                          {isEditing ? (
                                <textarea value={editedProject.description} onChange={e => handleInputChange('description', e.target.value)} rows={4} className="w-full bg-background border border-border rounded p-2 text-sm"/>
                            ) : (
                                <p className="text-text-secondary text-sm">{editedProject.description || "No description provided."}</p>
                            )}
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-2 text-text-secondary">Checklist ({progress}%)</h3>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="space-y-2">
                             {editedProject.subtasks.map(task => (
                                <div key={task.id} className="flex items-center bg-background p-2 rounded">
                                    <input type="checkbox" checked={task.isCompleted} onChange={() => isEditing && handleSubtaskToggle(task.id)} disabled={!isEditing} className={`w-5 h-5 rounded bg-gray-700 border-border text-primary focus:ring-primary mr-3 ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`} />
                                    <span className={`flex-grow text-sm ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.description}</span>
                                </div>
                             ))}
                             {isEditing && (
                                 <div className="flex items-center gap-2 pt-2">
                                     <input type="text" value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSubtask()} placeholder="Add a new subtask..." className="flex-grow bg-background border border-border rounded px-2 py-1 text-sm"/>
                                     <button onClick={handleAddSubtask} className="bg-primary text-white rounded px-3 py-1 text-sm font-bold hover:bg-purple-700">+</button>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card-hover rounded-b-lg flex justify-end items-center gap-4 border-t border-border">
                    {isEditing ? (
                        <>
                            {!isNewProject && (
                                <button onClick={() => onDelete(project.id)} className="text-red-500 hover:text-red-400 font-semibold mr-auto flex items-center gap-2"><TrashIcon className="w-4 h-4" /> Delete</button>
                            )}
                            <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-500">Cancel</button>
                            <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-700">Save Changes</button>
                        </>
                    ) : (
                        <>
                            {progress === 100 && (
                                <button onClick={() => onArchive(project!.id)} className="text-text-secondary hover:text-white font-semibold mr-auto flex items-center gap-2"><ArchiveIcon className="w-4 h-4" /> Archive Project</button>
                            )}
                            <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-500">Close</button>
                        </>
                    )}
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};


const InfoItem: React.FC<{
    label: string;
    value: string;
    color?: string;
    isEditing: boolean;
    onChange: (value: string) => void;
    options?: string[];
    type?: string;
}> = ({ label, value, color, isEditing, onChange, options, type = 'text' }) => {
    return (
        <div>
            <h4 className="text-xs font-semibold text-text-secondary mb-1">{label}</h4>
            {isEditing ? (
                options ? (
                    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-background border border-border rounded p-1.5 text-sm">
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : (
                    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-background border border-border rounded p-1.5 text-sm" />
                )
            ) : (
                color ? (
                    <span className={`px-2 py-1 rounded-full text-white text-xs ${color}`}>{value}</span>
                ) : (
                    <span className="text-text-main break-all">{value || '-'}</span>
                )
            )}
        </div>
    );
}

export default ProjectDetailsModal;