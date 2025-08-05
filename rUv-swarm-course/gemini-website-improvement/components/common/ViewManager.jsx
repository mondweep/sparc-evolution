import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import CourseDashboard from '../views/CourseDashboard.jsx';
import CourseView from '../views/CourseView.jsx';
import LessonView from '../views/LessonView.jsx';
import QuizView from '../views/QuizView.jsx';

const ViewManager = () => {
    const { view } = useContext(AppContext);

    switch (view) {
        case 'dashboard': return <CourseDashboard />;
        case 'course': return <CourseView />;
        case 'lesson': return <LessonView />;
        case 'quiz': return <QuizView />;
        // case 'profile': return <ProfileView />; // Profile view disabled
        default: return <CourseDashboard />;
    }
};

export default ViewManager;