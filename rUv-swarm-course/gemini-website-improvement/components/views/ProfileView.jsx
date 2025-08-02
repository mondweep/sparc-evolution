
import React, { useState, useContext } from 'react';
import { User, Mail, Calendar, Award, BookOpen, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

// Remove hardcoded courseData - now using AppContext

const ProfileView = () => {
    const { currentUser, setView, courseData } = useContext(AppContext);
    const userEnrollments = courseData.enrollments.filter(e => e.user_id === currentUser.id);
    const userAchievements = courseData.user_achievements.filter(ua => ua.user_id === currentUser.id);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
                <div className="flex items-center space-x-6 mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-content text-2xl font-bold text-white">
                        {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">{currentUser.firstName} {currentUser.lastName}</h2>
                        <p className="text-gray-400">@{currentUser.username}</p>
                        <p className="text-gray-300 mt-2">{currentUser.bio}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6 text-blue-300">Course Progress</h3>
                    <div className="space-y-4">
                        {userEnrollments.map(enrollment => {
                            const course = courseData.courses.find(c => c.id === enrollment.course_id);
                            return (
                                <div key={enrollment.id} className="bg-gray-900 p-4 rounded-lg">
                                    <h4 className="font-bold text-white mb-2">{course.title}</h4>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-sm font-semibold ${enrollment.status === 'completed' ? 'text-green-400' : 'text-blue-400'}`}>
                                            {enrollment.status === 'completed' ? 'Completed' : 
                                             enrollment.status === 'in_progress' ? `${enrollment.progress_percentage}% Complete` : 
                                             'Not Started'}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-500 h-2.5 rounded-full" 
                                            style={{ width: `${enrollment.progress_percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        {userEnrollments.length === 0 && <p className="text-gray-400">No courses enrolled yet.</p>}
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6 text-blue-300">Achievements</h3>
                    <div className="space-y-3">
                        {userAchievements.map(userAch => {
                            const achievement = courseData.achievements.find(a => a.id === userAch.achievement_id);
                            return (
                                <div key={userAch.id} className="flex items-center bg-gray-900 p-3 rounded-lg">
                                    <Award size={24} className="text-yellow-400 mr-4" />
                                    <div>
                                        <h4 className="font-bold text-white">{achievement.name}</h4>
                                        <p className="text-sm text-gray-400">{achievement.description}</p>
                                        <p className="text-xs text-blue-400 mt-1">
                                            Earned: {new Date(userAch.earned_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {userAchievements.length === 0 && <p className="text-gray-400">No achievements yet. Keep learning!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;