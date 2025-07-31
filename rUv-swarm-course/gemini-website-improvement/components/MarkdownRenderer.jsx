import React, { useState, useEffect } from 'react';
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
} from '../InteractiveComponents.jsx';

// Component mapping for interactive elements
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
    'NetworkArchitectureBuilder': NetworkTopologyDemo,
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

// Parse content and extract components
const parseContent = (content) => {
    const elements = [];
    const lines = content.split('\n');
    let currentText = '';
    
    lines.forEach((line, index) => {
        // Check for component tags
        const componentMatch = line.match(/<([A-Z][a-zA-Z]*)\s*\/>/);
        
        if (componentMatch) {
            // Add any accumulated text before the component
            if (currentText.trim()) {
                elements.push({
                    type: 'text',
                    content: currentText,
                    key: `text-${index}`
                });
                currentText = '';
            }
            
            // Add the component
            const componentName = componentMatch[1];
            if (componentMap[componentName]) {
                elements.push({
                    type: 'component',
                    componentName: componentName,
                    Component: componentMap[componentName],
                    key: `component-${index}`
                });
            }
        } else {
            currentText += line + '\n';
        }
    });
    
    // Add any remaining text
    if (currentText.trim()) {
        elements.push({
            type: 'text',
            content: currentText,
            key: `text-final`
        });
    }
    
    return elements;
};

// Convert markdown text to HTML
const markdownToHtml = (text) => {
    return text
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 text-blue-300">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 text-blue-300">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-blue-300">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-green-300">$1</code>')
        .replace(/```([\\s\\S]*?)```/g, '<pre class="bg-black p-4 rounded-lg overflow-x-auto mb-4"><code class="text-green-300 font-mono text-sm">$1</code></pre>')
        .replace(/\$\$([^$]+)\$\$/g, '<div class="math-block bg-gray-900 p-4 rounded-lg my-4 text-center text-white font-mono">$1</div>')
        .replace(/\$([^$]+)\$/g, '<span class="math-inline bg-gray-800 px-2 py-1 rounded text-sm font-mono text-green-300">$1</span>')
        .replace(/\n/g, '<br>');
};

const MarkdownRenderer = ({ content }) => {
    const [elements, setElements] = useState([]);
    
    useEffect(() => {
        if (content) {
            const parsed = parseContent(content);
            setElements(parsed);
        }
    }, [content]);
    
    return (
        <div className="prose prose-invert max-w-none text-gray-300">
            {elements.map((element) => {
                if (element.type === 'text') {
                    return (
                        <div 
                            key={element.key}
                            dangerouslySetInnerHTML={{ __html: markdownToHtml(element.content) }}
                        />
                    );
                } else if (element.type === 'component') {
                    const Component = element.Component;
                    return (
                        <div key={element.key} className="my-8">
                            <Component />
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default MarkdownRenderer;