import React, { useState, useContext } from 'react';
import { ArrowLeft, User, BookOpen, ChevronDown, ChevronUp, CheckCircle, Award } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';

// Note: courseData should be imported from App.jsx or passed as props
// For now, we'll need to import it or access it through context
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
    modules: [
        // Foundations
        { id: 1, course_id: 1, title: 'Introduction to Neural Networks', slug: 'intro-neural-networks', description: 'Understand the building blocks of artificial intelligence', order_index: 1, duration_minutes: 90 },
        { id: 2, course_id: 1, title: 'The XOR Problem', slug: 'xor-problem', description: 'The classic test case that proves the power of neural networks', order_index: 2, duration_minutes: 75 },
        { id: 3, course_id: 1, title: 'Introduction to Swarm Intelligence', slug: 'swarm-intelligence', description: 'How simple agents create complex intelligent behavior', order_index: 3, duration_minutes: 85 },
        { id: 4, course_id: 1, title: 'Particle Swarm Optimization Fundamentals', slug: 'pso-fundamentals', description: 'Master the core algorithm behind rUv-swarm', order_index: 4, duration_minutes: 100 },
        { id: 5, course_id: 1, title: 'Hands-On: Running rUv-swarm', slug: 'hands-on-ruv-swarm', description: 'Execute and analyze rUv-swarm programs', order_index: 5, duration_minutes: 120 },
        // Practitioner
        { id: 6, course_id: 2, title: 'Deep Dive: The FANN Library', slug: 'fann-library-deep-dive', description: 'Master the Fast Artificial Neural Network library', order_index: 1, duration_minutes: 180 },
        { id: 7, course_id: 2, title: 'Code Walkthrough: fann_utils.c', slug: 'fann-utils-walkthrough', description: 'Analyze the rUv-swarm FANN wrapper functions', order_index: 2, duration_minutes: 120 },
        // Architect
        { id: 8, course_id: 3, title: 'Advanced Optimization Algorithms', slug: 'advanced-optimization', description: 'Beyond PSO: GA, ACO, and hybrid approaches', order_index: 1, duration_minutes: 150 }
    ],
    lessons: [
        { id: 1, module_id: 1, title: 'What is a Neural Network?', slug: 'what-is-neural-network', description: 'Basic concepts and biological inspiration', duration_minutes: 30, order_index: 1 },
        { id: 2, module_id: 1, title: 'Activation Functions', slug: 'activation-functions', description: 'The building blocks of network computation', duration_minutes: 25, order_index: 2 },
        { id: 3, module_id: 2, title: 'Understanding XOR', slug: 'understanding-xor', description: 'Why XOR cannot be solved linearly', duration_minutes: 20, order_index: 1 },
    ],
    quizzes: [
        { id: 1, module_id: 1, title: 'Neural Networks Basics Quiz', description: 'Test your understanding of fundamental concepts', time_limit_minutes: 15, passing_score: 70 },
        { id: 2, module_id: 2, title: 'XOR Problem Quiz', description: 'Verify your grasp of the XOR challenge', time_limit_minutes: 10, passing_score: 80 }
    ],
    lesson_progress: [
        { id: 1, user_id: 3, lesson_id: 1, progress_percentage: 100, started_at: '2024-01-15', completed_at: '2024-01-15' },
        { id: 2, user_id: 3, lesson_id: 2, progress_percentage: 50, started_at: '2024-01-16', completed_at: null },
        { id: 3, user_id: 4, lesson_id: 1, progress_percentage: 100, started_at: '2024-01-10', completed_at: '2024-01-10' },
        { id: 4, user_id: 4, lesson_id: 2, progress_percentage: 100, started_at: '2024-01-11', completed_at: '2024-01-11' }
    ]
};

const ModuleItem = ({ module }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { setView, setSelectedLessonId, setSelectedQuizId, currentUser } = useContext(AppContext);
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

const CourseView = () => {
    const { selectedCourseId, setView } = useContext(AppContext);
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
                <div className="flex items-center space-x-2 text-gray-400 mb-6">
                    <User size={16} />
                    <span>Instructor: {instructor.firstName} {instructor.lastName}</span>
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