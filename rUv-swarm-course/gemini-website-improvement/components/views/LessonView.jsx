import React, { useState, useContext } from 'react';
import { useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { CodeExercise } from '../exercises/index.js';

// Import interactive components
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
} from '../../InteractiveComponents.jsx';

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
        { id: 1, module_id: 1, title: 'What is a Neural Network?', slug: 'what-is-neural-network', description: 'Basic concepts and biological inspiration', duration_minutes: 30, order_index: 1, content_markdown: '# What is a Neural Network?\n\n## Introduction\n\nNeural networks are the foundation of modern artificial intelligence...' },
        { id: 2, module_id: 1, title: 'Activation Functions', slug: 'activation-functions', description: 'The building blocks of network computation', duration_minutes: 25, order_index: 2, content_markdown: '# Activation Functions\n\n## Overview\n\nActivation functions determine the output of neural network nodes...' },
    ],
    code_exercises: [
        {
            id: 1,
            lesson_id: 1,
            title: 'Simple Neural Network Implementation',
            description: 'Implement a basic neural network structure',
            starter_code: '// Create a simple neural network\n// Your code here...',
            solution_code: '// Complete neural network implementation\n// Solution code here...'
        }
    ]
};

// Simple markdown renderer component
const SimpleMarkdown = ({ content, lessonSlug }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Simple markdown parsing - convert headers, code blocks, etc.
        let html = content
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 text-blue-300">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 text-blue-300">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-blue-300">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-green-300">$1</code>')
            .replace(/```([\\s\\S]*?)```/g, '<pre class="bg-black p-4 rounded-lg overflow-x-auto mb-4"><code class="text-green-300 font-mono text-sm">$1</code></pre>')
            .replace(/\\n/g, '<br>');

        // Handle interactive component divs
        const componentMap = {
            'interactive-neural-network': InteractiveNeuralNetwork,
            'interactive-xor': InteractiveXOR,
            'swarm-intelligence-demo': SwarmIntelligenceDemo,
            'pso-visualization': PSOVisualization,
            'advanced-pso-demo': AdvancedPSODemo,
            'ruv-swarm-simulation': RuvSwarmSimulation,
            'network-topology-demo': NetworkTopologyDemo,
            'activation-function-demo': ActivationFunctionDemo,
            'fann-utils-demo': FANNUtilsDemo,
            'genetic-algorithm-demo': GeneticAlgorithmDemo,
            'advanced-deep-network-visualization': AdvancedDeepNetworkVisualization,
            'advanced-rl-environment': AdvancedRLEnvironment,
            'system-architecture-visualization': SystemArchitectureVisualization,
            'distributed-system-animation': DistributedSystemAnimation,
            'scalability-demonstration': ScalabilityDemonstration,
            'performance-optimization-tools': PerformanceOptimizationTools
        };

        containerRef.current.innerHTML = html;

        // Mount interactive components
        Object.entries(componentMap).forEach(([id, Component]) => {
            const element = containerRef.current.querySelector(`#${id}`);
            if (element && Component) {
                // Create React component and mount it
                const root = document.createElement('div');
                element.appendChild(root);
                // Note: In a real implementation, you'd use ReactDOM.render or createRoot
                // For now, we'll just add a placeholder
                root.innerHTML = `<div class="bg-gray-800 p-6 rounded-lg text-center">
                    <p class="text-blue-300">Interactive Component: ${Component.name || id}</p>
                    <p class="text-gray-400 text-sm mt-2">Component would be rendered here</p>
                </div>`;
            }
        });
    }, [content, lessonSlug]);

    return <div ref={containerRef} className="prose prose-invert max-w-none text-gray-300" />;
};


const LessonView = () => {
    const { selectedLessonId, setView, setSelectedLessonId, setSelectedCourseId } = useContext(AppContext);
    const lesson = courseData.lessons.find(l => l.id === selectedLessonId);
    const module = courseData.modules.find(m => m.id === lesson.module_id);
    const course = courseData.courses.find(c => c.id === module.course_id);
    const exercises = courseData.code_exercises.filter(e => e.lesson_id === lesson.id);
    const allLessonsInModule = courseData.lessons.filter(l => l.module_id === module.id).sort((a,b) => a.order_index - b.order_index);
    const currentIndex = allLessonsInModule.findIndex(l => l.id === lesson.id);

    const goToCourseView = () => {
        setSelectedCourseId(course.id);
        setView('course');
    };
    
    const goToLesson = (lessonId) => {
        setSelectedLessonId(lessonId);
    };

    return (
        <div>
            <div className="mb-6 text-sm text-gray-400">
                <span className="cursor-pointer hover:underline" onClick={goToCourseView}>{course.title}</span>
                <span className="mx-2">/</span>
                <span>{module.title}</span>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-4xl font-extrabold mb-2 text-white">{lesson.title}</h2>
                <p className="text-gray-400 mb-6">{lesson.description}</p>
                <div className="border-t border-gray-700 pt-6">
                    <SimpleMarkdown content={lesson.content_markdown} lessonSlug={lesson.slug} />
                </div>
                {exercises.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-4 text-blue-300">Code Exercises</h3>
                        {exercises.map(ex => <CodeExercise key={ex.id} exercise={ex} />)}
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-8">
                {currentIndex > 0 ? (
                    <button onClick={() => goToLesson(allLessonsInModule[currentIndex - 1].id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Previous Lesson
                    </button>
                ) : <div></div>}
                {currentIndex < allLessonsInModule.length - 1 ? (
                    <button onClick={() => goToLesson(allLessonsInModule[currentIndex + 1].id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Next Lesson
                    </button>
                ) : <div></div>}
            </div>
        </div>
    );
};

export default LessonView;