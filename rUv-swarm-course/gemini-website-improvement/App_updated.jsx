import React, { useState, useEffect, useMemo, createContext, useContext, useRef } from 'react';
import { CheckCircle, XCircle, BookOpen, Code, Award, User, ChevronDown, ChevronUp, ArrowLeft, Star, Clock } from 'lucide-react';
import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
    InteractiveNeuralNetwork, 
    InteractiveXOR, 
    SwarmIntelligenceDemo, 
    PSOVisualization, 
    AdvancedPSODemo,
    RuvSwarmSimulation,
    NetworkTopologyDemo,
    ActivationFunctionDemo,
    FANNUtilsDemo,
    GeneticAlgorithmDemo,
    AdvancedDeepNetworkVisualization,
    AdvancedRLEnvironment,
    SystemArchitectureVisualization,
    DistributedSystemAnimation,
    ScalabilityDemonstration,
    PerformanceOptimizationTools
} from './InteractiveComponents.jsx';

// Import extracted components
import ViewManager from './components/common/ViewManager.jsx';
import { AppContext } from './components/context/AppContext.jsx';
import Header from './components/common/Header.jsx';

// TODO: Move this to a separate data file
// --- Data from Python Script (converted to JSON) ---
const courseData = {
    users: [
        { id: 1, username: 'admin', email: 'admin@ruv-swarm.edu', firstName: 'System', lastName: 'Administrator', role: 'admin', bio: 'System administrator for the rUv-swarm learning platform.' },
        { id: 2, username: 'dr_neuralnet', email: 'instructor@ruv-swarm.edu', firstName: 'Dr. Elena', lastName: 'NetworkWeaver', role: 'instructor', bio: 'AI researcher specializing in swarm intelligence and neural networks. PhD in Computer Science from MIT.' },
        { id: 3, username: 'alex_student', email: 'alex@student.edu', firstName: 'Alex', lastName: 'Learner', role: 'student', bio: 'Computer Science student passionate about AI and distributed systems.' },
        { id: 4, username: 'sarah_dev', email: 'sarah@developer.com', firstName: 'Sarah', lastName: 'Developer', role: 'student', bio: 'Full-stack developer exploring AI/ML applications.' },
        { id: 5, username: 'mike_researcher', email: 'mike@research.org', firstName: 'Mike', lastName: 'Researcher', role: 'student', bio: 'Research scientist investigating evolutionary algorithms.' }
    ],
    courses: [
        { id: 1, title: 'rUv-swarm Foundations', slug: 'ruv-swarm-foundations', level: 'foundations', duration_hours: 8, difficulty: 1, description: 'Master the fundamental concepts of swarm intelligence and neural networks. This course introduces you to the revolutionary approach of ephemeral intelligence through lightweight, temporary neural networks orchestrated in swarms.', prerequisites: 'Basic programming knowledge. Familiarity with C is helpful but not required.', learning_objectives: '• Understand the core concepts of neural networks and activation functions\\n• Grasp the XOR problem and why it demonstrates non-linear separability\\n• Learn swarm intelligence principles and emergence\\n• Master Particle Swarm Optimization (PSO) fundamentals\\n• Execute and analyze rUv-swarm programs from the command line', thumbnail_url: 'https://placehold.co/600x400/1e40af/ffffff?text=Foundations', is_published: true, instructor_id: 2 },
        { id: 2, title: 'rUv-swarm Practitioner', slug: 'ruv-swarm-practitioner', level: 'practitioner', duration_hours: 16, difficulty: 3, description: 'Deep dive into the rUv-swarm codebase and learn to modify and extend the system. Master the FANN library, understand PSO implementation, and build your own neural network solutions.', prerequisites: 'Completion of rUv-swarm Foundations. Strong C programming skills required.', learning_objectives: '• Master the FANN (Fast Artificial Neural Network) library\\n• Analyze and modify the rUv-swarm source code\\n• Understand PSO implementation details and parameters\\n• Tune hyperparameters for optimal performance\\n• Adapt the system for new datasets and problems', thumbnail_url: 'https://placehold.co/600x400/be123c/ffffff?text=Practitioner', is_published: true, instructor_id: 2 },
        { id: 3, title: 'rUv-swarm Architect', slug: 'ruv-swarm-architect', level: 'architect', duration_hours: 24, difficulty: 5, description: 'Design and implement advanced swarm intelligence systems. Learn to extend rUv-swarm with new optimization algorithms, deploy containerized solutions, and architect distributed cognitive systems.', prerequisites: 'Completion of rUv-swarm Practitioner. Advanced programming and system design experience.', learning_objectives: '• Implement alternative optimization algorithms (GA, ACO)\\n• Design modular, extensible AI architectures\\n• Containerize and deploy rUv-swarm applications\\n• Architect solutions for complex, real-world problems\\n• Create comprehensive AI system documentation', thumbnail_url: 'https://placehold.co/600x400/047857/ffffff?text=Architect', is_published: true, instructor_id: 2 }
    ],
    // Adding placeholder data - full data should be extracted from original file
    modules: [],
    lessons: [],
    quizzes: [],
    code_exercises: [],
    lesson_progress: [],
    enrollments: [],
    quiz_questions: [],
    quiz_answers: []
};

const App = () => {
    const [currentUser, setCurrentUser] = useState(courseData.users.find(u => u.role === 'student'));
    const [view, setView] = useState('dashboard'); // dashboard, course, lesson, quiz
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const contextValue = {
        currentUser, setCurrentUser,
        view, setView,
        selectedCourseId, setSelectedCourseId,
        selectedLessonId, setSelectedLessonId,
        selectedQuizId, setSelectedQuizId,
        courseData // Pass courseData through context
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