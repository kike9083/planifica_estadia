'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, TabId } from './Sidebar';
import { TopBar } from './TopBar';
import { TutorialModal } from './TutorialModal';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    onLogout: () => void;
    userName?: string | null;
    userRole?: string | null;
}

export const DashboardLayout = ({ children, activeTab, setActiveTab, onLogout, userName, userRole }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            setIsTutorialOpen(true);
            localStorage.setItem('hasSeenTutorial', 'true');
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-sky-500/30 font-sans">
            {/* Navigation */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onLogout={onLogout}
                onOpenTutorial={() => setIsTutorialOpen(true)}
            />

            {/* Main Content Area */}
            <div className="md:pl-72 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <TopBar
                        onMenuClick={() => setIsSidebarOpen(true)}
                        userName={userName || null}
                        userRole={userRole || null}
                    />

                    <main className="relative z-0">
                        {children}
                    </main>
                </div>
            </div>

            <TutorialModal
                isOpen={isTutorialOpen}
                onClose={() => setIsTutorialOpen(false)}
            />
        </div>
    );
};
