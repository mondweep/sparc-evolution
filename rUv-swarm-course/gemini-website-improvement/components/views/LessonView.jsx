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
        if (!containerRef.current || !content) return;

        // Simple markdown parsing - convert headers, code blocks, etc.
        let html = content
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 text-blue-300">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 text-blue-300">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-blue-300">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-green-300">$1</code>')
            .replace(/```([\\s\\S]*?)```/g, '<pre class="bg-black p-4 rounded-lg overflow-x-auto mb-4"><code class="text-green-300 font-mono text-sm">$1</code></pre>')
            .replace(/\n/g, '<br>')
            // Convert JSX-style components to HTML divs with IDs
            .replace(/<([A-Z][a-zA-Z]*)\s*\/>/g, '<div id="$1" class="my-6"></div>')
            // Handle LaTeX math expressions
            .replace(/\$\$([^$]+)\$\$/g, '<div class="math-block bg-gray-900 p-4 rounded-lg my-4 text-center text-white font-mono">$1</div>')
            .replace(/\$([^$]+)\$/g, '<span class="math-inline bg-gray-800 px-2 py-1 rounded text-sm font-mono text-green-300">$1</span>');

        // Handle interactive component divs
        const componentMap = {
            'InteractiveSwarmSimulation': SwarmIntelligenceDemo,
            'SwarmBehaviorSimulator': SwarmIntelligenceDemo,
            'ParticleSwarmVisualization': PSOVisualization,
            'InteractiveSwarmBuilder': SwarmIntelligenceDemo,
            'EmergentPatternsDemo': SwarmIntelligenceDemo,
            'GameOfLifeSimulator': SwarmIntelligenceDemo,
            'BoidsSimulation': SwarmIntelligenceDemo,
            'EmergenceParameterLab': SwarmIntelligenceDemo,
            'ComplexityEvolutionVisualizer': SwarmIntelligenceDemo,
            'BiologicalNeuronAnimation': InteractiveNeuralNetwork,
            'InteractivePerceptron': InteractiveNeuralNetwork,
            'ActivationFunctionExplorer': ActivationFunctionDemo,
            'PerceptronLearningVisualization': InteractiveNeuralNetwork,
            'PerceptronTrainer': InteractiveNeuralNetwork,
            'LinearSeparabilityDemo': InteractiveNeuralNetwork,
            'InteractiveNeuralNetwork': InteractiveNeuralNetwork,
            'NetworkArchitectureBuilder': InteractiveNeuralNetwork,
            'ForwardPropagationAnimation': InteractiveNeuralNetwork,
            'BackpropagationVisualizer': InteractiveNeuralNetwork,
            'NeuralNetworkPlayground': InteractiveNeuralNetwork,
            'RealTimeTrainingVisualizer': InteractiveNeuralNetwork,
            'XORProblemVisualization': InteractiveXOR,
            'LinearSeparabilityXOR': InteractiveXOR,
            'XORSolutionNetwork': InteractiveXOR,
            'InteractiveXORSolver': InteractiveXOR,
            'XORSpaceTransformation': InteractiveXOR,
            'AntColonyVisualization': SwarmIntelligenceDemo,
            'PheromoneTrailSimulation': SwarmIntelligenceDemo,
            'ShortestPathDiscovery': SwarmIntelligenceDemo,
            'InteractiveAntColony': SwarmIntelligenceDemo,
            'RealAntBehaviorData': SwarmIntelligenceDemo,
            'ACOAlgorithmFlowchart': SwarmIntelligenceDemo,
            'BirdFlockingSimulation': PSOVisualization,
            'PersonalBestVisualization': PSOVisualization,
            'GlobalBestVisualization': PSOVisualization,
            'VelocityUpdateAnimation': PSOVisualization,
            'ExplorationExploitationBalance': PSOVisualization,
            'ConvergencePatternAnalysis': PSOVisualization,
            'ParticleSwarmOptimization': PSOVisualization,
            'WaggleDanceAnimation': SwarmIntelligenceDemo,
            'ScoutBeeExploration': SwarmIntelligenceDemo,
            'EmployedBeeForaging': SwarmIntelligenceDemo,
            'OnlookerBeeDecision': SwarmIntelligenceDemo,
            'AgentCommunicationOverview': NetworkTopologyDemo,
            'DirectMessagingDemo': NetworkTopologyDemo,
            'BroadcastMessagingDemo': NetworkTopologyDemo
        };

        containerRef.current.innerHTML = html;

        // Mount interactive components
        Object.entries(componentMap).forEach(([componentName, Component]) => {
            const element = containerRef.current.querySelector(`#${componentName}`);
            if (element && Component) {
                // Create React component and mount it
                const root = document.createElement('div');
                element.appendChild(root);
                // Add a styled placeholder for the interactive component
                root.innerHTML = `<div class="bg-gradient-to-r from-blue-800 to-purple-800 p-6 rounded-lg text-center border-2 border-blue-600 shadow-lg">
                    <div class="flex items-center justify-center mb-3">
                        <div class="w-4 h-4 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                        <p class="text-blue-200 font-semibold text-lg">${componentName}</p>
                    </div>
                    <p class="text-gray-300 text-sm">Interactive ${Component.name || 'Animation'} Component</p>
                    <p class="text-gray-400 text-xs mt-2">🎮 Interactive elements will be rendered here</p>
                </div>`;
            }
        });
    }, [content, lessonSlug]);

    return <div ref={containerRef} className="prose prose-invert max-w-none text-gray-300" />;
};


const LessonView = () => {
    const { selectedLessonId, setView, setSelectedLessonId, setSelectedCourseId, courseData } = useContext(AppContext);
    
    if (!courseData || !courseData.lessons || !selectedLessonId) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <p>No lesson selected</p>
            </div>
        );
    }
    
    const lesson = courseData.lessons.find(l => l.id === selectedLessonId);
    if (!lesson) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <p>Lesson not found</p>
            </div>
        );
    }
    
    const module = courseData.modules ? courseData.modules.find(m => m.id === lesson.module_id) : null;
    const course = module && courseData.courses ? courseData.courses.find(c => c.id === module.course_id) : null;
    const exercises = courseData.code_exercises ? courseData.code_exercises.filter(e => e.lesson_id === lesson.id) : [];
    const allLessonsInModule = courseData.lessons && module ? courseData.lessons.filter(l => l.module_id === module.id).sort((a,b) => a.order_index - b.order_index) : [];
    const currentIndex = allLessonsInModule.findIndex(l => l.id === lesson.id);

    const goToCourseView = () => {
        if (course) {
            setSelectedCourseId(course.id);
        }
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
                    <SimpleMarkdown content={lesson.content} lessonSlug={lesson.slug} />
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