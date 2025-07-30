import React, { useContext } from 'react';
import { Clock, Star } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

// Note: courseData should be imported from App.jsx or passed as props
// For now, we'll need to import it from the main App file
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
    ]
};

const CourseDashboard = () => {
    const { setView, setSelectedCourseId, currentUser } = useContext(AppContext);
    
    const handleCourseSelect = (id) => {
        setSelectedCourseId(id);
        setView('course');
    };

    const getCourseProgress = (courseId) => {
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