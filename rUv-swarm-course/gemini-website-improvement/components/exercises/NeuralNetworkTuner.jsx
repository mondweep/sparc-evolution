import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NeuralNetworkTuner = () => {
    const d3Container = useRef(null);
    const [parameters, setParameters] = useState({
        learningRate: 0.1,
        hiddenLayers: 1,
        neuronsPerLayer: 4,
        epochs: 100,
        activationFunction: 'sigmoid'
    });
    
    const [training, setTraining] = useState(false);
    const [trainingData, setTrainingData] = useState([]);
    const [currentEpoch, setCurrentEpoch] = useState(0);
    const [error, setError] = useState(1);
    const [explanation, setExplanation] = useState("");

    const activationFunctions = {
        sigmoid: { name: 'Sigmoid', fn: x => 1 / (1 + Math.exp(-x)) },
        tanh: { name: 'Tanh', fn: x => Math.tanh(x) },
        relu: { name: 'ReLU', fn: x => Math.max(0, x) },
        leakyRelu: { name: 'Leaky ReLU', fn: x => Math.max(0.01 * x, x) }
    };

    // XOR problem data for training simulation
    const xorData = [
        { inputs: [0, 0], target: 0 },
        { inputs: [0, 1], target: 1 },
        { inputs: [1, 0], target: 1 },
        { inputs: [1, 1], target: 0 }
    ];

    const simulateTraining = () => {
        setTraining(true);
        setTrainingData([]);
        setCurrentEpoch(0);
        setError(1);
        
        const data = [];
        const baseConvergenceRate = parameters.learningRate * 0.01;
        const complexityFactor = Math.max(1, parameters.hiddenLayers * parameters.neuronsPerLayer / 10);
        
        for (let epoch = 0; epoch <= parameters.epochs; epoch++) {
            // Simulate error reduction with realistic curves
            let epochError;
            if (parameters.activationFunction === 'relu' && parameters.learningRate > 0.1) {
                // ReLU with high learning rates can be unstable
                epochError = 0.5 + 0.3 * Math.sin(epoch * 0.1) * Math.exp(-epoch * baseConvergenceRate / 2);
            } else if (parameters.activationFunction === 'sigmoid' && parameters.hiddenLayers < 2) {
                // Sigmoid with insufficient layers struggles with XOR
                epochError = Math.max(0.4, Math.exp(-epoch * baseConvergenceRate / complexityFactor));
            } else {
                // Normal convergence
                epochError = Math.exp(-epoch * baseConvergenceRate / complexityFactor) + 
                           0.05 * Math.random() + 
                           (epoch < 10 ? 0.2 * Math.exp(-epoch * 0.3) : 0);
            }
            
            data.push({ epoch, error: Math.max(0.01, epochError) });
        }
        
        setTrainingData(data);
        
        // Animate training progress
        let animationEpoch = 0;
        const animateTraining = () => {
            if (animationEpoch <= parameters.epochs && training) {
                setCurrentEpoch(animationEpoch);
                setError(data[animationEpoch].error);
                animationEpoch += Math.max(1, Math.floor(parameters.epochs / 50));
                setTimeout(animateTraining, 50);
            } else {
                setTraining(false);
                generateExplanation(data[data.length - 1].error);
            }
        };
        
        setTimeout(animateTraining, 100);
    };

    const generateExplanation = (finalError) => {
        let explanationText = "";
        
        if (finalError > 0.3) {
            explanationText = "⚠️ Poor convergence. ";
            if (parameters.hiddenLayers < 2) {
                explanationText += "Try adding more hidden layers - XOR requires non-linear separation. ";
            }
            if (parameters.learningRate > 0.5) {
                explanationText += "Learning rate might be too high, causing instability. ";
            }
            if (parameters.learningRate < 0.01) {
                explanationText += "Learning rate might be too low, slowing convergence. ";
            }
        } else if (finalError > 0.1) {
            explanationText = "⚡ Moderate performance. ";
            if (parameters.neuronsPerLayer < 4) {
                explanationText += "Consider adding more neurons per layer for better capacity. ";
            }
        } else {
            explanationText = "✅ Excellent convergence! ";
            explanationText += "Good parameter choices for the XOR problem. ";
        }
        
        explanationText += `Final error: ${finalError.toFixed(4)}`;
        setExplanation(explanationText);
    };

    const drawTrainingChart = () => {
        if (!d3Container.current || trainingData.length === 0) return;

        const svg = d3.select(d3Container.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const chart = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, parameters.epochs])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, Math.max(1, d3.max(trainingData, d => d.error))])
            .range([height, 0]);

        // Add axes
        chart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .attr("color", "#9ca3af");

        chart.append("g")
            .call(d3.axisLeft(y))
            .attr("color", "#9ca3af");

        // Add axis labels
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("fill", "#9ca3af")
            .text("Training Error");

        chart.append("text")             
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
            .style("text-anchor", "middle")
            .attr("fill", "#9ca3af")
            .text("Epochs");

        // Draw line
        const line = d3.line()
            .x(d => x(d.epoch))
            .y(d => y(d.error))
            .curve(d3.curveMonotoneX);

        const currentData = trainingData.slice(0, Math.floor(currentEpoch * trainingData.length / parameters.epochs) + 1);
        
        chart.append("path")
            .datum(currentData)
            .attr("fill", "none")
            .attr("stroke", "#3b82f6")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Add current point
        if (currentData.length > 0) {
            const currentPoint = currentData[currentData.length - 1];
            chart.append("circle")
                .attr("cx", x(currentPoint.epoch))
                .attr("cy", y(currentPoint.error))
                .attr("r", 4)
                .attr("fill", "#f59e0b");
        }
    };

    useEffect(() => {
        drawTrainingChart();
    }, [trainingData, currentEpoch]);

    const handleParameterChange = (param, value) => {
        setParameters(prev => ({ ...prev, [param]: value }));
        setExplanation("");
    };

    const resetParameters = () => {
        setParameters({
            learningRate: 0.1,
            hiddenLayers: 1,
            neuronsPerLayer: 4,
            epochs: 100,
            activationFunction: 'sigmoid'
        });
        setTrainingData([]);
        setExplanation("");
    };

    return (
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">🧠 Neural Network Parameter Tuner</h3>
            <p className="text-gray-400 mb-6">
                Experiment with different neural network parameters and see how they affect training performance on the XOR problem.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Parameter Controls */}
                <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Parameters</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Learning Rate: {parameters.learningRate}
                            </label>
                            <input
                                type="range"
                                min="0.01"
                                max="1"
                                step="0.01"
                                value={parameters.learningRate}
                                onChange={(e) => handleParameterChange('learningRate', parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0.01 (slow)</span>
                                <span>1.0 (fast)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Hidden Layers: {parameters.hiddenLayers}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="4"
                                step="1"
                                value={parameters.hiddenLayers}
                                onChange={(e) => handleParameterChange('hiddenLayers', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 layer</span>
                                <span>4 layers</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Neurons per Layer: {parameters.neuronsPerLayer}
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="16"
                                step="1"
                                value={parameters.neuronsPerLayer}
                                onChange={(e) => handleParameterChange('neuronsPerLayer', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>2 neurons</span>
                                <span>16 neurons</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Training Epochs: {parameters.epochs}
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="500"
                                step="10"
                                value={parameters.epochs}
                                onChange={(e) => handleParameterChange('epochs', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>50 epochs</span>
                                <span>500 epochs</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Activation Function
                            </label>
                            <select
                                value={parameters.activationFunction}
                                onChange={(e) => handleParameterChange('activationFunction', e.target.value)}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2"
                            >
                                {Object.entries(activationFunctions).map(([key, func]) => (
                                    <option key={key} value={key}>{func.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={simulateTraining}
                            disabled={training}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            {training ? `Training... (${currentEpoch}/${parameters.epochs})` : 'Start Training'}
                        </button>
                        <button
                            onClick={resetParameters}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Training Visualization */}
                <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Training Progress</h4>
                    <svg ref={d3Container} />
                    
                    {training && (
                        <div className="mt-4 text-center">
                            <div className="text-2xl font-bold text-blue-400">
                                Epoch {currentEpoch} / {parameters.epochs}
                            </div>
                            <div className="text-lg text-gray-300">
                                Current Error: {error.toFixed(4)}
                            </div>
                        </div>
                    )}
                    
                    {explanation && (
                        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                            <h5 className="font-semibold text-white mb-2">Analysis:</h5>
                            <p className="text-gray-300 text-sm">{explanation}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">💡 Learning Tips</h4>
                <div className="text-sm text-gray-300 space-y-2">
                    <p><strong>Learning Rate:</strong> Too high causes instability, too low causes slow learning.</p>
                    <p><strong>Hidden Layers:</strong> XOR requires at least 1 hidden layer for non-linear separation.</p>
                    <p><strong>Neurons:</strong> More neurons provide more capacity but risk overfitting.</p>
                    <p><strong>Activation Functions:</strong> Try different functions to see how they affect convergence.</p>
                </div>
            </div>
        </div>
    );
};

export default NeuralNetworkTuner;