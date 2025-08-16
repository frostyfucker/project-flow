import React, { useState, useRef, useEffect } from 'react';
import { View } from '../App';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    onImport: () => void;
    onExport: () => void;
    onShowArchived: () => void;
}

const NavLink: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-card-hover hover:text-text-main'
            }`}
        >
            {children}
        </button>
    );
};

const CogIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ currentView, setView, onImport, onExport, onShowArchived }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuAction = (action: () => void) => {
        action();
        setIsMenuOpen(false);
    }

    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4H7zM10 21h4a2 2 0 002-2v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v4a2 2 0 002 2zM15 5h2a2 2 0 012 2v8a2 2 0 01-2 2h-2" />
                        </svg>
                        <h1 className="text-xl font-bold text-text-main">ProjectFlow</h1>
                    </div>
                    <nav className="flex items-center space-x-2">
                        <NavLink isActive={currentView === 'Dashboard'} onClick={() => setView('Dashboard')}>
                            Dashboard
                        </NavLink>
                        <NavLink isActive={currentView === 'Timeline'} onClick={() => setView('Timeline')}>
                            Timeline
                        </NavLink>
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-text-secondary hover:bg-card-hover hover:text-text-main transition-colors duration-200">
                                <CogIcon className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-40">
                                    <button onClick={() => handleMenuAction(onImport)} className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-text-main">Import Projects</button>
                                    <button onClick={() => handleMenuAction(onExport)} className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-text-main">Export Projects</button>
                                    <div className="my-1 border-t border-border"></div>
                                    <button onClick={() => handleMenuAction(onShowArchived)} className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-text-main">View Archived</button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;