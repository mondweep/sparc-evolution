import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NeuralNetworkTraining = () => {
    const svgRef = useRef();
    const chartRef = useRef();
    const animationRef = useRef();
    const [isTraining, setIsTraining] = useState(false);
    const [epoch, setEpoch] = useState(0);
    const [network, setNetwork] = useState({
        weights: [
            [0.5, -0.3], // Input to hidden weights
            [0.8, 0.1]   // Hidden to output weights
        ],
        biases: [0.1, -0.2]
    });
    const [trainingData] = useState([
        { input: [0, 0], target: 0 },
        { input: [0, 1], target: 1 },
        { input: [1, 0], target: 1 },
        { input: [1, 1], target: 0 }
    ]);
    const [lossHistory, setLossHistory] = useState([]);
    const [learningRate] = useState(0.5);
    const [currentSample, setCurrentSample] = useState(0);

    // Activation functions
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
    const sigmoidDerivative = (x) => x * (1 - x);

    // Forward pass
    const forwardPass = (inputs, weights, biases) => {
        // Input to hidden layer
        const hiddenInput = inputs[0] * weights[0][0] + inputs[1] * weights[0][1] + biases[0];
        const hiddenOutput = sigmoid(hiddenInput);
        
        // Hidden to output layer
        const outputInput = hiddenOutput * weights[1][0] + biases[1];
        const output = sigmoid(outputInput);
        
        return {
            hiddenInput,
            hiddenOutput,
            outputInput,
            output,
            inputs
        };
    };

    // Backward pass (backpropagation)
    const backwardPass = (forward, target, weights, biases, learningRate) => {
        // Calculate output error
        const outputError = target - forward.output;
        const outputDelta = outputError * sigmoidDerivative(forward.output);
        
        // Calculate hidden error
        const hiddenError = outputDelta * weights[1][0];
        const hiddenDelta = hiddenError * sigmoidDerivative(forward.hiddenOutput);
        
        // Update weights and biases
        const newWeights = [
            [
                weights[0][0] + learningRate * hiddenDelta * forward.inputs[0],
                weights[0][1] + learningRate * hiddenDelta * forward.inputs[1]
            ],
            [
                weights[1][0] + learningRate * outputDelta * forward.hiddenOutput,
                weights[1][1] // Not used in this simple network
            ]
        ];
        
        const newBiases = [
            biases[0] + learningRate * hiddenDelta,
            biases[1] + learningRate * outputDelta
        ];
        
        return {
            weights: newWeights,
            biases: newBiases,
            loss: Math.pow(outputError, 2) / 2
        };
    };

    // Training step
    const trainStep = () => {
        const sample = trainingData[currentSample];
        const forward = forwardPass(sample.input, network.weights, network.biases);
        const backward = backwardPass(forward, sample.target, network.weights, network.biases, learningRate);
        
        setNetwork({
            weights: backward.weights,
            biases: backward.biases
        });
        
        // Update loss history
        setLossHistory(prev => [...prev.slice(-99), backward.loss]);
        
        // Move to next sample
        setCurrentSample((prev) => (prev + 1) % trainingData.length);
        
        // Increment epoch when we complete all samples
        if (currentSample === trainingData.length - 1) {
            setEpoch(prev => prev + 1);
        }
    };

    // Animation loop
    useEffect(() => {
        if (isTraining) {
            animationRef.current = setInterval(() => {
                trainStep();
            }, 200);
        } else {
            clearInterval(animationRef.current);
        }
        
        return () => clearInterval(animationRef.current);
    }, [isTraining, currentSample, network]);

    // Visualize network
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        const width = 400;
        const height = 300;
        svg.attr("width", width).attr("height", height);
        
        // Define positions
        const inputLayer = [{ x: 80, y: 100 }, { x: 80, y: 200 }];
        const hiddenLayer = [{ x: 200, y: 150 }];
        const outputLayer = [{ x: 320, y: 150 }];
        
        // Get current sample for visualization
        const sample = trainingData[currentSample];
        const forward = forwardPass(sample.input, network.weights, network.biases);
        
        // Draw connections with weights
        const connections = [
            { from: inputLayer[0], to: hiddenLayer[0], weight: network.weights[0][0], value: sample.input[0] * network.weights[0][0] },
            { from: inputLayer[1], to: hiddenLayer[0], weight: network.weights[0][1], value: sample.input[1] * network.weights[0][1] },
            { from: hiddenLayer[0], to: outputLayer[0], weight: network.weights[1][0], value: forward.hiddenOutput * network.weights[1][0] }
        ];
        
        connections.forEach((conn, i) => {
            // Connection line
            svg.append('line')
                .attr('x1', conn.from.x)
                .attr('y1', conn.from.y)
                .attr('x2', conn.to.x)
                .attr('y2', conn.to.y)
                .attr('stroke', conn.weight > 0 ? '#22c55e' : '#ef4444')
                .attr('stroke-width', Math.abs(conn.weight) * 4 + 1)
                .attr('opacity', 0.7);
            
            // Weight label
            const midX = (conn.from.x + conn.to.x) / 2;
            const midY = (conn.from.y + conn.to.y) / 2;
            svg.append('text')
                .attr('x', midX)
                .attr('y', midY - 10)
                .attr('text-anchor', 'middle')
                .attr('fill', '#e5e7eb')
                .attr('font-size', '10px')
                .text(`${conn.weight.toFixed(2)}`);
        });
        
        // Draw neurons
        const drawNeuron = (pos, value, label, color = '#3b82f6') => {
            svg.append('circle')
                .attr('cx', pos.x)
                .attr('cy', pos.y)
                .attr('r', 20)
                .attr('fill', color)
                .attr('stroke', '#e5e7eb')
                .attr('stroke-width', 2)
                .attr('opacity', 0.3 + value * 0.7); // Opacity based on activation
            
            svg.append('text')
                .attr('x', pos.x)
                .attr('y', pos.y + 4)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '10px')
                .attr('font-weight', 'bold')
                .text(value.toFixed(2));
            
            svg.append('text')
                .attr('x', pos.x)
                .attr('y', pos.y + 35)
                .attr('text-anchor', 'middle')
                .attr('fill', '#e5e7eb')
                .attr('font-size', '12px')
                .text(label);
        };
        
        // Draw all neurons
        drawNeuron(inputLayer[0], sample.input[0], `I1`, '#6366f1');
        drawNeuron(inputLayer[1], sample.input[1], `I2`, '#6366f1');
        drawNeuron(hiddenLayer[0], forward.hiddenOutput, `H1`, '#059669');
        drawNeuron(outputLayer[0], forward.output, `O1`, '#dc2626');
        
        // Layer labels
        svg.append('text').attr('x', 80).attr('y', 50).attr('text-anchor', 'middle').attr('fill', '#e5e7eb').attr('font-size', '14px').text('Input');
        svg.append('text').attr('x', 200).attr('y', 50).attr('text-anchor', 'middle').attr('fill', '#e5e7eb').attr('font-size', '14px').text('Hidden');
        svg.append('text').attr('x', 320).attr('y', 50).attr('text-anchor', 'middle').attr('fill', '#e5e7eb').attr('font-size', '14px').text('Output');
        
    }, [network, currentSample]);

    // Visualize loss chart
    useEffect(() => {
        if (lossHistory.length === 0) return;
        
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();
        
        const width = 300;
        const height = 150;
        const margin = { top: 10, right: 10, bottom: 30, left: 40 };
        
        svg.attr("width", width).attr("height", height);
        
        const xScale = d3.scaleLinear()
            .domain([0, lossHistory.length - 1])
            .range([margin.left, width - margin.right]);
        
        const yScale = d3.scaleLinear()
            .domain(d3.extent(lossHistory))
            .range([height - margin.bottom, margin.top]);
        
        const line = d3.line()
            .x((d, i) => xScale(i))
            .y(d => yScale(d))
            .curve(d3.curveMonotoneX);
        
        // Draw line
        svg.append("path")
            .datum(lossHistory)
            .attr("fill", "none")
            .attr("stroke", "#3b82f6")
            .attr("stroke-width", 2)
            .attr("d", line);
        
        // Draw axes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .attr("color", "#9ca3af");
        
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5))
            .attr("color", "#9ca3af");
        
        // Labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 5)
            .attr("text-anchor", "middle")
            .attr("fill", "#9ca3af")
            .attr("font-size", "10px")
            .text("Training Steps");
        
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("fill", "#9ca3af")
            .attr("font-size", "10px")
            .text("Loss");
    }, [lossHistory]);

    const toggleTraining = () => {
        setIsTraining(!isTraining);
    };

    const resetTraining = () => {
        setIsTraining(false);
        setEpoch(0);
        setCurrentSample(0);
        setLossHistory([]);
        setNetwork({
            weights: [
                [Math.random() * 2 - 1, Math.random() * 2 - 1],
                [Math.random() * 2 - 1, Math.random() * 2 - 1]
            ],
            biases: [Math.random() * 2 - 1, Math.random() * 2 - 1]
        });
    };

    const currentSampleData = trainingData[currentSample];
    const forward = forwardPass(currentSampleData.input, network.weights, network.biases);

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6">
            <h3 className="text-xl font-bold text-white mb-4">Neural Network Training Animation</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Network Architecture</h4>
                    <svg ref={svgRef} className="border border-gray-700 rounded-lg bg-gray-800" />
                    
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={toggleTraining}
                            className={`px-4 py-2 rounded font-semibold ${
                                isTraining ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                        >
                            {isTraining ? 'Pause' : 'Start'} Training
                        </button>
                        <button
                            onClick={resetTraining}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                        >
                            Reset
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Training Progress</h4>
                    <svg ref={chartRef} className="border border-gray-700 rounded-lg bg-gray-800" />
                    
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="bg-gray-800 p-3 rounded">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-300">Epoch:</span>
                                    <span className="text-white font-mono ml-2">{epoch}</span>
                                </div>
                                <div>
                                    <span className="text-gray-300">Sample:</span>
                                    <span className="text-white font-mono ml-2">{currentSample + 1}/4</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 p-3 rounded">
                            <div className="text-gray-300 mb-2">Current Training Sample:</div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <span className="text-blue-300">Input:</span><br/>
                                    <span className="font-mono">[{currentSampleData.input.join(', ')}]</span>
                                </div>
                                <div>
                                    <span className="text-green-300">Target:</span><br/>
                                    <span className="font-mono">{currentSampleData.target}</span>
                                </div>
                                <div>
                                    <span className="text-red-300">Output:</span><br/>
                                    <span className="font-mono">{forward.output.toFixed(3)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 p-3 rounded">
                            <div className="text-gray-300 mb-2">Current Loss:</div>
                            <div className="font-mono text-lg text-yellow-300">
                                {lossHistory.length > 0 ? lossHistory[lossHistory.length - 1].toFixed(4) : '0.0000'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-400">
                <h5 className="font-semibold text-gray-300 mb-2">About This Demo:</h5>
                <p>
                    This visualization shows a neural network learning the XOR function through backpropagation. 
                    Watch how the weights change over time and the loss decreases as the network learns the pattern.
                    The neuron opacity represents activation levels, and connection thickness shows weight magnitude.
                </p>
            </div>
        </div>
    );
};

export default NeuralNetworkTraining;