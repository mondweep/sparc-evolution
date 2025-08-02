import React from 'react';
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
import XorProblemVisualizer from '../visualizers/XorProblemVisualizer';
import PSOParticleAnimation from '../visualizers/PSOParticleAnimation';
import SwarmBehaviorDemo from '../visualizers/SwarmBehaviorDemo';
import NeuralNetworkTraining from '../visualizers/NeuralNetworkTraining';

const SimpleMarkdown = ({ content, lessonSlug }) => {
    const parts = content.split(/<div id="(.+?)"><\/div>/);
    
    return (
        <div className="prose prose-lg max-w-none text-gray-200">
            {parts.map((part, index) => {
                if (index % 2 === 1) { // This is an ID for an interactive component
                    if (part === "interactive-activation-functions") {
                        return <ActivationFunctionDemo key={index} />;
                    }
                    if (part === "interactive-network-topology") {
                        return <NetworkTopologyDemo key={index} />;
                    }
                    if (part === "interactive-xor-problem") {
                        return <XorProblemVisualizer key={index} />;
                    }
                    // New interactive components for rUv-swarm Foundations
                    if (part === "interactive-neural-network") {
                        return <InteractiveNeuralNetwork key={index} />;
                    }
                    if (part === "interactive-xor-demo") {
                        return <InteractiveXOR key={index} />;
                    }
                    if (part === "swarm-intelligence-demo") {
                        return <SwarmIntelligenceDemo key={index} />;
                    }
                    if (part === "pso-visualization") {
                        return <PSOVisualization key={index} />;
                    }
                    if (part === "advanced-pso-demo") {
                        return <AdvancedPSODemo key={index} />;
                    }
                    if (part === "ruv-swarm-simulation") {
                        return <RuvSwarmSimulation key={index} />;
                    }
                    if (part === "fann-utils-demo") {
                        return <FANNUtilsDemo key={index} />;
                    }
                    if (part === "genetic-algorithm-demo") {
                        return <GeneticAlgorithmDemo key={index} />;
                    }
                    // New Practitioner Course Components
                    if (part === "advanced-deep-network-visualization") {
                        return <AdvancedDeepNetworkVisualization key={index} />;
                    }
                    if (part === "advanced-rl-environment") {
                        return <AdvancedRLEnvironment key={index} />;
                    }
                    // New Architect Course Components
                    if (part === "system-architecture-visualization") {
                        return <SystemArchitectureVisualization key={index} />;
                    }
                    if (part === "distributed-system-animation") {
                        return <DistributedSystemAnimation key={index} />;
                    }
                    if (part === "scalability-demonstration") {
                        return <ScalabilityDemonstration key={index} />;
                    }
                    if (part === "performance-optimization-tools") {
                        return <PerformanceOptimizationTools key={index} />;
                    }
                    return null;
                }

                // This is a regular text part
                return part.split('\n').map((line, lineIndex) => {
                     const key = `${index}-${lineIndex}`;
                    if (line.startsWith('# ')) {
                        return <h1 key={key} className="text-3xl font-bold text-white mb-4 mt-6 border-b border-gray-600 pb-2">{line.substring(2)}</h1>;
                    }
                    if (line.startsWith('## ')) {
                        return <h2 key={key} className="text-2xl font-semibold text-gray-100 mb-3 mt-5">{line.substring(3)}</h2>;
                    }
                    if (line.startsWith('### ')) {
                        return <h3 key={key} className="text-xl font-semibold text-gray-200 mb-2 mt-4">{line.substring(4)}</h3>;
                    }
                    if (line.startsWith('`')) {
                         const lang = line.substring(3);
                         let codeLines = [];
                         let i = lineIndex + 1;
                         // This logic is simplified and might not handle all markdown code block cases
                         return (
                             <pre key={key} className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
                                 <code className={`language-${lang} text-sm`}>{line.replace(/`/g, '')}</code>
                             </pre>
                         );
                    }
                    if (line.startsWith('- ')) {
                        return <li key={key} className="ml-6 list-disc">{line.substring(2)}</li>;
                    }
                    if (line.startsWith('|')) {
                        return null; // Simplified, tables handled by a library in a real app
                    }
                    if (line.trim() === '') {
                        return <br key={key} />;
                    }
                    if (line.includes('|---')) {
                        return null; 
                    }
                    return <p key={key} className="my-2 leading-relaxed">{line}</p>;
                });
            })}
        </div>
    );
};

export default SimpleMarkdown;