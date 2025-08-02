import React, { useState } from 'react';

// Import course data
import { courseData } from './data/courseData.js';

// Import extracted components
import { ViewManager, Header } from './components/common';
import { AppContext } from './components/context';


const App = () => {
    const [currentUser, setCurrentUser] = useState(courseData.users.find(u => u.role === 'student'));
    const [view, setView] = useState('dashboard'); // dashboard, course, lesson, quiz
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const contextValue = {
        currentUser, 
        setCurrentUser,
        view, 
        setView,
        selectedCourseId, 
        setSelectedCourseId,
        selectedLessonId, 
        setSelectedLessonId,
        selectedQuizId, 
        setSelectedQuizId,
        courseData
    };
    
    const students = courseData.users.filter(u => u.role === 'student');

    return (
        <AppContext.Provider value={contextValue}>
            <div className="bg-gray-900 text-white min-h-screen font-sans">
                <Header userDropdownOpen={userDropdownOpen} setUserDropdownOpen={setUserDropdownOpen} students={students} />
                <main className="p-4 sm:p-6 lg:p-8">
                    <ViewManager />
                </main>
            </div>
        </AppContext.Provider>
    );
};

export default App;