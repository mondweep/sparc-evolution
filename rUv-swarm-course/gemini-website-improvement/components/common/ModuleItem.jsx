import React, { useState, useContext } from 'react';
import { CheckCircle, BookOpen, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

const ModuleItem = ({ module }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { setView, setSelectedLessonId, setSelectedQuizId, currentUser, courseData } = useContext(AppContext);
    const lessons = courseData.lessons.filter(l => l.module_id === module.id).sort((a, b) => a.order_index - b.order_index);
    const quizzes = courseData.quizzes.filter(q => q.module_id === module.id);

    const handleLessonClick = (id) => {
        setSelectedLessonId(id);
        setView('lesson');
    };
    
    const handleQuizClick = (id) => {
        setSelectedQuizId(id);
        setView('quiz');
    };

    const getLessonStatus = (lessonId) => {
        const progress = courseData.lesson_progress.find(lp => lp.user_id === currentUser.id && lp.lesson_id === lessonId);
        if (!progress) return 'not_started';
        if (progress.progress_percentage === 100) return 'completed';
        return 'in_progress';
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-5 text-left">
                <div className="flex items-center">
                    <BookOpen className="mr-4 text-blue-400" size={24} />
                    <div>
                        <h4 className="text-xl font-bold text-white">{module.title}</h4>
                        <p className="text-gray-400">{module.description}</p>
                    </div>
                </div>
                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {isOpen && (
                <div className="p-5 border-t border-gray-700">
                    <ul className="space-y-3">
                        {lessons.map(lesson => {
                            const status = getLessonStatus(lesson.id);
                            return (
                                <li key={lesson.id} onClick={() => handleLessonClick(lesson.id)} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                                    <div className="flex items-center">
                                        {status === 'completed' && <CheckCircle size={20} className="mr-3 text-green-500" />}
                                        {status === 'in_progress' && <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 border-2 border-blue-300"></div>}
                                        {status === 'not_started' && <div className="w-5 h-5 mr-3 rounded-full border-2 border-gray-500"></div>}
                                        <span className="text-gray-200">{lesson.title}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{lesson.duration_minutes} min</span>
                                </li>
                            );
                        })}
                        {quizzes.map(quiz => (
                             <li key={quiz.id} onClick={() => handleQuizClick(quiz.id)} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                                <div className="flex items-center">
                                    <Award size={20} className="mr-3 text-yellow-500" />
                                    <span className="text-gray-200 font-semibold">{quiz.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">{quiz.time_limit_minutes} min</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ModuleItem;