import React, { useState, useContext } from 'react';
import { ArrowLeft, User, BookOpen, ChevronDown, ChevronUp, CheckCircle, Award } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

// Remove hardcoded courseData - now using AppContext

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
        if (!currentUser || !courseData.lesson_progress) return 'not_started';
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

const CourseView = () => {
    const { selectedCourseId, setView, courseData } = useContext(AppContext);
    const course = courseData.courses.find(c => c.id === selectedCourseId);
    const modules = courseData.modules.filter(m => m.course_id === course.id).sort((a, b) => a.order_index - b.order_index);
    const instructor = courseData.users.find(u => u.id === course.instructor_id);

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => setView('dashboard')} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
                <ArrowLeft size={20} />
                <span>Back to Courses</span>
            </button>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
                <h2 className="text-5xl font-extrabold mb-4 text-white">{course.title}</h2>
                <div className="space-y-2 text-gray-400 mb-6">
                    <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>{instructor.firstName} {instructor.lastName}</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">{instructor.bio}</p>
                </div>
                <p className="text-lg text-gray-300 mb-6">{course.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <h4 className="font-bold text-lg text-white mb-2">Prerequisites</h4>
                        <p>{course.prerequisites}</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <h4 className="font-bold text-lg text-white mb-2">Learning Objectives</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {course.learning_objectives.split('\n').map((obj, i) => obj.trim() && <li key={i}>{obj.replace('•','').trim()}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-6 text-blue-300">Course Content</h3>
            <div className="space-y-4">
                {modules.map(module => <ModuleItem key={module.id} module={module} />)}
            </div>
        </div>
    );
};

export default CourseView;