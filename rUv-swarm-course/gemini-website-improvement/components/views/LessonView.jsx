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

// Remove hardcoded courseData - now using AppContext

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
    const { selectedLessonId, setView, setSelectedLessonId, setSelectedCourseId, courseData } = useContext(AppContext);
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