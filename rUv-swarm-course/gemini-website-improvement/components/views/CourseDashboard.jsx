import React, { useContext } from 'react';
import { Clock, Star } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

// Remove hardcoded courseData - now using AppContext

const CourseDashboard = () => {
    const { setView, setSelectedCourseId, currentUser, courseData } = useContext(AppContext);
    
    const handleCourseSelect = (id) => {
        setSelectedCourseId(id);
        setView('course');
    };

    const getCourseProgress = (courseId) => {
        if (!currentUser || !courseData.enrollments) return null;
        const enrollment = courseData.enrollments.find(e => e.user_id === currentUser.id && e.course_id === courseId);
        return enrollment ? { status: enrollment.status, progress: enrollment.progress_percentage } : null;
    };

    return (
        <div>
            <h2 className="text-4xl font-extrabold mb-8 text-blue-300">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courseData.courses.map(course => {
                    const progress = getCourseProgress(course.id);
                    return (
                        <div key={course.id} onClick={() => handleCourseSelect(course.id)} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col">
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                                    <span className="capitalize bg-blue-900 px-2 py-1 rounded">{course.level}</span>
                                    <div className="flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        <span>{course.duration_hours} hours</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">Difficulty:</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < course.difficulty ? 'text-yellow-400' : 'text-gray-600'} fill={i < course.difficulty ? 'currentColor' : 'none'} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 flex-grow">{course.description}</p>
                                {progress && (
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-sm font-semibold ${progress.status === 'completed' ? 'text-green-400' : 'text-blue-400'}`}>
                                                {progress.status === 'completed' ? 'Completed' : `In Progress: ${progress.progress}%`}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress.progress}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CourseDashboard;