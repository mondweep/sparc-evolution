import React, { useContext } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

const Header = ({ userDropdownOpen, setUserDropdownOpen, students }) => {
    const { currentUser, setView } = useContext(AppContext);

    return (
        <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setView('dashboard')}>
                <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-2xl font-bold text-white">rUv-swarm Learning</h1>
            </div>
            <div className="relative">
                <div className="flex items-center space-x-4">
                    {/* User functionality disabled as per original code */}
                </div>
            </div>
        </header>
    );
};

export default Header;