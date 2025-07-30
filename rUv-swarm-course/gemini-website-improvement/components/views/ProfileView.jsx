import React, { useContext } from 'react';
import { Award } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

// Note: courseData should be imported from App.jsx or passed as props
const courseData = {
    users: [
        { id: 1, username: 'admin', email: 'admin@ruv-swarm.edu', firstName: 'System', lastName: 'Administrator', role: 'admin', bio: 'System administrator for the rUv-swarm learning platform.' },
        { id: 2, username: 'dr_neuralnet', email: 'instructor@ruv-swarm.edu', firstName: 'Dr. Elena', lastName: 'NetworkWeaver', role: 'instructor', bio: 'AI researcher specializing in swarm intelligence and neural networks. PhD in Computer Science from MIT.' },
        { id: 3, username: 'alex_student', email: 'alex@student.edu', firstName: 'Alex', lastName: 'Learner', role: 'student', bio: 'Computer Science student passionate about AI and distributed systems.' },
        { id: 4, username: 'sarah_dev', email: 'sarah@developer.com', firstName: 'Sarah', lastName: 'Developer', role: 'student', bio: 'Full-stack developer exploring AI/ML applications.' },
        { id: 5, username: 'mike_researcher', email: 'mike@research.org', firstName: 'Mike', lastName: 'Researcher', role: 'student', bio: 'Research scientist investigating evolutionary algorithms.' }
    ],
    courses: [
        { id: 1, title: 'rUv-swarm Foundations', slug: 'ruv-swarm-foundations', level: 'foundations', duration_hours: 8, difficulty: 1, description: 'Master the fundamental concepts of swarm intelligence and neural networks. This course introduces you to the revolutionary approach of ephemeral intelligence through lightweight, temporary neural networks orchestrated in swarms.', prerequisites: 'Basic programming knowledge. Familiarity with C is helpful but not required.', learning_objectives: '• Understand the core concepts of neural networks and activation functions\n• Grasp the XOR problem and why it demonstrates non-linear separability\n• Learn swarm intelligence principles and emergence\n• Master Particle Swarm Optimization (PSO) fundamentals\n• Execute and analyze rUv-swarm programs from the command line', thumbnail_url: 'https://placehold.co/600x400/1e40af/ffffff?text=Foundations', is_published: true, instructor_id: 2 },
        { id: 2, title: 'rUv-swarm Practitioner', slug: 'ruv-swarm-practitioner', level: 'practitioner', duration_hours: 16, difficulty: 3, description: 'Deep dive into the rUv-swarm codebase and learn to modify and extend the system. Master the FANN library, understand PSO implementation, and build your own neural network solutions.', prerequisites: 'Completion of rUv-swarm Foundations. Strong C programming skills required.', learning_objectives: '• Master the FANN (Fast Artificial Neural Network) library\n• Analyze and modify the rUv-swarm source code\n• Understand PSO implementation details and parameters\n• Tune hyperparameters for optimal performance\n• Adapt the system for new datasets and problems', thumbnail_url: 'https://placehold.co/600x400/be123c/ffffff?text=Practitioner', is_published: true, instructor_id: 2 },
        { id: 3, title: 'rUv-swarm Architect', slug: 'ruv-swarm-architect', level: 'architect', duration_hours: 24, difficulty: 5, description: 'Design and implement advanced swarm intelligence systems. Learn to extend rUv-swarm with new optimization algorithms, deploy containerized solutions, and architect distributed cognitive systems.', prerequisites: 'Completion of rUv-swarm Practitioner. Advanced programming and system design experience.', learning_objectives: '• Implement alternative optimization algorithms (GA, ACO)\n• Design modular, extensible AI architectures\n• Containerize and deploy rUv-swarm applications\n• Architect solutions for complex, real-world problems\n• Create comprehensive AI system documentation', thumbnail_url: 'https://placehold.co/600x400/047857/ffffff?text=Architect', is_published: true, instructor_id: 2 }
    ],
    enrollments: [
        { id: 1, user_id: 3, course_id: 1, status: 'in_progress', progress_percentage: 60, enrolled_at: '2024-01-15' },
        { id: 2, user_id: 3, course_id: 2, status: 'not_started', progress_percentage: 0, enrolled_at: '2024-01-20' },
        { id: 3, user_id: 4, course_id: 1, status: 'completed', progress_percentage: 100, enrolled_at: '2024-01-10' },
        { id: 4, user_id: 4, course_id: 2, status: 'in_progress', progress_percentage: 25, enrolled_at: '2024-01-25' },
        { id: 5, user_id: 5, course_id: 1, status: 'in_progress', progress_percentage: 80, enrolled_at: '2024-01-12' }
    ],
    achievements: [
        { id: 1, name: 'Neural Network Novice', description: 'Completed first neural network lesson', icon: 'brain', points: 10 },
        { id: 2, name: 'XOR Master', description: 'Successfully solved the XOR problem', icon: 'logic', points: 25 },
        { id: 3, name: 'Swarm Intelligence Explorer', description: 'Completed swarm intelligence module', icon: 'swarm', points: 50 },
        { id: 4, name: 'PSO Practitioner', description: 'Mastered Particle Swarm Optimization', icon: 'optimization', points: 75 },
        { id: 5, name: 'rUv-swarm Graduate', description: 'Completed the Foundations course', icon: 'graduation', points: 100 }
    ],
    user_achievements: [
        { id: 1, user_id: 3, achievement_id: 1, earned_at: '2024-01-15' },
        { id: 2, user_id: 3, achievement_id: 2, earned_at: '2024-01-16' },
        { id: 3, user_id: 4, achievement_id: 1, earned_at: '2024-01-10' },
        { id: 4, user_id: 4, achievement_id: 2, earned_at: '2024-01-11' },
        { id: 5, user_id: 4, achievement_id: 3, earned_at: '2024-01-12' }
    ]
};

const ProfileView = () => {
    const { currentUser, setView } = useContext(AppContext);
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