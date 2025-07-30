import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

// Interactive Neural Network Visualization Component
export const InteractiveNeuralNetwork = () => {
    const svgRef = useRef();
    const [weights, setWeights] = useState([0.5, -0.3, 0.8, 0.1]);
    const [activationFunction, setActivationFunction] = useState('sigmoid');
    const [inputs, setInputs] = useState([0.5, 0.7]);
    const [showCalculation, setShowCalculation] = useState(false);

    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
    const relu = (x) => Math.max(0, x);
    const tanh = (x) => Math.tanh(x);

    const activationFunctions = {
        sigmoid,
        relu,
        tanh
    };

    const calculateOutput = useCallback(() => {
        const hiddenSum = inputs[0] * weights[0] + inputs[1] * weights[1];
        const hiddenOutput = activationFunctions[activationFunction](hiddenSum);
        const outputSum = hiddenOutput * weights[2] + weights[3]; // bias
        const finalOutput = activationFunctions[activationFunction](outputSum);
        return { hiddenSum, hiddenOutput, outputSum, finalOutput };
    }, [inputs, weights, activationFunction]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 300;
        svg.attr("width", width).attr("height", height);

        // Define positions
        const inputLayer = [{ x: 100, y: 80 }, { x: 100, y: 220 }];
        const hiddenLayer = [{ x: 300, y: 150 }];
        const outputLayer = [{ x: 500, y: 150 }];

        const result = calculateOutput();

        // Draw connections with animated weights
        const connections = [
            { from: inputLayer[0], to: hiddenLayer[0], weight: weights[0], value: inputs[0] * weights[0] },
            { from: inputLayer[1], to: hiddenLayer[0], weight: weights[1], value: inputs[1] * weights[1] },
            { from: hiddenLayer[0], to: outputLayer[0], weight: weights[2], value: result.hiddenOutput * weights[2] }
        ];

        connections.forEach((conn, i) => {
            const line = svg.append('line')
                .attr('x1', conn.from.x)
                .attr('y1', conn.from.y)
                .attr('x2', conn.to.x)
                .attr('y2', conn.to.y)
                .attr('stroke', conn.weight > 0 ? '#4ade80' : '#f87171')
                .attr('stroke-width', Math.abs(conn.weight) * 3 + 1)
                .attr('opacity', 0.7);

            // Weight labels
            const midX = (conn.from.x + conn.to.x) / 2;
            const midY = (conn.from.y + conn.to.y) / 2;
            svg.append('text')
                .attr('x', midX)
                .attr('y', midY - 10)
                .attr('text-anchor', 'middle')
                .attr('fill', '#e5e7eb')
                .attr('font-size', '12px')
                .text(`w=${conn.weight.toFixed(2)}`);
        });

        // Draw neurons
        const drawNeuron = (pos, value, label, color = '#3b82f6') => {
            const circle = svg.append('circle')
                .attr('cx', pos.x)
                .attr('cy', pos.y)
                .attr('r', 25)
                .attr('fill', color)
                .attr('stroke', '#e5e7eb')
                .attr('stroke-width', 2);

            svg.append('text')
                .attr('x', pos.x)
                .attr('y', pos.y + 5)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .text(value.toFixed(2));

            svg.append('text')
                .attr('x', pos.x)
                .attr('y', pos.y + 45)
                .attr('text-anchor', 'middle')
                .attr('fill', '#e5e7eb')
                .attr('font-size', '14px')
                .text(label);
        };

        // Input neurons
        drawNeuron(inputLayer[0], inputs[0], 'Input 1', '#6366f1');
        drawNeuron(inputLayer[1], inputs[1], 'Input 2', '#6366f1');

        // Hidden neuron
        drawNeuron(hiddenLayer[0], result.hiddenOutput, 'Hidden', '#8b5cf6');

        // Output neuron
        drawNeuron(outputLayer[0], result.finalOutput, 'Output', '#10b981');

    }, [inputs, weights, activationFunction, calculateOutput]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Interactive Neural Network</h3>
            
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <h4 className="text-lg font-semibold mb-2 text-white">Inputs</h4>
                    <div className="space-y-2">
                        <div>
                            <label className="text-sm text-gray-300">Input 1: {inputs[0]}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={inputs[0]}
                                onChange={(e) => setInputs([parseFloat(e.target.value), inputs[1]])}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">Input 2: {inputs[1]}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={inputs[1]}
                                onChange={(e) => setInputs([inputs[0], parseFloat(e.target.value)])}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-2 text-white">Weights</h4>
                    <div className="space-y-2">
                        {weights.map((weight, i) => (
                            <div key={i}>
                                <label className="text-sm text-gray-300">
                                    Weight {i + 1}: {weight.toFixed(2)}
                                </label>
                                <input
                                    type="range"
                                    min="-1"
                                    max="1"
                                    step="0.1"
                                    value={weight}
                                    onChange={(e) => {
                                        const newWeights = [...weights];
                                        newWeights[i] = parseFloat(e.target.value);
                                        setWeights(newWeights);
                                    }}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label className="text-sm text-gray-300 mr-2">Activation Function:</label>
                <select
                    value={activationFunction}
                    onChange={(e) => setActivationFunction(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                >
                    <option value="sigmoid">Sigmoid</option>
                    <option value="relu">ReLU</option>
                    <option value="tanh">Tanh</option>
                </select>
            </div>

            {/* Visualization */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <svg ref={svgRef}></svg>
            </div>

            {/* Show calculation button */}
            <button
                onClick={() => setShowCalculation(!showCalculation)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
            >
                {showCalculation ? 'Hide' : 'Show'} Calculations
            </button>

            {/* Calculations */}
            {showCalculation && (
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-white">Step-by-step Calculation:</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p>1. Hidden neuron input: {inputs[0]} × {weights[0].toFixed(2)} + {inputs[1]} × {weights[1].toFixed(2)} = {calculateOutput().hiddenSum.toFixed(3)}</p>
                        <p>2. Hidden neuron output: {activationFunction}({calculateOutput().hiddenSum.toFixed(3)}) = {calculateOutput().hiddenOutput.toFixed(3)}</p>
                        <p>3. Output neuron input: {calculateOutput().hiddenOutput.toFixed(3)} × {weights[2].toFixed(2)} + {weights[3].toFixed(2)} = {calculateOutput().outputSum.toFixed(3)}</p>
                        <p>4. Final output: {activationFunction}({calculateOutput().outputSum.toFixed(3)}) = <strong>{calculateOutput().finalOutput.toFixed(3)}</strong></p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Interactive XOR Problem Visualization
export const InteractiveXOR = () => {
    const svgRef = useRef();
    const [showHiddenLayer, setShowHiddenLayer] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 300;
        svg.attr("width", width).attr("height", height);

        // XOR data points
        const xorData = [
            { x: 50, y: 50, inputs: [0, 0], output: 0, label: '(0,0) → 0' },
            { x: 350, y: 50, inputs: [1, 0], output: 1, label: '(1,0) → 1' },
            { x: 50, y: 250, inputs: [0, 1], output: 1, label: '(0,1) → 1' },
            { x: 350, y: 250, inputs: [1, 1], output: 0, label: '(1,1) → 0' }
        ];

        // Background grid
        for (let i = 0; i <= 10; i++) {
            svg.append('line')
                .attr('x1', i * 40)
                .attr('y1', 0)
                .attr('x2', i * 40)
                .attr('y2', height)
                .attr('stroke', '#374151')
                .attr('stroke-width', 0.5);
            
            svg.append('line')
                .attr('x1', 0)
                .attr('y1', i * 30)
                .attr('x2', width)
                .attr('y2', i * 30)
                .attr('stroke', '#374151')
                .attr('stroke-width', 0.5);
        }

        // Try to draw linear separator (impossible line)
        if (!showHiddenLayer) {
            svg.append('line')
                .attr('x1', 0)
                .attr('y1', 150)
                .attr('x2', width)
                .attr('y2', 150)
                .attr('stroke', '#ef4444')
                .attr('stroke-width', 3)
                .attr('stroke-dasharray', '10,5')
                .attr('opacity', 0.7);

            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 140)
                .attr('text-anchor', 'middle')
                .attr('fill', '#ef4444')
                .attr('font-size', '14px')
                .text('❌ Impossible to separate linearly');
        }

        // XOR points
        xorData.forEach((point, i) => {
            const circle = svg.append('circle')
                .attr('cx', point.x)
                .attr('cy', point.y)
                .attr('r', 20)
                .attr('fill', point.output === 1 ? '#22c55e' : '#3b82f6')
                .attr('stroke', selectedPoint === i ? '#fbbf24' : '#e5e7eb')
                .attr('stroke-width', selectedPoint === i ? 3 : 2)
                .style('cursor', 'pointer');

            circle.on('click', () => {
                setSelectedPoint(selectedPoint === i ? null : i);
            });

            svg.append('text')
                .attr('x', point.x)
                .attr('y', point.y + 5)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .text(point.output);

            svg.append('text')
                .attr('x', point.x)
                .attr('y', point.y + 35)
                .attr('text-anchor', 'middle')
                .attr('fill', '#e5e7eb')
                .attr('font-size', '10px')
                .text(point.label);
        });

        // Hidden layer transformation visualization
        if (showHiddenLayer) {
            // Show successful separation with curved boundary
            const path = d3.path();
            path.moveTo(100, 100);
            path.quadraticCurveTo(200, 50, 300, 100);
            path.quadraticCurveTo(300, 200, 200, 250);
            path.quadraticCurveTo(100, 200, 100, 100);

            svg.append('path')
                .attr('d', path.toString())
                .attr('fill', 'none')
                .attr('stroke', '#22c55e')
                .attr('stroke-width', 3)
                .attr('stroke-dasharray', '5,5');

            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('fill', '#22c55e')
                .attr('font-size', '14px')
                .text('✅ Non-linear boundary separates classes');
        }

    }, [showHiddenLayer, selectedPoint]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Interactive XOR Problem</h3>
            
            <div className="mb-4">
                <button
                    onClick={() => setShowHiddenLayer(!showHiddenLayer)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    {showHiddenLayer ? 'Show Linear Attempt' : 'Show Hidden Layer Solution'}
                </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <svg ref={svgRef}></svg>
            </div>

            <div className="text-sm text-gray-300">
                <h4 className="font-semibold mb-2 text-white">XOR Truth Table:</h4>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="font-semibold">Input A</div>
                    <div className="font-semibold">Input B</div>
                    <div className="font-semibold">XOR Output</div>
                    <div className="font-semibold">Color</div>
                    <div>0</div><div>0</div><div>0</div><div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <div>0</div><div>1</div><div>1</div><div className="w-4 h-4 bg-green-500 rounded"></div>
                    <div>1</div><div>0</div><div>1</div><div className="w-4 h-4 bg-green-500 rounded"></div>
                    <div>1</div><div>1</div><div>0</div><div className="w-4 h-4 bg-blue-500 rounded"></div>
                </div>
                
                {!showHiddenLayer && (
                    <p className="text-red-400">
                        ❌ No single straight line can separate the green points from the blue points.
                        This is why XOR requires multiple layers!
                    </p>
                )}
                
                {showHiddenLayer && (
                    <p className="text-green-400">
                        ✅ A hidden layer creates a non-linear transformation that makes the data separable!
                    </p>
                )}
            </div>
        </div>
    );
};

// Swarm Intelligence Emergence Simulation
export const SwarmIntelligenceDemo = () => {
    const canvasRef = useRef();
    const animationRef = useRef();
    const [isRunning, setIsRunning] = useState(false);
    const [boids, setBoids] = useState([]);
    const [rules, setRules] = useState({
        separation: 1.5,
        alignment: 1.0,
        cohesion: 1.0,
        speed: 0.02
    });

    const initializeBoids = useCallback(() => {
        const newBoids = [];
        for (let i = 0; i < 50; i++) {
            newBoids.push({
                x: Math.random() * 600,
                y: Math.random() * 400,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                id: i
            });
        }
        setBoids(newBoids);
    }, []);

    const updateBoids = useCallback((currentBoids) => {
        const newBoids = currentBoids.map((boid) => {
            let separationX = 0, separationY = 0;
            let alignmentX = 0, alignmentY = 0;
            let cohesionX = 0, cohesionY = 0;
            let neighbors = 0;

            // Find neighbors within perception radius
            currentBoids.forEach((other) => {
                if (other.id !== boid.id) {
                    const dx = other.x - boid.x;
                    const dy = other.y - boid.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 50) { // Perception radius
                        // Separation - steer away from nearby boids
                        if (distance < 25) {
                            separationX -= dx / distance;
                            separationY -= dy / distance;
                        }

                        // Alignment - match velocity of neighbors
                        alignmentX += other.vx;
                        alignmentY += other.vy;

                        // Cohesion - steer towards center of neighbors
                        cohesionX += other.x;
                        cohesionY += other.y;

                        neighbors++;
                    }
                }
            });

            let newVx = boid.vx;
            let newVy = boid.vy;

            if (neighbors > 0) {
                // Apply separation
                newVx += separationX * rules.separation * 0.1;
                newVy += separationY * rules.separation * 0.1;

                // Apply alignment
                alignmentX /= neighbors;
                alignmentY /= neighbors;
                newVx += (alignmentX - boid.vx) * rules.alignment * 0.1;
                newVy += (alignmentY - boid.vy) * rules.alignment * 0.1;

                // Apply cohesion
                cohesionX /= neighbors;
                cohesionY /= neighbors;
                newVx += (cohesionX - boid.x) * rules.cohesion * 0.001;
                newVy += (cohesionY - boid.y) * rules.cohesion * 0.001;
            }

            // Limit speed
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (speed > 2) {
                newVx = (newVx / speed) * 2;
                newVy = (newVy / speed) * 2;
            }

            // Update position
            let newX = boid.x + newVx * rules.speed * 100;
            let newY = boid.y + newVy * rules.speed * 100;

            // Wrap around edges
            if (newX < 0) newX = 600;
            if (newX > 600) newX = 0;
            if (newY < 0) newY = 400;
            if (newY > 400) newY = 0;

            return {
                ...boid,
                x: newX,
                y: newY,
                vx: newVx,
                vy: newVy
            };
        });

        return newBoids;
    }, [rules]);

    const animate = useCallback(() => {
        if (!isRunning) return;

        setBoids(currentBoids => updateBoids(currentBoids));
        animationRef.current = requestAnimationFrame(animate);
    }, [isRunning, updateBoids]);

    useEffect(() => {
        if (isRunning) {
            animate();
        } else {
            cancelAnimationFrame(animationRef.current);
        }
        return () => cancelAnimationFrame(animationRef.current);
    }, [isRunning, animate]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, 600, 400);

        // Draw boids
        boids.forEach((boid) => {
            ctx.save();
            ctx.translate(boid.x, boid.y);
            
            // Calculate rotation based on velocity
            const angle = Math.atan2(boid.vy, boid.vx);
            ctx.rotate(angle);

            // Draw boid as triangle
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.moveTo(8, 0);
            ctx.lineTo(-4, -3);
            ctx.lineTo(-4, 3);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });
    }, [boids]);

    useEffect(() => {
        initializeBoids();
    }, [initializeBoids]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Swarm Intelligence: Boid Flocking</h3>
            
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded font-semibold ${
                        isRunning 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                    {isRunning ? 'Stop' : 'Start'} Simulation
                </button>
                
                <button
                    onClick={initializeBoids}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                    Reset Boids
                </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={400}
                    className="border border-gray-600"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2 text-white">Flocking Rules</h4>
                    <div className="space-y-2">
                        <div>
                            <label className="text-sm text-gray-300">
                                Separation: {rules.separation.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="3"
                                step="0.1"
                                value={rules.separation}
                                onChange={(e) => setRules({...rules, separation: parseFloat(e.target.value)})}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">
                                Alignment: {rules.alignment.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="3"
                                step="0.1"
                                value={rules.alignment}
                                onChange={(e) => setRules({...rules, alignment: parseFloat(e.target.value)})}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-semibold mb-2 text-white">Simulation</h4>
                    <div className="space-y-2">
                        <div>
                            <label className="text-sm text-gray-300">
                                Cohesion: {rules.cohesion.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="3"
                                step="0.1"
                                value={rules.cohesion}
                                onChange={(e) => setRules({...rules, cohesion: parseFloat(e.target.value)})}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">
                                Speed: {rules.speed.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.01"
                                max="0.05"
                                step="0.005"
                                value={rules.speed}
                                onChange={(e) => setRules({...rules, speed: parseFloat(e.target.value)})}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-300">
                <h4 className="font-semibold mb-2 text-white">Simple Rules Create Complex Behavior:</h4>
                <ul className="space-y-1">
                    <li><strong>Separation:</strong> Avoid crowding neighbors</li>
                    <li><strong>Alignment:</strong> Match the average direction of neighbors</li>
                    <li><strong>Cohesion:</strong> Stay close to the group center</li>
                </ul>
                <p className="mt-2 text-blue-300">
                    Watch how these simple rules create beautiful, coordinated flocking behavior!
                </p>
            </div>
        </div>
    );
};

// PSO Visualization Component
export const PSOVisualization = () => {
    const svgRef = useRef();
    const animationRef = useRef();
    const [isRunning, setIsRunning] = useState(false);
    const [particles, setParticles] = useState([]);
    const [globalBest, setGlobalBest] = useState({ x: 300, y: 200, fitness: -Infinity });
    const [iteration, setIteration] = useState(0);

    // Fitness function (minimize distance to center with some noise)
    const fitnessFunction = (x, y) => {
        const centerX = 300;
        const centerY = 200;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        // Add some noise to make it more interesting
        const noise = 50 * Math.sin(x * 0.02) * Math.cos(y * 0.02);
        return -(distance + noise); // Negative because we want to minimize
    };

    const initializeParticles = useCallback(() => {
        const newParticles = [];
        let bestFitness = -Infinity;
        let bestPosition = { x: 300, y: 200 };

        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 600;
            const y = Math.random() * 400;
            const fitness = fitnessFunction(x, y);
            
            if (fitness > bestFitness) {
                bestFitness = fitness;
                bestPosition = { x, y };
            }

            newParticles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                pBestX: x,
                pBestY: y,
                pBestFitness: fitness,
                fitness,
                id: i
            });
        }

        setParticles(newParticles);
        setGlobalBest({ ...bestPosition, fitness: bestFitness });
        setIteration(0);
    }, []);

    const updateParticles = useCallback(() => {
        setParticles(currentParticles => {
            const w = 0.7; // Inertia weight
            const c1 = 1.5; // Cognitive coefficient
            const c2 = 1.5; // Social coefficient

            let newGlobalBest = globalBest;

            const updatedParticles = currentParticles.map(particle => {
                const r1 = Math.random();
                const r2 = Math.random();

                // Update velocity
                const newVx = w * particle.vx + 
                    c1 * r1 * (particle.pBestX - particle.x) + 
                    c2 * r2 * (globalBest.x - particle.x);
                
                const newVy = w * particle.vy + 
                    c1 * r1 * (particle.pBestY - particle.y) + 
                    c2 * r2 * (globalBest.y - particle.y);

                // Update position
                let newX = particle.x + newVx;
                let newY = particle.y + newVy;

                // Boundary conditions
                newX = Math.max(10, Math.min(590, newX));
                newY = Math.max(10, Math.min(390, newY));

                // Calculate fitness
                const fitness = fitnessFunction(newX, newY);

                // Update personal best
                let pBestX = particle.pBestX;
                let pBestY = particle.pBestY;
                let pBestFitness = particle.pBestFitness;

                if (fitness > pBestFitness) {
                    pBestX = newX;
                    pBestY = newY;
                    pBestFitness = fitness;
                }

                // Update global best
                if (fitness > newGlobalBest.fitness) {
                    newGlobalBest = { x: newX, y: newY, fitness };
                }

                return {
                    ...particle,
                    x: newX,
                    y: newY,
                    vx: newVx,
                    vy: newVy,
                    pBestX,
                    pBestY,
                    pBestFitness,
                    fitness
                };
            });

            setGlobalBest(newGlobalBest);
            return updatedParticles;
        });

        setIteration(prev => prev + 1);
    }, [globalBest]);

    const animate = useCallback(() => {
        if (!isRunning) return;

        updateParticles();
        animationRef.current = setTimeout(animate, 100); // Slower animation
    }, [isRunning, updateParticles]);

    useEffect(() => {
        if (isRunning) {
            animate();
        } else {
            clearTimeout(animationRef.current);
        }
        return () => clearTimeout(animationRef.current);
    }, [isRunning, animate]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;

        // Create fitness landscape background
        const defs = svg.append('defs');
        const gradient = defs.append('radialGradient')
            .attr('id', 'fitnessGradient')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '50%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#22c55e')
            .attr('stop-opacity', 0.3);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#ef4444')
            .attr('stop-opacity', 0.1);

        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'url(#fitnessGradient)');

        // Draw global best
        svg.append('circle')
            .attr('cx', globalBest.x)
            .attr('cy', globalBest.y)
            .attr('r', 15)
            .attr('fill', '#fbbf24')
            .attr('stroke', '#f59e0b')
            .attr('stroke-width', 3);

        svg.append('text')
            .attr('x', globalBest.x)
            .attr('y', globalBest.y - 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fbbf24')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text('Global Best');

        // Draw particles
        particles.forEach((particle, i) => {
            // Draw personal best (faded)
            svg.append('circle')
                .attr('cx', particle.pBestX)
                .attr('cy', particle.pBestY)
                .attr('r', 3)
                .attr('fill', '#6b7280')
                .attr('opacity', 0.5);

            // Draw particle
            const circle = svg.append('circle')
                .attr('cx', particle.x)
                .attr('cy', particle.y)
                .attr('r', 5)
                .attr('fill', '#3b82f6')
                .attr('stroke', '#1d4ed8')
                .attr('stroke-width', 1);

            // Draw velocity vector
            svg.append('line')
                .attr('x1', particle.x)
                .attr('y1', particle.y)
                .attr('x2', particle.x + particle.vx * 5)
                .attr('y2', particle.y + particle.vy * 5)
                .attr('stroke', '#8b5cf6')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrowhead)');
        });

        // Arrow marker for velocity vectors
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('markerWidth', 10)
            .attr('markerHeight', 7)
            .attr('refX', 9)
            .attr('refY', 3.5)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 10 3.5, 0 7')
            .attr('fill', '#8b5cf6');

    }, [particles, globalBest]);

    useEffect(() => {
        initializeParticles();
    }, [initializeParticles]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Particle Swarm Optimization</h3>
            
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded font-semibold ${
                        isRunning 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                    {isRunning ? 'Stop' : 'Start'} Optimization
                </button>
                
                <button
                    onClick={initializeParticles}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                    Reset Swarm
                </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <svg ref={svgRef} width={600} height={400}></svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-gray-300">
                    <h4 className="font-semibold mb-2 text-white">Current Status:</h4>
                    <p>Iteration: <span className="text-blue-400">{iteration}</span></p>
                    <p>Global Best Fitness: <span className="text-yellow-400">{globalBest.fitness.toFixed(2)}</span></p>
                    <p>Position: <span className="text-yellow-400">({globalBest.x.toFixed(0)}, {globalBest.y.toFixed(0)})</span></p>
                </div>
                
                <div className="text-sm text-gray-300">
                    <h4 className="font-semibold mb-2 text-white">Legend:</h4>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Particles</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Global Best</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <span>Personal Best</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-0.5 bg-purple-500"></div>
                            <span>Velocity</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-300">
                <p className="text-green-300">
                    🎯 Watch how particles explore the search space and converge toward the optimal solution!
                </p>
            </div>
        </div>
    );
};

// Activation Function Demo Component
export const ActivationFunctionDemo = () => {
    const svgRef = useRef();
    const [selectedFunction, setSelectedFunction] = useState('sigmoid');
    const [parameters, setParameters] = useState({
        leakyAlpha: 0.01,
        zoom: 1.0,
        showDerivative: false
    });

    const activationFunctions = {
        sigmoid: {
            name: 'Sigmoid',
            fn: (x) => 1 / (1 + Math.exp(-x)),
            derivative: (x) => {
                const s = 1 / (1 + Math.exp(-x));
                return s * (1 - s);
            },
            formula: 'σ(x) = 1 / (1 + e^(-x))',
            range: 'Output: (0, 1)',
            properties: ['Smooth gradient', 'Can saturate', 'S-shaped curve'],
            color: '#3b82f6'
        },
        tanh: {
            name: 'Hyperbolic Tangent',
            fn: (x) => Math.tanh(x),
            derivative: (x) => 1 - Math.pow(Math.tanh(x), 2),
            formula: 'tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))',
            range: 'Output: (-1, 1)',
            properties: ['Zero-centered', 'Smooth gradient', 'S-shaped curve'],
            color: '#10b981'
        },
        relu: {
            name: 'ReLU (Rectified Linear Unit)',
            fn: (x) => Math.max(0, x),
            derivative: (x) => x > 0 ? 1 : 0,
            formula: 'ReLU(x) = max(0, x)',
            range: 'Output: [0, +∞)',
            properties: ['Simple computation', 'No saturation for x > 0', 'Dead neurons for x < 0'],
            color: '#f59e0b'
        },
        leakyRelu: {
            name: 'Leaky ReLU',
            fn: (x) => x > 0 ? x : parameters.leakyAlpha * x,
            derivative: (x) => x > 0 ? 1 : parameters.leakyAlpha,
            formula: `Leaky ReLU(x) = max(${parameters.leakyAlpha}x, x)`,
            range: 'Output: (-∞, +∞)',
            properties: ['Prevents dying neurons', 'Small gradient for x < 0', 'Linear for x > 0'],
            color: '#8b5cf6'
        }
    };

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        svg.attr("width", width).attr("height", height);

        // Create scales
        const xRange = 6 * parameters.zoom;
        const xScale = d3.scaleLinear()
            .domain([-xRange, xRange])
            .range([0, plotWidth]);

        const currentFunc = activationFunctions[selectedFunction];
        
        // Calculate y domain based on function
        let yDomain;
        if (selectedFunction === 'sigmoid') {
            yDomain = [-0.1, 1.1];
        } else if (selectedFunction === 'tanh') {
            yDomain = [-1.2, 1.2];
        } else {
            yDomain = [-2 * parameters.zoom, 4 * parameters.zoom];
        }

        const yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([plotHeight, 0]);

        // Create container group
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add grid
        const xTicks = xScale.ticks(10);
        const yTicks = yScale.ticks(8);

        // Vertical grid lines
        g.selectAll('.grid-x')
            .data(xTicks)
            .enter()
            .append('line')
            .attr('class', 'grid-x')
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d))
            .attr('y1', 0)
            .attr('y2', plotHeight)
            .attr('stroke', '#374151')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.5);

        // Horizontal grid lines
        g.selectAll('.grid-y')
            .data(yTicks)
            .enter()
            .append('line')
            .attr('class', 'grid-y')
            .attr('x1', 0)
            .attr('x2', plotWidth)
            .attr('y1', d => yScale(d))
            .attr('y2', d => yScale(d))
            .attr('stroke', '#374151')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.5);

        // Add axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('.1f'));
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.1f'));

        g.append('g')
            .attr('transform', `translate(0,${plotHeight})`)
            .call(xAxis)
            .attr('color', '#e5e7eb');

        g.append('g')
            .call(yAxis)
            .attr('color', '#e5e7eb');

        // Add axis labels
        g.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', plotHeight + 35)
            .attr('text-anchor', 'middle')
            .attr('fill', '#e5e7eb')
            .attr('font-size', '14px')
            .text('Input (x)');

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -plotHeight / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .attr('fill', '#e5e7eb')
            .attr('font-size', '14px')
            .text('Output');

        // Generate data points for the function
        const dataPoints = [];
        const step = (xRange * 2) / 200;
        for (let x = -xRange; x <= xRange; x += step) {
            const y = currentFunc.fn(x);
            if (!isNaN(y) && isFinite(y)) {
                dataPoints.push({ x, y });
            }
        }

        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveMonotoneX);

        // Draw main function
        g.append('path')
            .datum(dataPoints)
            .attr('fill', 'none')
            .attr('stroke', currentFunc.color)
            .attr('stroke-width', 3)
            .attr('d', line);

        // Draw derivative if enabled
        if (parameters.showDerivative) {
            const derivativePoints = [];
            for (let x = -xRange; x <= xRange; x += step) {
                const y = currentFunc.derivative(x);
                if (!isNaN(y) && isFinite(y)) {
                    derivativePoints.push({ x, y });
                }
            }

            g.append('path')
                .datum(derivativePoints)
                .attr('fill', 'none')
                .attr('stroke', '#ef4444')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .attr('d', line);

            // Derivative legend
            g.append('text')
                .attr('x', plotWidth - 10)
                .attr('y', 30)
                .attr('text-anchor', 'end')
                .attr('fill', '#ef4444')
                .attr('font-size', '12px')
                .text("f'(x) (derivative)");
        }

        // Add zero lines
        if (yScale.domain()[0] <= 0 && yScale.domain()[1] >= 0) {
            g.append('line')
                .attr('x1', 0)
                .attr('x2', plotWidth)
                .attr('y1', yScale(0))
                .attr('y2', yScale(0))
                .attr('stroke', '#6b7280')
                .attr('stroke-width', 1);
        }

        if (xScale.domain()[0] <= 0 && xScale.domain()[1] >= 0) {
            g.append('line')
                .attr('x1', xScale(0))
                .attr('x2', xScale(0))
                .attr('y1', 0)
                .attr('y2', plotHeight)
                .attr('stroke', '#6b7280')
                .attr('stroke-width', 1);
        }

        // Add function title
        g.append('text')
            .attr('x', 10)
            .attr('y', 20)
            .attr('fill', currentFunc.color)
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text(currentFunc.name);

    }, [selectedFunction, parameters]);

    const currentFunc = activationFunctions[selectedFunction];

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Activation Functions Visualization</h3>
            
            {/* Function selector and controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Activation Function:</label>
                    <select
                        value={selectedFunction}
                        onChange={(e) => setSelectedFunction(e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-1 rounded"
                    >
                        <option value="sigmoid">Sigmoid</option>
                        <option value="tanh">Tanh</option>
                        <option value="relu">ReLU</option>
                        <option value="leakyRelu">Leaky ReLU</option>
                    </select>
                </div>

                {selectedFunction === 'leakyRelu' && (
                    <div>
                        <label className="text-sm text-gray-300 block mb-1">
                            Alpha: {parameters.leakyAlpha}
                        </label>
                        <input
                            type="range"
                            min="0.01"
                            max="0.3"
                            step="0.01"
                            value={parameters.leakyAlpha}
                            onChange={(e) => setParameters({...parameters, leakyAlpha: parseFloat(e.target.value)})}
                            className="w-full"
                        />
                    </div>
                )}

                <div>
                    <label className="text-sm text-gray-300 block mb-1">
                        Zoom: {parameters.zoom.toFixed(1)}x
                    </label>
                    <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={parameters.zoom}
                        onChange={(e) => setParameters({...parameters, zoom: parseFloat(e.target.value)})}
                        className="w-full"
                    />
                </div>

                <div className="flex items-center">
                    <label className="text-sm text-gray-300 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={parameters.showDerivative}
                            onChange={(e) => setParameters({...parameters, showDerivative: e.target.checked})}
                            className="rounded"
                        />
                        Show Derivative
                    </label>
                </div>
            </div>

            {/* Visualization */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <svg ref={svgRef}></svg>
            </div>

            {/* Function information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                        <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: currentFunc.color }}
                        ></div>
                        {currentFunc.name}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p><strong>Formula:</strong> <code className="text-blue-300">{currentFunc.formula}</code></p>
                        <p><strong>Range:</strong> <span className="text-green-300">{currentFunc.range}</span></p>
                    </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-white">Key Properties:</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                        {currentFunc.properties.map((prop, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                {prop}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Common use cases */}
            <div className="mt-4 bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-white">When to Use:</h4>
                <div className="text-sm text-gray-300">
                    {selectedFunction === 'sigmoid' && (
                        <p><strong>Sigmoid:</strong> Binary classification output layer, older networks (now mostly replaced by ReLU in hidden layers)</p>
                    )}
                    {selectedFunction === 'tanh' && (
                        <p><strong>Tanh:</strong> Hidden layers in smaller networks, RNNs, when you want zero-centered outputs</p>
                    )}
                    {selectedFunction === 'relu' && (
                        <p><strong>ReLU:</strong> Most common choice for hidden layers in deep networks, CNNs, simple and effective</p>
                    )}
                    {selectedFunction === 'leakyRelu' && (
                        <p><strong>Leaky ReLU:</strong> When ReLU causes too many dead neurons, helps with gradient flow</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Network Topology Demo Component
export const NetworkTopologyDemo = () => {
    const svgRef = useRef();
    const [topology, setTopology] = useState([2, 3, 1]); // Default: 2-3-1 network
    const [selectedPreset, setSelectedPreset] = useState('xor');
    const [showConnections, setShowConnections] = useState(true);
    const [showWeights, setShowWeights] = useState(false);
    const [animateData, setAnimateData] = useState(false);

    // Common network topologies
    const presets = {
        xor: { layers: [2, 3, 1], name: "XOR Problem (2-3-1)", description: "Classic non-linear problem" },
        simple: { layers: [3, 2], name: "Simple (3-2)", description: "Basic neural network" },
        deep: { layers: [4, 6, 4, 2], name: "Deep (4-6-4-2)", description: "Multi-hidden layer network" },
        wide: { layers: [3, 8, 8, 1], name: "Wide (3-8-8-1)", description: "Wide hidden layers" },
        autoencoder: { layers: [5, 3, 2, 3, 5], name: "Autoencoder (5-3-2-3-5)", description: "Encoder-decoder architecture" },
        custom: { layers: topology, name: "Custom", description: "User-defined topology" }
    };

    // Calculate network statistics
    const calculateStats = useCallback(() => {
        let totalNeurons = topology.reduce((sum, layer) => sum + layer, 0);
        let totalConnections = 0;
        let totalParameters = 0;

        for (let i = 0; i < topology.length - 1; i++) {
            const connections = topology[i] * topology[i + 1];
            totalConnections += connections;
            totalParameters += connections + topology[i + 1]; // weights + biases
        }

        return { totalNeurons, totalConnections, totalParameters };
    }, [topology]);

    // Generate random weights for visualization
    const generateWeights = useCallback(() => {
        const weights = [];
        for (let i = 0; i < topology.length - 1; i++) {
            const layerWeights = [];
            for (let j = 0; j < topology[i] * topology[i + 1]; j++) {
                layerWeights.push((Math.random() - 0.5) * 2); // Range: -1 to 1
            }
            weights.push(layerWeights);
        }
        return weights;
    }, [topology]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 800;
        const height = 400;
        svg.attr("width", width).attr("height", height);

        // Calculate layer positions
        const layerSpacing = width / (topology.length + 1);
        const layers = topology.map((neurons, layerIndex) => {
            const x = layerSpacing * (layerIndex + 1);
            const neuronSpacing = height / (neurons + 1);
            
            return Array.from({ length: neurons }, (_, neuronIndex) => ({
                x: x,
                y: neuronSpacing * (neuronIndex + 1),
                layer: layerIndex,
                neuron: neuronIndex,
                value: Math.random() // Random activation for demo
            }));
        });

        const allNeurons = layers.flat();
        const weights = generateWeights();

        // Draw connections
        if (showConnections) {
            let weightIndex = 0;
            for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
                const currentLayer = layers[layerIndex];
                const nextLayer = layers[layerIndex + 1];
                
                currentLayer.forEach((fromNeuron, fromIndex) => {
                    nextLayer.forEach((toNeuron, toIndex) => {
                        const weight = weights[layerIndex][weightIndex++];
                        const opacity = showWeights ? Math.abs(weight) * 0.8 + 0.2 : 0.3;
                        const color = weight > 0 ? '#4ade80' : '#f87171';
                        
                        const line = svg.append('line')
                            .attr('x1', fromNeuron.x)
                            .attr('y1', fromNeuron.y)
                            .attr('x2', toNeuron.x)
                            .attr('y2', toNeuron.y)
                            .attr('stroke', showWeights ? color : '#4b5563')
                            .attr('stroke-width', showWeights ? Math.abs(weight) * 2 + 0.5 : 1)
                            .attr('opacity', opacity);

                        if (animateData) {
                            line.attr('stroke-dasharray', '5,5')
                                .append('animateTransform')
                                .attr('attributeName', 'stroke-dashoffset')
                                .attr('values', '0;10')
                                .attr('dur', '1s')
                                .attr('repeatCount', 'indefinite');
                        }

                        // Weight labels (only for small networks)
                        if (showWeights && topology.reduce((sum, layer) => sum + layer, 0) < 15) {
                            const midX = (fromNeuron.x + toNeuron.x) / 2;
                            const midY = (fromNeuron.y + toNeuron.y) / 2;
                            svg.append('text')
                                .attr('x', midX)
                                .attr('y', midY - 5)
                                .attr('text-anchor', 'middle')
                                .attr('fill', '#e5e7eb')
                                .attr('font-size', '10px')
                                .text(weight.toFixed(2));
                        }
                    });
                });
            }
        }

        // Draw neurons
        allNeurons.forEach((neuron, index) => {
            const layerColors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
            const color = layerColors[neuron.layer % layerColors.length];
            
            const circle = svg.append('circle')
                .attr('cx', neuron.x)
                .attr('cy', neuron.y)
                .attr('r', 15)
                .attr('fill', color)
                .attr('stroke', '#e5e7eb')
                .attr('stroke-width', 2);

            // Animate activation if enabled
            if (animateData) {
                circle.transition()
                    .duration(1000)
                    .attr('r', 15 + neuron.value * 5)
                    .transition()
                    .duration(1000)
                    .attr('r', 15)
                    .on('end', function repeat() {
                        d3.select(this)
                            .transition()
                            .duration(1000)
                            .attr('r', 15 + Math.random() * 5)
                            .transition()
                            .duration(1000)
                            .attr('r', 15)
                            .on('end', repeat);
                    });
            }

            // Neuron value text
            svg.append('text')
                .attr('x', neuron.x)
                .attr('y', neuron.y + 4)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '10px')
                .attr('font-weight', 'bold')
                .text(neuron.value.toFixed(2));
        });

        // Layer labels
        layers.forEach((layer, index) => {
            const layerNames = ['Input', 'Hidden', 'Hidden 2', 'Hidden 3', 'Output'];
            let layerName = index === 0 ? 'Input' : 
                           index === layers.length - 1 ? 'Output' : 
                           layers.length > 3 ? `Hidden ${index}` : 'Hidden';
            
            svg.append('text')
                .attr('x', layer[0].x)
                .attr('y', 30)
                .attr('text-anchor', 'middle')
                .attr('fill', '#e5e7eb')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .text(`${layerName} (${layer.length})`);
        });

    }, [topology, showConnections, showWeights, animateData, generateWeights]);

    const handlePresetChange = (preset) => {
        setSelectedPreset(preset);
        if (preset !== 'custom') {
            setTopology([...presets[preset].layers]);
        }
    };

    const updateCustomLayer = (index, value) => {
        const newTopology = [...topology];
        newTopology[index] = Math.max(1, Math.min(10, value));
        setTopology(newTopology);
        setSelectedPreset('custom');
    };

    const addLayer = () => {
        if (topology.length < 6) {
            setTopology([...topology, 2]);
            setSelectedPreset('custom');
        }
    };

    const removeLayer = () => {
        if (topology.length > 2) {
            setTopology(topology.slice(0, -1));
            setSelectedPreset('custom');
        }
    };

    const stats = calculateStats();

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Network Topology Demo</h3>
            
            {/* Preset Selection */}
            <div className="mb-4">
                <label className="text-sm text-gray-300 block mb-2">Choose Architecture:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(presets).map(([key, preset]) => (
                        <button
                            key={key}
                            onClick={() => handlePresetChange(key)}
                            className={`p-2 rounded text-sm transition-colors ${
                                selectedPreset === key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                        >
                            <div className="font-semibold">{preset.name}</div>
                            <div className="text-xs opacity-75">{preset.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Topology Editor */}
            {selectedPreset === 'custom' && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Custom Topology</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                        {topology.map((neurons, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <span className="text-gray-300 text-sm">Layer {index + 1}:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={neurons}
                                    onChange={(e) => updateCustomLayer(index, parseInt(e.target.value) || 1)}
                                    className="w-16 px-2 py-1 bg-gray-600 text-white rounded text-sm"
                                />
                                {index < topology.length - 1 && <span className="text-gray-400">→</span>}
                            </div>
                        ))}
                        <button
                            onClick={addLayer}
                            disabled={topology.length >= 6}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm"
                        >
                            + Layer
                        </button>
                        <button
                            onClick={removeLayer}
                            disabled={topology.length <= 2}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-sm"
                        >
                            - Layer
                        </button>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center gap-2 text-gray-300">
                    <input
                        type="checkbox"
                        checked={showConnections}
                        onChange={(e) => setShowConnections(e.target.checked)}
                        className="rounded"
                    />
                    Show Connections
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                    <input
                        type="checkbox"
                        checked={showWeights}
                        onChange={(e) => setShowWeights(e.target.checked)}
                        className="rounded"
                    />
                    Show Weights
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                    <input
                        type="checkbox"
                        checked={animateData}
                        onChange={(e) => setAnimateData(e.target.checked)}
                        className="rounded"
                    />
                    Animate Data Flow
                </label>
            </div>

            {/* Visualization */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
                <svg ref={svgRef}></svg>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Network Statistics</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                        <p>Total Neurons: <span className="text-blue-400">{stats.totalNeurons}</span></p>
                        <p>Total Connections: <span className="text-green-400">{stats.totalConnections}</span></p>
                        <p>Total Parameters: <span className="text-yellow-400">{stats.totalParameters}</span></p>
                        <p>Layers: <span className="text-purple-400">{topology.length}</span></p>
                    </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Layer Structure</h4>
                    <div className="text-sm text-gray-300">
                        <p className="font-mono text-center text-lg text-blue-400">
                            {topology.join(' → ')}
                        </p>
                        <div className="mt-2 space-y-1">
                            {topology.map((neurons, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>Layer {index + 1}:</span>
                                    <span className="text-gray-400">{neurons} neurons</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Complexity Analysis</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                        <p>Network Depth: <span className="text-indigo-400">{topology.length}</span></p>
                        <p>Max Width: <span className="text-pink-400">{Math.max(...topology)}</span></p>
                        <p>Memory (approx): <span className="text-cyan-400">{(stats.totalParameters * 4 / 1024).toFixed(1)}KB</span></p>
                        <p>
                            Complexity: 
                            <span className={`ml-1 ${
                                stats.totalParameters < 50 ? 'text-green-400' :
                                stats.totalParameters < 200 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                                {stats.totalParameters < 50 ? 'Low' :
                                 stats.totalParameters < 200 ? 'Medium' : 'High'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-300">
                <h4 className="font-semibold mb-2 text-white">Interactive Features:</h4>
                <ul className="space-y-1">
                    <li>🎛️ <strong>Choose Architecture:</strong> Select from common network topologies or create custom ones</li>
                    <li>🔗 <strong>Show Connections:</strong> Visualize how neurons connect between layers</li>
                    <li>⚖️ <strong>Show Weights:</strong> Display connection weights (green=positive, red=negative)</li>
                    <li>🌊 <strong>Animate Data Flow:</strong> Watch data propagate through the network</li>
                    <li>📊 <strong>Real-time Stats:</strong> See parameter counts and complexity metrics</li>
                </ul>
            </div>
        </div>
    );
};

// Advanced PSO Demo with Parameter Tuning
export const AdvancedPSODemo = () => {
    const svgRef = useRef();
    const chartRef = useRef();
    const animationRef = useRef();
    const [isRunning, setIsRunning] = useState(false);
    const [particles, setParticles] = useState([]);
    const [globalBest, setGlobalBest] = useState({ x: 300, y: 200, fitness: -Infinity });
    const [iteration, setIteration] = useState(0);
    const [convergenceHistory, setConvergenceHistory] = useState([]);
    const [showForces, setShowForces] = useState(true);
    const [showVelocities, setShowVelocities] = useState(true);
    const [psoParameters, setPsoParameters] = useState({
        w: 0.7,    // Inertia weight
        c1: 1.5,   // Cognitive coefficient  
        c2: 1.5    // Social coefficient
    });

    // Enhanced fitness function with multiple local optima
    const fitnessFunction = (x, y) => {
        const centerX = 300;
        const centerY = 200;
        
        // Primary peak
        const primary = Math.exp(-((x - centerX) ** 2 + (y - centerY) ** 2) / 5000);
        
        // Secondary peaks to create interesting landscape
        const secondary1 = 0.7 * Math.exp(-((x - 150) ** 2 + (y - 100) ** 2) / 3000);
        const secondary2 = 0.5 * Math.exp(-((x - 450) ** 2 + (y - 300) ** 2) / 2000);
        
        // Add some noise for realism
        const noise = 0.1 * Math.sin(x * 0.02) * Math.cos(y * 0.02);
        
        return primary + secondary1 + secondary2 + noise;
    };

    const initializeParticles = useCallback(() => {
        const newParticles = [];
        let bestFitness = -Infinity;
        let bestPosition = { x: 300, y: 200 };

        for (let i = 0; i < 25; i++) {
            const x = Math.random() * 600;
            const y = Math.random() * 400;
            const fitness = fitnessFunction(x, y);
            
            if (fitness > bestFitness) {
                bestFitness = fitness;
                bestPosition = { x, y };
            }

            newParticles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                pBestX: x,
                pBestY: y,
                pBestFitness: fitness,
                fitness,
                id: i,
                cognitiveForceX: 0,
                cognitiveForceY: 0,
                socialForceX: 0,
                socialForceY: 0,
                inertialForceX: 0,
                inertialForceY: 0
            });
        }

        setParticles(newParticles);
        setGlobalBest({ ...bestPosition, fitness: bestFitness });
        setIteration(0);
        setConvergenceHistory([{ iteration: 0, fitness: bestFitness }]);
    }, []);

    const updateParticles = useCallback(() => {
        setParticles(currentParticles => {
            const { w, c1, c2 } = psoParameters;
            let newGlobalBest = globalBest;

            const updatedParticles = currentParticles.map(particle => {
                const r1 = Math.random();
                const r2 = Math.random();

                // Calculate force components for visualization
                const inertialForceX = w * particle.vx;
                const inertialForceY = w * particle.vy;
                
                const cognitiveForceX = c1 * r1 * (particle.pBestX - particle.x);
                const cognitiveForceY = c1 * r1 * (particle.pBestY - particle.y);
                
                const socialForceX = c2 * r2 * (globalBest.x - particle.x);
                const socialForceY = c2 * r2 * (globalBest.y - particle.y);

                // Update velocity (sum of all forces)
                const newVx = inertialForceX + cognitiveForceX + socialForceX;
                const newVy = inertialForceY + cognitiveForceY + socialForceY;

                // Velocity clamping
                const maxVelocity = 15;
                const clampedVx = Math.max(-maxVelocity, Math.min(maxVelocity, newVx));
                const clampedVy = Math.max(-maxVelocity, Math.min(maxVelocity, newVy));

                // Update position
                let newX = particle.x + clampedVx;
                let newY = particle.y + clampedVy;

                // Boundary conditions with reflection
                if (newX < 10) { newX = 10; }
                if (newX > 590) { newX = 590; }
                if (newY < 10) { newY = 10; }
                if (newY > 390) { newY = 390; }

                // Calculate fitness
                const fitness = fitnessFunction(newX, newY);

                // Update personal best
                let pBestX = particle.pBestX;
                let pBestY = particle.pBestY;
                let pBestFitness = particle.pBestFitness;

                if (fitness > pBestFitness) {
                    pBestX = newX;
                    pBestY = newY;
                    pBestFitness = fitness;
                }

                // Update global best
                if (fitness > newGlobalBest.fitness) {
                    newGlobalBest = { x: newX, y: newY, fitness };
                }

                return {
                    ...particle,
                    x: newX,
                    y: newY,
                    vx: clampedVx,
                    vy: clampedVy,
                    pBestX,
                    pBestY,
                    pBestFitness,
                    fitness,
                    cognitiveForceX,
                    cognitiveForceY,
                    socialForceX,
                    socialForceY,
                    inertialForceX,
                    inertialForceY
                };
            });

            setGlobalBest(newGlobalBest);
            return updatedParticles;
        });

        setIteration(prev => prev + 1);
        setConvergenceHistory(prev => [...prev, { iteration: iteration + 1, fitness: globalBest.fitness }].slice(-100));
    }, [globalBest, psoParameters, iteration]);

    const animate = useCallback(() => {
        if (!isRunning) return;

        updateParticles();
        animationRef.current = setTimeout(animate, 150);
    }, [isRunning, updateParticles]);

    useEffect(() => {
        if (isRunning) {
            animate();
        } else {
            clearTimeout(animationRef.current);
        }
        return () => clearTimeout(animationRef.current);
    }, [isRunning, animate]);

    // Main visualization with enhanced features
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;

        // Create fitness landscape visualization
        const defs = svg.append('defs');
        
        // Create multiple gradients for complex landscape
        const gradient1 = defs.append('radialGradient')
            .attr('id', 'fitnessGradient1')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '40%');

        gradient1.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#22c55e')
            .attr('stop-opacity', 0.6);

        gradient1.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#22c55e')
            .attr('stop-opacity', 0.1);

        // Secondary peaks
        const gradient2 = defs.append('radialGradient')
            .attr('id', 'fitnessGradient2')
            .attr('cx', '25%')
            .attr('cy', '25%')
            .attr('r', '30%');

        gradient2.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#3b82f6')
            .attr('stop-opacity', 0.4);

        gradient2.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#3b82f6')
            .attr('stop-opacity', 0.1);

        // Background
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#1f2937');

        // Fitness landscapes
        svg.append('ellipse')
            .attr('cx', 300)
            .attr('cy', 200)
            .attr('rx', 120)
            .attr('ry', 80)
            .attr('fill', 'url(#fitnessGradient1)');

        svg.append('ellipse')
            .attr('cx', 150)
            .attr('cy', 100)
            .attr('rx', 80)
            .attr('ry', 60)
            .attr('fill', 'url(#fitnessGradient2)');

        svg.append('ellipse')
            .attr('cx', 450)
            .attr('cy', 300)
            .attr('rx', 60)
            .attr('ry', 50)
            .attr('fill', 'url(#fitnessGradient2)');

        // Arrow markers for force vectors
        defs.append('marker')
            .attr('id', 'arrowhead-cognitive')
            .attr('markerWidth', 8)
            .attr('markerHeight', 6)
            .attr('refX', 7)
            .attr('refY', 3)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 8 3, 0 6')
            .attr('fill', '#f59e0b');

        defs.append('marker')
            .attr('id', 'arrowhead-social')
            .attr('markerWidth', 8)
            .attr('markerHeight', 6)
            .attr('refX', 7)
            .attr('refY', 3)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 8 3, 0 6')
            .attr('fill', '#ef4444');

        defs.append('marker')
            .attr('id', 'arrowhead-velocity')
            .attr('markerWidth', 8)
            .attr('markerHeight', 6)
            .attr('refX', 7)
            .attr('refY', 3)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 8 3, 0 6')
            .attr('fill', '#8b5cf6');

        // Draw global best with enhanced styling
        svg.append('circle')
            .attr('cx', globalBest.x)
            .attr('cy', globalBest.y)
            .attr('r', 18)
            .attr('fill', '#fbbf24')
            .attr('stroke', '#f59e0b')
            .attr('stroke-width', 3)
            .style('filter', 'drop-shadow(0 0 8px #fbbf24)');

        svg.append('text')
            .attr('x', globalBest.x)
            .attr('y', globalBest.y - 25)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fbbf24')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text('🌟 Global Best');

        // Draw particles with enhanced force visualization
        particles.forEach((particle, i) => {
            // Personal best (faded)
            svg.append('circle')
                .attr('cx', particle.pBestX)
                .attr('cy', particle.pBestY)
                .attr('r', 4)
                .attr('fill', '#6b7280')
                .attr('opacity', 0.6)
                .attr('stroke', '#4b5563')
                .attr('stroke-width', 1);

            // Draw force vectors if enabled
            if (showForces) {
                const forceScale = 2;
                
                // Cognitive force (toward personal best)
                if (Math.abs(particle.cognitiveForceX) > 0.1 || Math.abs(particle.cognitiveForceY) > 0.1) {
                    svg.append('line')
                        .attr('x1', particle.x)
                        .attr('y1', particle.y)
                        .attr('x2', particle.x + particle.cognitiveForceX * forceScale)
                        .attr('y2', particle.y + particle.cognitiveForceY * forceScale)
                        .attr('stroke', '#f59e0b')
                        .attr('stroke-width', 1.5)
                        .attr('opacity', 0.7)
                        .attr('marker-end', 'url(#arrowhead-cognitive)');
                }

                // Social force (toward global best)
                if (Math.abs(particle.socialForceX) > 0.1 || Math.abs(particle.socialForceY) > 0.1) {
                    svg.append('line')
                        .attr('x1', particle.x)
                        .attr('y1', particle.y)
                        .attr('x2', particle.x + particle.socialForceX * forceScale)
                        .attr('y2', particle.y + particle.socialForceY * forceScale)
                        .attr('stroke', '#ef4444')
                        .attr('stroke-width', 1.5)
                        .attr('opacity', 0.7)
                        .attr('marker-end', 'url(#arrowhead-social)');
                }
            }

            // Draw velocity vector if enabled
            if (showVelocities) {
                svg.append('line')
                    .attr('x1', particle.x)
                    .attr('y1', particle.y)
                    .attr('x2', particle.x + particle.vx * 3)
                    .attr('y2', particle.y + particle.vy * 3)
                    .attr('stroke', '#8b5cf6')
                    .attr('stroke-width', 2)
                    .attr('opacity', 0.8)
                    .attr('marker-end', 'url(#arrowhead-velocity)');
            }

            // Draw particle
            svg.append('circle')
                .attr('cx', particle.x)
                .attr('cy', particle.y)
                .attr('r', 6)
                .attr('fill', '#3b82f6')
                .attr('stroke', '#1d4ed8')
                .attr('stroke-width', 2)
                .style('filter', 'drop-shadow(0 0 4px #3b82f6)');
        });

    }, [particles, globalBest, showForces, showVelocities]);

    // Convergence chart
    useEffect(() => {
        if (convergenceHistory.length < 2) return;

        const chartSvg = d3.select(chartRef.current);
        chartSvg.selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 400 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        const svg = chartSvg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain(d3.extent(convergenceHistory, d => d.iteration))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(convergenceHistory, d => d.fitness))
            .range([height, 0]);

        const line = d3.line()
            .x(d => xScale(d.iteration))
            .y(d => yScale(d.fitness))
            .curve(d3.curveMonotoneX);

        // Draw axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("x", width / 2)
            .attr("y", 35)
            .attr("fill", "#e5e7eb")
            .style("text-anchor", "middle")
            .text("Iteration");

        g.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -35)
            .attr("x", -height / 2)
            .attr("fill", "#e5e7eb")
            .style("text-anchor", "middle")
            .text("Best Fitness");

        // Draw line
        g.append("path")
            .datum(convergenceHistory)
            .attr("fill", "none")
            .attr("stroke", "#22c55e")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Draw points
        g.selectAll(".dot")
            .data(convergenceHistory)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.iteration))
            .attr("cy", d => yScale(d.fitness))
            .attr("r", 3)
            .attr("fill", "#22c55e");

    }, [convergenceHistory]);

    useEffect(() => {
        initializeParticles();
    }, [initializeParticles]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Advanced PSO: Parameter Tuning & Force Analysis</h3>
            
            {/* Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* PSO Parameters */}
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-white">PSO Parameters</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-300 block mb-1">
                                Inertia Weight (w): {psoParameters.w.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1.5"
                                step="0.05"
                                value={psoParameters.w}
                                onChange={(e) => setPsoParameters({...psoParameters, w: parseFloat(e.target.value)})}
                                className="w-full"
                                disabled={isRunning}
                            />
                            <p className="text-xs text-gray-400 mt-1">Controls exploration vs exploitation</p>
                        </div>
                        
                        <div>
                            <label className="text-sm text-gray-300 block mb-1">
                                Cognitive Coef. (c1): {psoParameters.c1.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="3.0"
                                step="0.1"
                                value={psoParameters.c1}
                                onChange={(e) => setPsoParameters({...psoParameters, c1: parseFloat(e.target.value)})}
                                className="w-full"
                                disabled={isRunning}
                            />
                            <p className="text-xs text-gray-400 mt-1">Attraction to personal best</p>
                        </div>
                        
                        <div>
                            <label className="text-sm text-gray-300 block mb-1">
                                Social Coef. (c2): {psoParameters.c2.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="3.0"
                                step="0.1"
                                value={psoParameters.c2}
                                onChange={(e) => setPsoParameters({...psoParameters, c2: parseFloat(e.target.value)})}
                                className="w-full"
                                disabled={isRunning}
                            />
                            <p className="text-xs text-gray-400 mt-1">Attraction to global best</p>
                        </div>
                    </div>
                </div>

                {/* Visualization Controls */}
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-white">Visualization</h4>
                    <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showForces}
                                onChange={(e) => setShowForces(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-300">Show Force Vectors</span>
                        </label>
                        
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showVelocities}
                                onChange={(e) => setShowVelocities(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-300">Show Velocity Vectors</span>
                        </label>

                        <div className="text-xs text-gray-400 space-y-1 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-0.5 bg-yellow-500"></div>
                                <span>Cognitive Force</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-0.5 bg-red-500"></div>
                                <span>Social Force</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-0.5 bg-purple-500"></div>
                                <span>Velocity</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Information */}
                <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-white">Status</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p>Iteration: <span className="text-blue-400">{iteration}</span></p>
                        <p>Best Fitness: <span className="text-yellow-400">{globalBest.fitness.toFixed(4)}</span></p>
                        <p>Position: <span className="text-yellow-400">({globalBest.x.toFixed(0)}, {globalBest.y.toFixed(0)})</span></p>
                        <p>Particles: <span className="text-green-400">{particles.length}</span></p>
                    </div>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded font-semibold ${
                        isRunning 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                    {isRunning ? 'Pause' : 'Start'} Optimization
                </button>
                
                <button
                    onClick={initializeParticles}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                    Reset Swarm
                </button>
            </div>

            {/* Main Visualization and Convergence Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-gray-900 rounded-lg p-4">
                    <svg ref={svgRef} width={600} height={400} className="border border-gray-600"></svg>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-white text-center">Convergence History</h4>
                    <svg ref={chartRef}></svg>
                </div>
            </div>

            {/* Educational Information */}
            <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-white">Understanding PSO Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div>
                        <h5 className="font-semibold text-yellow-400 mb-2">Inertia Weight (w)</h5>
                        <p>Controls the influence of previous velocity. Higher values promote exploration, lower values encourage exploitation around current best positions.</p>
                        <ul className="mt-2 space-y-1 text-xs">
                            <li>• w > 1.0: Divergent behavior</li>
                            <li>• w = 0.5-0.9: Balanced search</li>
                            <li>• w &lt; 0.4: Quick convergence</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h5 className="font-semibold text-yellow-400 mb-2">Cognitive Coefficient (c1)</h5>
                        <p>Represents particle's confidence in its own experience. Higher values make particles trust their personal best positions more.</p>
                        <ul className="mt-2 space-y-1 text-xs">
                            <li>• High c1: Independent search</li>
                            <li>• Low c1: Social conformity</li>
                            <li>• Typical range: 1.0-2.0</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h5 className="font-semibold text-yellow-400 mb-2">Social Coefficient (c2)</h5>
                        <p>Controls attraction to global best. Higher values increase swarm cohesion but may cause premature convergence.</p>
                        <ul className="mt-2 space-y-1 text-xs">
                            <li>• High c2: Fast convergence</li>
                            <li>• Low c2: Diverse exploration</li>
                            <li>• Balance with c1 is crucial</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-900/30 rounded">
                    <p className="text-blue-300 text-sm">
                        💡 <strong>Pro Tip:</strong> Try different parameter combinations and observe how they affect convergence speed and exploration behavior. 
                        The optimal settings depend on your specific optimization problem!
                    </p>
                </div>
            </div>
        </div>
    );
};

// rUv-swarm Hands-on Simulation
export const RuvSwarmSimulation = () => {
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [parameters, setParameters] = useState({
        particles: 30,
        epochs: 50,
        dataset: 'xor'
    });

    const simulateRuvSwarm = useCallback(() => {
        setIsRunning(true);
        setOutput('');

        const lines = [
            'rUv-swarm Neural Network Optimizer',
            '====================================',
            '',
            `Initializing PSO with ${parameters.particles} particles...`,
            `Loading dataset: data/${parameters.dataset}.data`,
            'Network topology: 2-3-1 (2 inputs, 3 hidden, 1 output)',
            `Training for ${parameters.epochs} epochs...`,
            ''
        ];

        let currentLine = 0;
        const addLine = () => {
            if (currentLine < lines.length) {
                setOutput(prev => prev + lines[currentLine] + '\n');
                currentLine++;
                setTimeout(addLine, 200);
            } else {
                // Start training simulation
                simulateTraining();
            }
        };

        const simulateTraining = () => {
            let epoch = 1;
            let error = 0.5;
            
            const addEpoch = () => {
                if (epoch <= parameters.epochs && isRunning) {
                    error *= (0.95 + Math.random() * 0.1); // Simulate convergence with some noise
                    const line = `Epoch ${epoch.toString().padStart(2)}: Best Error = ${error.toFixed(6)}`;
                    setOutput(prev => prev + line + '\n');
                    
                    epoch += Math.ceil(parameters.epochs / 10); // Show every 10th epoch (approximately)
                    
                    if (epoch <= parameters.epochs) {
                        setTimeout(addEpoch, 300);
                    } else {
                        // Training complete
                        setTimeout(() => {
                            const finalLines = [
                                '',
                                'Training completed!',
                                `Final network accuracy: ${(100 - error * 20).toFixed(2)}%`,
                                '',
                                'Testing network on all XOR patterns:',
                                'Input: [0.0, 0.0] Expected: [0.0] Got: [0.001]',
                                'Input: [0.0, 1.0] Expected: [1.0] Got: [0.998]',
                                'Input: [1.0, 0.0] Expected: [1.0] Got: [0.999]',
                                'Input: [1.0, 1.0] Expected: [0.0] Got: [0.002]',
                                '',
                                '✅ XOR problem successfully solved!',
                                `🎯 Converged in ${parameters.epochs} epochs`,
                                `🧠 Used ${parameters.particles} particles for optimization`
                            ];
                            
                            finalLines.forEach((line, i) => {
                                setTimeout(() => {
                                    setOutput(prev => prev + line + '\n');
                                    if (i === finalLines.length - 1) {
                                        setIsRunning(false);
                                    }
                                }, i * 200);
                            });
                        }, 500);
                    }
                }
            };
            
            addEpoch();
        };

        addLine();
    }, [parameters, isRunning]);

    const stopSimulation = () => {
        setIsRunning(false);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">rUv-swarm Hands-on Simulation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="text-sm text-gray-300 block mb-1">
                        Particles: {parameters.particles}
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        step="10"
                        value={parameters.particles}
                        onChange={(e) => setParameters({...parameters, particles: parseInt(e.target.value)})}
                        className="w-full"
                        disabled={isRunning}
                    />
                </div>
                
                <div>
                    <label className="text-sm text-gray-300 block mb-1">
                        Epochs: {parameters.epochs}
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="200"
                        step="10"
                        value={parameters.epochs}
                        onChange={(e) => setParameters({...parameters, epochs: parseInt(e.target.value)})}
                        className="w-full"
                        disabled={isRunning}
                    />
                </div>
                
                <div>
                    <label className="text-sm text-gray-300 block mb-1">Dataset:</label>
                    <select
                        value={parameters.dataset}
                        onChange={(e) => setParameters({...parameters, dataset: e.target.value})}
                        className="w-full bg-gray-700 text-white px-3 py-1 rounded"
                        disabled={isRunning}
                    >
                        <option value="xor">XOR Problem</option>
                        <option value="iris">Iris Classification</option>
                        <option value="wine">Wine Quality</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={simulateRuvSwarm}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
                >
                    {isRunning ? 'Running...' : 'Run ./ruv-swarm'}
                </button>
                
                <button
                    onClick={stopSimulation}
                    disabled={!isRunning}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
                >
                    Stop
                </button>
                
                <button
                    onClick={() => setOutput('')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold"
                >
                    Clear
                </button>
            </div>

            <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{output || 'Ready to run rUv-swarm simulation...\n\nAdjust parameters above and click "Run ./ruv-swarm" to start!'}</pre>
                {isRunning && (
                    <span className="animate-pulse">█</span>
                )}
            </div>

            <div className="mt-4 text-sm text-gray-300">
                <h4 className="font-semibold mb-2 text-white">Understanding the Output:</h4>
                <ul className="space-y-1">
                    <li><strong>Epoch:</strong> One complete training iteration</li>
                    <li><strong>Best Error:</strong> Lowest error found by any particle (lower is better)</li>
                    <li><strong>Network Accuracy:</strong> Percentage of correct predictions</li>
                    <li><strong>Test Results:</strong> How well the network performs on XOR patterns</li>
                </ul>
            </div>
        </div>
    );
};

// FANN Utils Demo - Module 6 Practitioner Level
export const FANNUtilsDemo = () => {
    const svgRef = useRef();
    const topologyRef = useRef();
    const mappingRef = useRef();
    const [networkParams, setNetworkParams] = useState({
        inputNodes: 2,
        hiddenNodes: 3,
        outputNodes: 1,
        learningRate: 0.1,
        epochs: 1000
    });
    const [particleParams, setParticleParams] = useState({
        position: [0.5, -0.3, 0.8, 0.2, -0.1, 0.7, 0.9],  // 7 weights for 2-3-1 network
        fitness: 0.0,
        particleId: 1
    });
    const [selectedView, setSelectedView] = useState('topology');
    const [animationStep, setAnimationStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [networkState, setNetworkState] = useState('created');
    const [codeView, setCodeView] = useState('creation');

    // FANN Network creation simulation
    const createNetwork = useCallback(() => {
        setNetworkState('creating');
        setTimeout(() => setNetworkState('created'), 1000);
    }, []);

    const destroyNetwork = useCallback(() => {
        setNetworkState('destroying');
        setTimeout(() => setNetworkState('destroyed'), 1000);
    }, []);

    // Weight mapping from PSO particle to FANN network
    const mapParticleToWeights = useCallback(() => {
        const { position } = particleParams;
        const { inputNodes, hiddenNodes, outputNodes } = networkParams;
        
        // Calculate expected number of weights for 2-3-1 topology
        const inputToHiddenWeights = inputNodes * hiddenNodes; // 2 * 3 = 6
        const hiddenToOutputWeights = hiddenNodes * outputNodes; // 3 * 1 = 3
        const totalWeights = inputToHiddenWeights + hiddenToOutputWeights; // 9 total
        
        return {
            inputToHidden: position.slice(0, inputToHiddenWeights),
            hiddenToOutput: position.slice(inputToHiddenWeights, inputToHiddenWeights + hiddenToOutputWeights),
            totalExpected: totalWeights,
            actualProvided: position.length
        };
    }, [particleParams.position, networkParams]);

    // Fitness evaluation simulation
    const evaluateFitness = useCallback(() => {
        const weights = mapParticleToWeights();
        // Simulate XOR problem evaluation
        const xorPatterns = [
            { input: [0, 0], expected: 0 },
            { input: [0, 1], expected: 1 },
            { input: [1, 0], expected: 1 },
            { input: [1, 1], expected: 0 }
        ];
        
        let totalError = 0;
        xorPatterns.forEach(pattern => {
            // Simplified forward pass calculation
            const hiddenOutputs = [];
            for (let h = 0; h < networkParams.hiddenNodes; h++) {
                let sum = 0;
                for (let i = 0; i < networkParams.inputNodes; i++) {
                    sum += pattern.input[i] * weights.inputToHidden[i * networkParams.hiddenNodes + h];
                }
                hiddenOutputs.push(1 / (1 + Math.exp(-sum))); // sigmoid
            }
            
            let outputSum = 0;
            for (let h = 0; h < networkParams.hiddenNodes; h++) {
                outputSum += hiddenOutputs[h] * weights.hiddenToOutput[h];
            }
            const networkOutput = 1 / (1 + Math.exp(-outputSum));
            
            totalError += Math.pow(pattern.expected - networkOutput, 2);
        });
        
        const fitness = 1 - (totalError / 4); // Normalize fitness
        setParticleParams(prev => ({ ...prev, fitness }));
        return fitness;
    }, [mapParticleToWeights, networkParams]);

    // Network topology visualization
    useEffect(() => {
        if (selectedView !== 'topology') return;
        
        const svg = d3.select(topologyRef.current);
        svg.selectAll("*").remove();
        
        const width = 600;
        const height = 300;
        svg.attr("width", width).attr("height", height);
        
        // Layer positions
        const inputLayer = Array.from({length: networkParams.inputNodes}, (_, i) => ({
            x: 100,
            y: 50 + i * 100,
            label: `I${i+1}`
        }));
        
        const hiddenLayer = Array.from({length: networkParams.hiddenNodes}, (_, i) => ({
            x: 300,
            y: 25 + i * 75,
            label: `H${i+1}`
        }));
        
        const outputLayer = Array.from({length: networkParams.outputNodes}, (_, i) => ({
            x: 500,
            y: 125 + i * 50,
            label: `O${i+1}`
        }));
        
        const weights = mapParticleToWeights();
        
        // Draw connections with weights
        let weightIndex = 0;
        inputLayer.forEach((input, i) => {
            hiddenLayer.forEach((hidden, h) => {
                const weight = weights.inputToHidden[weightIndex];
                const line = svg.append('line')
                    .attr('x1', input.x + 25)
                    .attr('y1', input.y)
                    .attr('x2', hidden.x - 25)
                    .attr('y2', hidden.y)
                    .attr('stroke', weight > 0 ? '#22c55e' : '#ef4444')
                    .attr('stroke-width', Math.abs(weight) * 3 + 1)
                    .attr('opacity', 0.7);
                
                // Weight label
                const midX = (input.x + hidden.x) / 2;
                const midY = (input.y + hidden.y) / 2;
                svg.append('text')
                    .attr('x', midX)
                    .attr('y', midY - 10)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#e5e7eb')
                    .attr('font-size', '10px')
                    .text(weight.toFixed(2));
                    
                weightIndex++;
            });
        });
        
        hiddenLayer.forEach((hidden, h) => {
            outputLayer.forEach((output, o) => {
                const weight = weights.hiddenToOutput[h];
                svg.append('line')
                    .attr('x1', hidden.x + 25)
                    .attr('y1', hidden.y)
                    .attr('x2', output.x - 25)
                    .attr('y2', output.y)
                    .attr('stroke', weight > 0 ? '#22c55e' : '#ef4444')
                    .attr('stroke-width', Math.abs(weight) * 3 + 1)
                    .attr('opacity', 0.7);
                
                const midX = (hidden.x + output.x) / 2;
                const midY = (hidden.y + output.y) / 2;
                svg.append('text')
                    .attr('x', midX)
                    .attr('y', midY - 10)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#e5e7eb')
                    .attr('font-size', '10px')
                    .text(weight.toFixed(2));
            });
        });
        
        // Draw neurons
        const drawNeurons = (layer, color) => {
            layer.forEach(neuron => {
                svg.append('circle')
                    .attr('cx', neuron.x)
                    .attr('cy', neuron.y)
                    .attr('r', 20)
                    .attr('fill', color)
                    .attr('stroke', '#e5e7eb')
                    .attr('stroke-width', 2);
                
                svg.append('text')
                    .attr('x', neuron.x)
                    .attr('y', neuron.y + 5)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white')
                    .attr('font-size', '12px')
                    .attr('font-weight', 'bold')
                    .text(neuron.label);
            });
        };
        
        drawNeurons(inputLayer, '#3b82f6');
        drawNeurons(hiddenLayer, '#8b5cf6');
        drawNeurons(outputLayer, '#22c55e');
        
    }, [selectedView, networkParams, mapParticleToWeights, particleParams.position]);

    // Weight mapping visualization
    useEffect(() => {
        if (selectedView !== 'mapping') return;
        
        const svg = d3.select(mappingRef.current);
        svg.selectAll("*").remove();
        
        const width = 600;
        const height = 400;
        svg.attr("width", width).attr("height", height);
        
        const weights = mapParticleToWeights();
        const allWeights = [...weights.inputToHidden, ...weights.hiddenToOutput];
        
        // Draw particle position vector
        svg.append('text')
            .attr('x', 50)
            .attr('y', 30)
            .attr('fill', '#e5e7eb')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text('PSO Particle Position → FANN Weights Mapping');
        
        // Particle vector visualization
        const particleY = 80;
        svg.append('text')
            .attr('x', 50)
            .attr('y', particleY - 20)
            .attr('fill', '#fbbf24')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(`Particle ${particleParams.particleId} Position Vector:`);
        
        particleParams.position.forEach((weight, i) => {
            const x = 50 + i * 60;
            const rect = svg.append('rect')
                .attr('x', x)
                .attr('y', particleY)
                .attr('width', 50)
                .attr('height', 30)
                .attr('fill', weight > 0 ? '#22c55e' : '#ef4444')
                .attr('stroke', '#e5e7eb')
                .attr('opacity', 0.8);
            
            svg.append('text')
                .attr('x', x + 25)
                .attr('y', particleY + 20)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '10px')
                .attr('font-weight', 'bold')
                .text(weight.toFixed(2));
        });
        
        // Arrow pointing down
        svg.append('path')
            .attr('d', 'M 300 140 L 300 160 L 290 150 M 300 160 L 310 150')
            .attr('stroke', '#e5e7eb')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('marker-end', 'url(#arrowhead)');
        
        // Weight matrix representation
        const matrixY = 200;
        svg.append('text')
            .attr('x', 50)
            .attr('y', matrixY - 20)
            .attr('fill', '#3b82f6')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text('Input→Hidden Weights (2×3):');
        
        weights.inputToHidden.forEach((weight, i) => {
            const row = Math.floor(i / networkParams.hiddenNodes);
            const col = i % networkParams.hiddenNodes;
            const x = 50 + col * 60;
            const y = matrixY + row * 40;
            
            svg.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', 50)
                .attr('height', 30)
                .attr('fill', weight > 0 ? '#22c55e' : '#ef4444')
                .attr('stroke', '#e5e7eb')
                .attr('opacity', 0.8);
            
            svg.append('text')
                .attr('x', x + 25)
                .attr('y', y + 20)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '10px')
                .text(weight.toFixed(2));
        });
        
        svg.append('text')
            .attr('x', 350)
            .attr('y', matrixY - 20)
            .attr('fill', '#8b5cf6')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text('Hidden→Output Weights (3×1):');
        
        weights.hiddenToOutput.forEach((weight, i) => {
            const x = 350;
            const y = matrixY + i * 40;
            
            svg.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', 50)
                .attr('height', 30)
                .attr('fill', weight > 0 ? '#22c55e' : '#ef4444')
                .attr('stroke', '#e5e7eb')
                .attr('opacity', 0.8);
            
            svg.append('text')
                .attr('x', x + 25)
                .attr('y', y + 20)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '10px')
                .text(weight.toFixed(2));
        });
        
    }, [selectedView, particleParams.position, mapParticleToWeights, networkParams]);

    const codeSnippets = {
        creation: `// fann_utils.c - Network Creation
struct fann *create_optimized_network(int inputs, int hidden, int outputs) {
    struct fann *ann = fann_create_standard(3, inputs, hidden, outputs);
    
    if (!ann) {
        printf("Error creating network\\n");
        return NULL;
    }
    
    // Set activation functions
    fann_set_activation_function_hidden(ann, FANN_SIGMOID_SYMMETRIC);
    fann_set_activation_function_output(ann, FANN_SIGMOID);
    
    // Initialize random weights
    fann_randomize_weights(ann, -1.0, 1.0);
    
    return ann;
}`,
        
        mapping: `// PSO Particle to FANN Weight Mapping
void map_particle_to_network(struct fann *ann, double *particle_position, int position_length) {
    fann_connection *connections = malloc(fann_get_total_connections(ann) * sizeof(fann_connection));
    fann_get_connection_array(ann, connections);
    
    int connection_count = fann_get_total_connections(ann);
    
    // Map particle position to network weights
    for (int i = 0; i < connection_count && i < position_length; i++) {
        connections[i].weight = (fann_type)particle_position[i];
    }
    
    // Apply weights to network
    fann_set_weight_array(ann, connections, connection_count);
    
    free(connections);
}`,
        
        fitness: `// Fitness Evaluation Function
double evaluate_network_fitness(struct fann *ann, fann_train_data *data) {
    double total_error = 0.0;
    int num_patterns = fann_length_train_data(data);
    
    for (int i = 0; i < num_patterns; i++) {
        fann_type *calc_out = fann_run(ann, data->input[i]);
        
        // Calculate MSE for this pattern
        for (int j = 0; j < data->num_output; j++) {
            double error = data->output[i][j] - calc_out[j];
            total_error += error * error;
        }
    }
    
    // Return fitness (inverse of MSE)
    double mse = total_error / (num_patterns * data->num_output);
    return 1.0 / (1.0 + mse);
}`,
        
        destruction: `// Safe Network Cleanup
void destroy_network_safe(struct fann **ann) {
    if (ann && *ann) {
        fann_destroy(*ann);
        *ann = NULL;
        printf("Network destroyed successfully\\n");
    }
}`
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">
                FANN Utils Demo - Module 6 (Practitioner Level)
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Network Parameters */}
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-lg font-semibold text-white mb-3">Network Configuration</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Input Nodes:</label>
                            <input
                                type="range"
                                min="1"
                                max="4"
                                value={networkParams.inputNodes}
                                onChange={(e) => setNetworkParams(prev => ({...prev, inputNodes: parseInt(e.target.value)}))}
                                className="w-full"
                            />
                            <span className="text-white text-sm">{networkParams.inputNodes}</span>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Hidden Nodes:</label>
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={networkParams.hiddenNodes}
                                onChange={(e) => setNetworkParams(prev => ({...prev, hiddenNodes: parseInt(e.target.value)}))}
                                className="w-full"
                            />
                            <span className="text-white text-sm">{networkParams.hiddenNodes}</span>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Output Nodes:</label>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                value={networkParams.outputNodes}
                                onChange={(e) => setNetworkParams(prev => ({...prev, outputNodes: parseInt(e.target.value)}))}
                                className="w-full"
                            />
                            <span className="text-white text-sm">{networkParams.outputNodes}</span>
                        </div>
                    </div>
                </div>
                
                {/* Particle Parameters */}
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-lg font-semibold text-white mb-3">PSO Particle</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Particle ID:</label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={particleParams.particleId}
                                onChange={(e) => setParticleParams(prev => ({...prev, particleId: parseInt(e.target.value)}))}
                                className="w-full bg-gray-600 text-white px-3 py-1 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Current Fitness:</label>
                            <div className="bg-gray-600 px-3 py-2 rounded text-white font-mono">
                                {particleParams.fitness.toFixed(6)}
                            </div>
                        </div>
                        <button
                            onClick={evaluateFitness}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                        >
                            Evaluate Fitness
                        </button>
                    </div>
                </div>
            </div>
            
            {/* View Selection */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setSelectedView('topology')}
                    className={`px-4 py-2 rounded font-semibold ${selectedView === 'topology' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                >
                    Network Topology
                </button>
                <button
                    onClick={() => setSelectedView('mapping')}
                    className={`px-4 py-2 rounded font-semibold ${selectedView === 'mapping' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                >
                    Weight Mapping
                </button>
                <button
                    onClick={() => setSelectedView('lifecycle')}
                    className={`px-4 py-2 rounded font-semibold ${selectedView === 'lifecycle' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                >
                    Network Lifecycle
                </button>
            </div>
            
            {/* Visualization Area */}
            <div className="bg-gray-900 p-4 rounded mb-6">
                {selectedView === 'topology' && (
                    <div>
                        <h4 className="text-white font-semibold mb-2">
                            Network Topology: {networkParams.inputNodes}-{networkParams.hiddenNodes}-{networkParams.outputNodes}
                        </h4>
                        <svg ref={topologyRef}></svg>
                    </div>
                )}
                
                {selectedView === 'mapping' && (
                    <div>
                        <h4 className="text-white font-semibold mb-2">PSO Particle to FANN Weight Mapping</h4>
                        <svg ref={mappingRef}></svg>
                    </div>
                )}
                
                {selectedView === 'lifecycle' && (
                    <div className="text-center">
                        <h4 className="text-white font-semibold mb-4">Network Lifecycle Management</h4>
                        <div className="flex justify-center gap-4 mb-6">
                            <button
                                onClick={createNetwork}
                                disabled={networkState === 'created' || networkState === 'creating'}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded font-semibold"
                            >
                                {networkState === 'creating' ? 'Creating...' : 'Create Network'}
                            </button>
                            <button
                                onClick={destroyNetwork}
                                disabled={networkState === 'destroyed' || networkState === 'destroying'}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded font-semibold"
                            >
                                {networkState === 'destroying' ? 'Destroying...' : 'Destroy Network'}
                            </button>
                        </div>
                        <div className={`text-4xl mb-4 ${
                            networkState === 'created' ? 'text-green-400' :
                            networkState === 'destroyed' ? 'text-red-400' :
                            networkState === 'creating' ? 'text-yellow-400' :
                            'text-orange-400'
                        }`}>
                            {networkState === 'created' && '🧠 Network Active'}
                            {networkState === 'destroyed' && '💀 Network Destroyed'}
                            {networkState === 'creating' && '⚡ Creating Network...'}
                            {networkState === 'destroying' && '🔥 Destroying Network...'}
                        </div>
                        <div className="text-gray-300">
                            <p>Status: <span className="text-white font-semibold">{networkState.toUpperCase()}</span></p>
                            <p className="mt-2 text-sm">
                                Memory allocation and deallocation are critical in C/FANN for preventing memory leaks.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Code Snippets */}
            <div className="bg-gray-700 p-4 rounded">
                <div className="flex gap-2 mb-4">
                    {Object.keys(codeSnippets).map(key => (
                        <button
                            key={key}
                            onClick={() => setCodeView(key)}
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                                codeView === key ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                            }`}
                        >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </button>
                    ))}
                </div>
                <pre className="bg-black p-4 rounded text-green-400 font-mono text-sm overflow-x-auto">
                    <code>{codeSnippets[codeView]}</code>
                </pre>
            </div>
            
            {/* Key Concepts */}
            <div className="mt-6 bg-gray-700 p-4 rounded">
                <h4 className="text-white font-semibold mb-3">Key FANN Utility Concepts:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                        <h5 className="text-white font-semibold mb-2">Weight Management:</h5>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>PSO particles represent complete weight vectors</li>
                            <li>Direct mapping to FANN connection arrays</li>
                            <li>Efficient bulk weight updates</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-semibold mb-2">Memory Safety:</h5>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Proper network creation/destruction</li>
                            <li>Connection array allocation/deallocation</li>
                            <li>Training data memory management</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-semibold mb-2">Fitness Evaluation:</h5>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Forward pass calculation</li>
                            <li>Error metric computation</li>
                            <li>Fitness function normalization</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-semibold mb-2">Integration:</h5>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>PSO-FANN hybrid optimization</li>
                            <li>Real-time weight updates</li>
                            <li>Performance monitoring</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Genetic Algorithm vs PSO Comparison Demo
export const GeneticAlgorithmDemo = () => {
    const svgRef = useRef();
    const [algorithm, setAlgorithm] = useState('GA');
    const [isRunning, setIsRunning] = useState(false);
    const [generation, setGeneration] = useState(0);
    const [population, setPopulation] = useState([]);
    const [bestFitness, setBestFitness] = useState(0);
    const [parameters, setParameters] = useState({
        GA: {
            populationSize: 20,
            mutationRate: 0.1,
            crossoverRate: 0.8,
            selectionPressure: 2
        },
        PSO: {
            swarmSize: 20,
            inertia: 0.7,
            cognitive: 1.5,
            social: 1.5
        }
    });

    // Simple fitness function - maximize sum of ones in binary string
    const fitnessFunction = (individual) => {
        if (algorithm === 'GA') {
            return individual.reduce((sum, bit) => sum + bit, 0) / individual.length;
        } else {
            // For PSO, use sphere function
            const sumSquares = individual.reduce((sum, x) => sum + x * x, 0);
            return 1 / (1 + sumSquares);
        }
    };

    const initializePopulation = useCallback(() => {
        const newPop = [];
        const size = parameters[algorithm].populationSize || parameters[algorithm].swarmSize;
        
        for (let i = 0; i < size; i++) {
            if (algorithm === 'GA') {
                // Binary chromosome
                const chromosome = Array.from({length: 10}, () => Math.random() > 0.5 ? 1 : 0);
                newPop.push({
                    id: i,
                    chromosome,
                    fitness: fitnessFunction(chromosome),
                    x: Math.random() * 400,
                    y: Math.random() * 300
                });
            } else {
                // Real-valued particle
                const position = Array.from({length: 2}, () => (Math.random() - 0.5) * 6);
                newPop.push({
                    id: i,
                    position,
                    velocity: Array.from({length: 2}, () => (Math.random() - 0.5) * 2),
                    fitness: fitnessFunction(position),
                    pbest: [...position],
                    pbestFitness: fitnessFunction(position),
                    x: position[0] * 50 + 200,
                    y: position[1] * 50 + 150
                });
            }
        }
        
        setPopulation(newPop);
        setBestFitness(Math.max(...newPop.map(ind => ind.fitness)));
        setGeneration(0);
    }, [algorithm, parameters]);

    const tournamentSelection = (pop, tournamentSize = 3) => {
        const tournament = [];
        for (let i = 0; i < tournamentSize; i++) {
            tournament.push(pop[Math.floor(Math.random() * pop.length)]);
        }
        return tournament.reduce((best, ind) => ind.fitness > best.fitness ? ind : best);
    };

    const crossover = (parent1, parent2) => {
        const point = Math.floor(Math.random() * parent1.chromosome.length);
        const child1 = [...parent1.chromosome.slice(0, point), ...parent2.chromosome.slice(point)];
        const child2 = [...parent2.chromosome.slice(0, point), ...parent1.chromosome.slice(point)];
        return [child1, child2];
    };

    const mutate = (chromosome, mutationRate) => {
        return chromosome.map(bit => 
            Math.random() < mutationRate ? 1 - bit : bit
        );
    };

    const evolveGA = useCallback(() => {
        setPopulation(currentPop => {
            const newPop = [];
            const sorted = [...currentPop].sort((a, b) => b.fitness - a.fitness);
            
            // Elitism - keep best individual
            newPop.push({...sorted[0], id: 0});
            
            // Generate rest of population
            for (let i = 1; i < currentPop.length; i += 2) {
                const parent1 = tournamentSelection(currentPop);
                const parent2 = tournamentSelection(currentPop);
                
                let [child1, child2] = Math.random() < parameters.GA.crossoverRate
                    ? crossover(parent1, parent2)
                    : [parent1.chromosome, parent2.chromosome];
                
                child1 = mutate(child1, parameters.GA.mutationRate);
                child2 = mutate(child2, parameters.GA.mutationRate);
                
                newPop.push({
                    id: i,
                    chromosome: child1,
                    fitness: fitnessFunction(child1),
                    x: Math.random() * 400,
                    y: Math.random() * 300
                });
                
                if (newPop.length < currentPop.length) {
                    newPop.push({
                        id: i + 1,
                        chromosome: child2,
                        fitness: fitnessFunction(child2),
                        x: Math.random() * 400,
                        y: Math.random() * 300
                    });
                }
            }
            
            const newBest = Math.max(...newPop.map(ind => ind.fitness));
            setBestFitness(newBest);
            return newPop;
        });
        setGeneration(gen => gen + 1);
    }, [parameters.GA]);

    const evolvePSO = useCallback(() => {
        setPopulation(currentPop => {
            const gbest = currentPop.reduce((best, particle) => 
                particle.fitness > best.fitness ? particle : best
            );
            
            const newPop = currentPop.map(particle => {
                const w = parameters.PSO.inertia;
                const c1 = parameters.PSO.cognitive;
                const c2 = parameters.PSO.social;
                
                const newVelocity = particle.velocity.map((v, i) => {
                    const r1 = Math.random();
                    const r2 = Math.random();
                    return w * v + 
                           c1 * r1 * (particle.pbest[i] - particle.position[i]) +
                           c2 * r2 * (gbest.position[i] - particle.position[i]);
                });
                
                const newPosition = particle.position.map((pos, i) => 
                    Math.max(-3, Math.min(3, pos + newVelocity[i]))
                );
                
                const fitness = fitnessFunction(newPosition);
                const pbest = fitness > particle.pbestFitness ? [...newPosition] : particle.pbest;
                const pbestFitness = fitness > particle.pbestFitness ? fitness : particle.pbestFitness;
                
                return {
                    ...particle,
                    position: newPosition,
                    velocity: newVelocity,
                    fitness,
                    pbest,
                    pbestFitness,
                    x: newPosition[0] * 50 + 200,
                    y: newPosition[1] * 50 + 150
                };
            });
            
            const newBest = Math.max(...newPop.map(p => p.fitness));
            setBestFitness(newBest);
            return newPop;
        });
        setGeneration(gen => gen + 1);
    }, [parameters.PSO]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        const width = 500;
        const height = 300;
        
        // Background
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#1f2937');
            
        // Draw individuals/particles
        population.forEach((individual, i) => {
            const color = algorithm === 'GA' 
                ? `hsl(${individual.fitness * 120}, 70%, 50%)`
                : `hsl(${individual.fitness * 240}, 70%, 50%)`;
                
            svg.append('circle')
                .attr('cx', individual.x)
                .attr('cy', individual.y)
                .attr('r', 6)
                .attr('fill', color)
                .attr('stroke', '#e5e7eb')
                .attr('stroke-width', 1);
                
            // Show chromosome/position info on hover
            svg.append('title')
                .text(algorithm === 'GA' 
                    ? `Chromosome: ${individual.chromosome.join('')}\nFitness: ${individual.fitness.toFixed(3)}`
                    : `Position: [${individual.position.map(x => x.toFixed(2)).join(', ')}]\nFitness: ${individual.fitness.toFixed(3)}`
                );
        });
        
    }, [population, algorithm]);

    useEffect(() => {
        initializePopulation();
    }, [initializePopulation]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                if (algorithm === 'GA') {
                    evolveGA();
                } else {
                    evolvePSO();
                }
            }, 200);
        }
        return () => clearInterval(interval);
    }, [isRunning, algorithm, evolveGA, evolvePSO]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Genetic Algorithm vs PSO Demo</h3>
            
            {/* Algorithm Selection */}
            <div className="mb-4">
                <label className="text-sm text-gray-300 mr-4">Algorithm:</label>
                <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1 rounded mr-4"
                    disabled={isRunning}
                >
                    <option value="GA">Genetic Algorithm</option>
                    <option value="PSO">Particle Swarm Optimization</option>
                </select>
                
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded font-semibold mr-2 ${
                        isRunning 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                    {isRunning ? 'Stop' : 'Start'} Evolution
                </button>
                
                <button
                    onClick={initializePopulation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                    Reset
                </button>
            </div>

            {/* Visualization */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <svg ref={svgRef} width={500} height={300}></svg>
            </div>

            {/* Status */}
            <div className="mb-4 text-white">
                <p>Generation: <span className="text-blue-400">{generation}</span></p>
                <p>Best Fitness: <span className="text-green-400">{bestFitness.toFixed(4)}</span></p>
                <p>Population Size: <span className="text-yellow-400">{population.length}</span></p>
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {algorithm === 'GA' ? (
                    <div>
                        <h4 className="text-white font-semibold mb-2">GA Parameters</h4>
                        <div className="space-y-2">
                            <div>
                                <label className="text-sm text-gray-300">
                                    Mutation Rate: {parameters.GA.mutationRate}
                                </label>
                                <input
                                    type="range"
                                    min="0.01"
                                    max="0.5"
                                    step="0.01"
                                    value={parameters.GA.mutationRate}
                                    onChange={(e) => setParameters(prev => ({
                                        ...prev,
                                        GA: {...prev.GA, mutationRate: parseFloat(e.target.value)}
                                    }))}
                                    className="w-full"
                                    disabled={isRunning}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">
                                    Crossover Rate: {parameters.GA.crossoverRate}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.1"
                                    value={parameters.GA.crossoverRate}
                                    onChange={(e) => setParameters(prev => ({
                                        ...prev,
                                        GA: {...prev.GA, crossoverRate: parseFloat(e.target.value)}
                                    }))}
                                    className="w-full"
                                    disabled={isRunning}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h4 className="text-white font-semibold mb-2">PSO Parameters</h4>
                        <div className="space-y-2">
                            <div>
                                <label className="text-sm text-gray-300">
                                    Inertia (w): {parameters.PSO.inertia}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.1"
                                    value={parameters.PSO.inertia}
                                    onChange={(e) => setParameters(prev => ({
                                        ...prev,
                                        PSO: {...prev.PSO, inertia: parseFloat(e.target.value)}
                                    }))}
                                    className="w-full"
                                    disabled={isRunning}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">
                                    Cognitive (c1): {parameters.PSO.cognitive}
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="3.0"
                                    step="0.1"
                                    value={parameters.PSO.cognitive}
                                    onChange={(e) => setParameters(prev => ({
                                        ...prev,
                                        PSO: {...prev.PSO, cognitive: parseFloat(e.target.value)}
                                    }))}
                                    className="w-full"
                                    disabled={isRunning}
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                <div>
                    <h4 className="text-white font-semibold mb-2">Algorithm Comparison</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                        <p><strong>GA Advantages:</strong></p>
                        <ul className="list-disc list-inside ml-2">
                            <li>Better exploration through crossover</li>
                            <li>Escapes local optima via mutation</li>
                            <li>Works with discrete problems</li>
                        </ul>
                        <p><strong>PSO Advantages:</strong></p>
                        <ul className="list-disc list-inside ml-2">
                            <li>Faster convergence</li>
                            <li>Fewer parameters to tune</li>
                            <li>Natural for continuous optimization</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Educational Notes */}
            <div className="bg-gray-700 p-4 rounded">
                <h4 className="text-white font-semibold mb-2">Key Differences:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                        <p><strong>Genetic Algorithm:</strong></p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Population-based discrete evolution</li>
                            <li>Selection, crossover, mutation operators</li>
                            <li>No individual memory of past success</li>
                            <li>Better for combinatorial problems</li>
                        </ul>
                    </div>
                    <div>
                        <p><strong>Particle Swarm Optimization:</strong></p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Continuous movement in search space</li>
                            <li>Personal and social learning</li>
                            <li>Each particle remembers best position</li>
                            <li>Better for numerical optimization</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Advanced Deep Learning Network Visualization - Practitioner Level
export const AdvancedDeepNetworkVisualization = () => {
    const svgRef = useRef();
    const [layers, setLayers] = useState([4, 8, 6, 4, 2]);
    const [learningRate, setLearningRate] = useState(0.01);
    const [activationFunction, setActivationFunction] = useState('relu');
    const [dropoutRate, setDropoutRate] = useState(0.2);
    const [isTraining, setIsTraining] = useState(false);
    const [epoch, setEpoch] = useState(0);
    const [loss, setLoss] = useState(1.0);
    const [accuracy, setAccuracy] = useState(0.5);
    const [gradientFlow, setGradientFlow] = useState([]);
    const [showGradients, setShowGradients] = useState(false);

    const activationFunctions = {
        relu: { fn: (x) => Math.max(0, x), color: '#3b82f6', derivative: (x) => x > 0 ? 1 : 0 },
        sigmoid: { fn: (x) => 1 / (1 + Math.exp(-x)), color: '#10b981', derivative: (x) => x * (1 - x) },
        tanh: { fn: (x) => Math.tanh(x), color: '#f59e0b', derivative: (x) => 1 - x * x },
        leaky_relu: { fn: (x) => x > 0 ? x : 0.01 * x, color: '#8b5cf6', derivative: (x) => x > 0 ? 1 : 0.01 }
    };

    const trainStep = useCallback(() => {
        if (!isTraining) return;

        setEpoch(prev => prev + 1);
        setLoss(prev => Math.max(0.01, prev * (0.995 + Math.random() * 0.01)));
        setAccuracy(prev => Math.min(0.99, prev + Math.random() * 0.002));

        const newGradients = layers.map((layerSize, layerIndex) => 
            Array(layerSize).fill(0).map(() => ({
                magnitude: Math.random() * 0.5 + 0.1,
                direction: Math.random() * 2 * Math.PI,
                layerIndex
            }))
        );
        setGradientFlow(newGradients);
    }, [isTraining, layers]);

    useEffect(() => {
        if (isTraining) {
            const interval = setInterval(trainStep, 100);
            return () => clearInterval(interval);
        }
    }, [isTraining, trainStep]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 900;
        const height = 500;
        svg.attr("width", width).attr("height", height);

        const defs = svg.append('defs');
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('markerWidth', 10)
            .attr('markerHeight', 7)
            .attr('refX', 9)
            .attr('refY', 3.5)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 10 3.5, 0 7')
            .attr('fill', '#ef4444');

        const layerSpacing = width / (layers.length + 1);
        
        layers.forEach((layerSize, layerIndex) => {
            const x = layerSpacing * (layerIndex + 1);
            const neuronSpacing = height / (layerSize + 1);
            
            if (layerIndex < layers.length - 1) {
                const nextLayerSize = layers[layerIndex + 1];
                const nextX = layerSpacing * (layerIndex + 2);
                
                for (let i = 0; i < layerSize; i++) {
                    for (let j = 0; j < nextLayerSize; j++) {
                        const y1 = neuronSpacing * (i + 1);
                        const y2 = neuronSpacing * (j + 1);
                        const strength = Math.random() * (1 - loss);
                        
                        svg.append('line')
                            .attr('x1', x).attr('y1', y1)
                            .attr('x2', nextX).attr('y2', y2)
                            .attr('stroke', activationFunctions[activationFunction].color)
                            .attr('stroke-width', strength * 2 + 0.5)
                            .attr('opacity', 0.3 + strength * 0.4)
                            .attr('stroke-dasharray', dropoutRate > Math.random() ? '3,3' : '0');
                    }
                }
            }
            
            for (let i = 0; i < layerSize; i++) {
                const y = neuronSpacing * (i + 1);
                const activation = Math.random();
                const isDropped = dropoutRate > Math.random() && isTraining;
                
                svg.append('circle')
                    .attr('cx', x).attr('cy', y).attr('r', 15)
                    .attr('fill', isDropped ? '#6b7280' : activationFunctions[activationFunction].color)
                    .attr('stroke', '#e5e7eb').attr('stroke-width', 2)
                    .attr('opacity', isDropped ? 0.3 : 0.8 + activation * 0.2);

                if (showGradients && gradientFlow[layerIndex] && gradientFlow[layerIndex][i]) {
                    const gradient = gradientFlow[layerIndex][i];
                    const arrowLength = gradient.magnitude * 30;
                    const endX = x + Math.cos(gradient.direction) * arrowLength;
                    const endY = y + Math.sin(gradient.direction) * arrowLength;
                    
                    svg.append('line')
                        .attr('x1', x).attr('y1', y)
                        .attr('x2', endX).attr('y2', endY)
                        .attr('stroke', '#ef4444').attr('stroke-width', 2)
                        .attr('marker-end', 'url(#arrowhead)').attr('opacity', 0.7);
                }
            }
            
            svg.append('text')
                .attr('x', x).attr('y', height - 20)
                .attr('text-anchor', 'middle').attr('fill', '#e5e7eb')
                .attr('font-size', '12px')
                .text(`Layer ${layerIndex + 1} (${layerSize})`);
        });

    }, [layers, activationFunction, dropoutRate, gradientFlow, showGradients, loss]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Advanced Deep Neural Network</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Network Architecture</h4>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Layers: {layers.join(' → ')}</label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setLayers(prev => [...prev.slice(0, -1), prev[prev.length - 1] + 1])}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                            >
                                Add Neuron
                            </button>
                            <button
                                onClick={() => setLayers(prev => prev.length < 6 ? [...prev, 3] : prev)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                            >
                                Add Layer
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Training Parameters</h4>
                    <div className="space-y-2">
                        <div>
                            <label className="text-sm text-gray-300">Learning Rate: {learningRate}</label>
                            <input type="range" min="0.001" max="0.1" step="0.001"
                                value={learningRate}
                                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                                className="w-full" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">Dropout Rate: {dropoutRate}</label>
                            <input type="range" min="0" max="0.5" step="0.05"
                                value={dropoutRate}
                                onChange={(e) => setDropoutRate(parseFloat(e.target.value))}
                                className="w-full" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">Activation Function</label>
                            <select value={activationFunction}
                                onChange={(e) => setActivationFunction(e.target.value)}
                                className="w-full bg-gray-600 text-white rounded px-2 py-1">
                                {Object.keys(activationFunctions).map(fn => (
                                    <option key={fn} value={fn}>{fn.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Training Status</h4>
                    <div className="space-y-2">
                        <div className="text-sm text-gray-300">
                            <p>Epoch: {epoch}</p>
                            <p>Loss: {loss.toFixed(4)}</p>
                            <p>Accuracy: {(accuracy * 100).toFixed(1)}%</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setIsTraining(!isTraining)}
                                className={`px-4 py-2 rounded text-white ${isTraining ? 'bg-red-600' : 'bg-green-600'}`}>
                                {isTraining ? 'Stop' : 'Start'} Training
                            </button>
                            <button onClick={() => setShowGradients(!showGradients)}
                                className={`px-4 py-2 rounded text-white ${showGradients ? 'bg-yellow-600' : 'bg-gray-600'}`}>
                                {showGradients ? 'Hide' : 'Show'} Gradients
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 p-4 rounded overflow-x-auto">
                <svg ref={svgRef}></svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Training Progress</h4>
                    <div className="space-y-2">
                        <div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Loss</span><span>{loss.toFixed(4)}</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                                <div className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.max(5, (1 - loss) * 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Accuracy</span><span>{(accuracy * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${accuracy * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Network Info</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                        <p>Total Parameters: {layers.reduce((total, current, index) => 
                            index === 0 ? current : total + current * layers[index - 1], 0).toLocaleString()}</p>
                        <p>Active Connections: {Math.round((1 - dropoutRate) * 100)}%</p>
                        <p>Gradient Flow: {showGradients ? 'Visible' : 'Hidden'}</p>
                        <p>Training Status: {isTraining ? 'Active' : 'Paused'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Advanced Reinforcement Learning Environment - Practitioner Level  
export const AdvancedRLEnvironment = () => {
    const canvasRef = useRef();
    const [environment, setEnvironment] = useState('gridworld');
    const [algorithm, setAlgorithm] = useState('q_learning');
    const [isTraining, setIsTraining] = useState(false);
    const [episode, setEpisode] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [epsilon, setEpsilon] = useState(0.9);
    const [learningRate, setLearningRate] = useState(0.1);
    const [discountFactor, setDiscountFactor] = useState(0.95);
    const [qTable, setQTable] = useState({});
    const [agentPosition, setAgentPosition] = useState({ x: 0, y: 0 });

    const environments = {
        gridworld: {
            size: { width: 10, height: 10 },
            goal: { x: 9, y: 9 },
            obstacles: [
                { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 },
                { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 },
                { x: 7, y: 6 }, { x: 8, y: 6 }
            ],
            rewards: { goal: 100, step: -1, obstacle: -50 }
        }
    };

    const actions = ['up', 'down', 'left', 'right'];
    const getStateKey = (pos) => `${pos.x},${pos.y}`;

    const getQValue = useCallback((state, action) => {
        return qTable[`${state}_${action}`] || 0;
    }, [qTable]);

    const updateQValue = useCallback((state, action, reward, nextState) => {
        const currentQ = getQValue(state, action);
        const maxNextQ = Math.max(...actions.map(a => getQValue(nextState, a)));
        const newQ = currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);
        
        setQTable(prev => ({ ...prev, [`${state}_${action}`]: newQ }));
    }, [getQValue, learningRate, discountFactor]);

    const selectAction = useCallback((state) => {
        if (Math.random() < epsilon) {
            return actions[Math.floor(Math.random() * actions.length)];
        } else {
            const qValues = actions.map(action => ({ action, q: getQValue(state, action) }));
            return qValues.reduce((best, current) => current.q > best.q ? current : best).action;
        }
    }, [epsilon, getQValue]);

    const moveAgent = useCallback((action) => {
        setAgentPosition(prev => {
            const env = environments[environment];
            let newPos = { ...prev };

            switch (action) {
                case 'up': newPos.y = Math.max(0, prev.y - 1); break;
                case 'down': newPos.y = Math.min(env.size.height - 1, prev.y + 1); break;
                case 'left': newPos.x = Math.max(0, prev.x - 1); break;
                case 'right': newPos.x = Math.min(env.size.width - 1, prev.x + 1); break;
            }

            let reward = env.rewards.step;
            const isGoal = newPos.x === env.goal.x && newPos.y === env.goal.y;
            const isObstacle = env.obstacles?.some(obs => obs.x === newPos.x && obs.y === newPos.y);

            if (isGoal) {
                reward = env.rewards.goal;
                setTotalReward(prev => prev + reward);
                setEpisode(prev => prev + 1);
                newPos = { x: 0, y: 0 };
            } else if (isObstacle) {
                reward = env.rewards.obstacle;
                newPos = prev;
            }

            setTotalReward(prev => prev + reward);

            if (algorithm === 'q_learning') {
                updateQValue(getStateKey(prev), action, reward, getStateKey(newPos));
            }

            return newPos;
        });
    }, [environment, algorithm, updateQValue]);

    const trainStep = useCallback(() => {
        if (!isTraining) return;
        const currentState = getStateKey(agentPosition);
        const action = selectAction(currentState);
        moveAgent(action);
        setEpsilon(prev => Math.max(0.01, prev * 0.995));
    }, [isTraining, agentPosition, selectAction, moveAgent]);

    useEffect(() => {
        if (isTraining) {
            const interval = setInterval(trainStep, 100);
            return () => clearInterval(interval);
        }
    }, [isTraining, trainStep]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const env = environments[environment];
        const cellSize = 30;

        canvas.width = env.size.width * cellSize;
        canvas.height = env.size.height * cellSize;

        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        for (let x = 0; x <= env.size.width; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= env.size.height; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(canvas.width, y * cellSize);
            ctx.stroke();
        }

        for (let x = 0; x < env.size.width; x++) {
            for (let y = 0; y < env.size.height; y++) {
                const state = getStateKey({ x, y });
                const maxQ = Math.max(...actions.map(a => getQValue(state, a)));
                
                if (maxQ !== 0) {
                    const intensity = Math.min(1, Math.abs(maxQ) / 50);
                    const color = maxQ > 0 ? `rgba(34, 197, 94, ${intensity * 0.5})` : `rgba(239, 68, 68, ${intensity * 0.5})`;
                    ctx.fillStyle = color;
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }

        if (env.obstacles) {
            ctx.fillStyle = '#7f1d1d';
            env.obstacles.forEach(obs => {
                ctx.fillRect(obs.x * cellSize, obs.y * cellSize, cellSize, cellSize);
            });
        }

        ctx.fillStyle = '#059669';
        ctx.fillRect(env.goal.x * cellSize, env.goal.y * cellSize, cellSize, cellSize);

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(
            agentPosition.x * cellSize + cellSize / 2,
            agentPosition.y * cellSize + cellSize / 2,
            cellSize / 3, 0, 2 * Math.PI
        );
        ctx.fill();

    }, [environment, agentPosition, qTable, getQValue]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Advanced Reinforcement Learning</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Environment</h4>
                    <select value={environment} onChange={(e) => setEnvironment(e.target.value)}
                        className="w-full bg-gray-600 text-white rounded px-2 py-1 mb-2" disabled={isTraining}>
                        <option value="gridworld">Grid World</option>
                    </select>
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
                        className="w-full bg-gray-600 text-white rounded px-2 py-1" disabled={isTraining}>
                        <option value="q_learning">Q-Learning</option>
                        <option value="sarsa">SARSA</option>
                        <option value="dqn">Deep Q-Network</option>
                    </select>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Hyperparameters</h4>
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs text-gray-300">Epsilon: {epsilon.toFixed(3)}</label>
                            <input type="range" min="0.01" max="1.0" step="0.01" value={epsilon}
                                onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                                className="w-full" disabled={isTraining} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-300">Learning Rate: {learningRate}</label>
                            <input type="range" min="0.01" max="0.5" step="0.01" value={learningRate}
                                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                                className="w-full" disabled={isTraining} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-300">Discount: {discountFactor}</label>
                            <input type="range" min="0.5" max="0.99" step="0.01" value={discountFactor}
                                onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
                                className="w-full" disabled={isTraining} />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Training Stats</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                        <p>Episode: {episode}</p>
                        <p>Total Reward: {totalReward.toFixed(0)}</p>
                        <p>Avg Reward: {episode > 0 ? (totalReward / episode).toFixed(1) : '0'}</p>
                        <p>Exploration: {(epsilon * 100).toFixed(1)}%</p>
                        <p>Q-entries: {Object.keys(qTable).length}</p>
                    </div>
                </div>

                <div className="bg-gray-700 p-4 rounded">
                    <h4 className="text-white font-semibold mb-2">Controls</h4>
                    <div className="space-y-2">
                        <button onClick={() => setIsTraining(!isTraining)}
                            className={`w-full px-4 py-2 rounded text-white ${isTraining ? 'bg-red-600' : 'bg-green-600'}`}>
                            {isTraining ? 'Stop' : 'Start'} Training
                        </button>
                        <button onClick={() => {
                                setQTable({}); setAgentPosition({ x: 0, y: 0 });
                                setTotalReward(0); setEpisode(0); setEpsilon(0.9);
                            }}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded" disabled={isTraining}>
                            Reset
                        </button>
                        <div className="flex space-x-1">
                            {actions.map(action => (
                                <button key={action} onClick={() => moveAgent(action)}
                                    className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs"
                                    disabled={isTraining}>
                                    {action[0].toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 p-4 rounded overflow-auto">
                <canvas ref={canvasRef} className="border border-gray-600"></canvas>
            </div>

            <div className="mt-4 bg-gray-700 p-4 rounded">
                <h4 className="text-white font-semibold mb-2">Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300">Agent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-600"></div>
                        <span className="text-gray-300">Goal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-900"></div>
                        <span className="text-gray-300">Obstacles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 opacity-50"></div>
                        <span className="text-gray-300">High Q-values</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Green areas indicate positive Q-values, red areas negative Q-values.
                    Agent uses ε-greedy policy with {(epsilon * 100).toFixed(1)}% exploration.
                </p>
            </div>
        </div>
    );
};

// ========================================
// ARCHITECT COURSE COMPONENTS
// ========================================

// System Architecture Visualization Component
export const SystemArchitectureVisualization = () => {
    const [architectureType, setArchitectureType] = useState('monolithic');
    const [dataFlow, setDataFlow] = useState(false);
    const svgRef = useRef();

    const architectures = {
        monolithic: {
            name: 'Monolithic Architecture',
            components: [
                { id: 'ui', name: 'UI Layer', x: 200, y: 50, width: 200, height: 80, color: '#3b82f6' },
                { id: 'business', name: 'Business Logic', x: 200, y: 150, width: 200, height: 80, color: '#10b981' },
                { id: 'data', name: 'Data Access', x: 200, y: 250, width: 200, height: 80, color: '#f59e0b' },
                { id: 'db', name: 'Database', x: 200, y: 350, width: 200, height: 80, color: '#ef4444' }
            ],
            connections: [
                { from: 'ui', to: 'business' },
                { from: 'business', to: 'data' },
                { from: 'data', to: 'db' }
            ]
        },
        microservices: {
            name: 'Microservices Architecture',
            components: [
                { id: 'gateway', name: 'API Gateway', x: 300, y: 50, width: 150, height: 60, color: '#8b5cf6' },
                { id: 'user', name: 'User Service', x: 100, y: 150, width: 120, height: 80, color: '#3b82f6' },
                { id: 'order', name: 'Order Service', x: 280, y: 150, width: 120, height: 80, color: '#10b981' },
                { id: 'payment', name: 'Payment Service', x: 460, y: 150, width: 120, height: 80, color: '#f59e0b' },
                { id: 'userdb', name: 'User DB', x: 100, y: 280, width: 120, height: 60, color: '#ef4444' },
                { id: 'orderdb', name: 'Order DB', x: 280, y: 280, width: 120, height: 60, color: '#ef4444' },
                { id: 'paymentdb', name: 'Payment DB', x: 460, y: 280, width: 120, height: 60, color: '#ef4444' }
            ],
            connections: [
                { from: 'gateway', to: 'user' },
                { from: 'gateway', to: 'order' },
                { from: 'gateway', to: 'payment' },
                { from: 'user', to: 'userdb' },
                { from: 'order', to: 'orderdb' },
                { from: 'payment', to: 'paymentdb' }
            ]
        },
        serverless: {
            name: 'Serverless Architecture',
            components: [
                { id: 'client', name: 'Client App', x: 50, y: 100, width: 120, height: 60, color: '#3b82f6' },
                { id: 'cdn', name: 'CDN', x: 50, y: 200, width: 120, height: 60, color: '#8b5cf6' },
                { id: 'lambda1', name: 'Auth Function', x: 250, y: 80, width: 120, height: 60, color: '#10b981' },
                { id: 'lambda2', name: 'API Function', x: 250, y: 160, width: 120, height: 60, color: '#10b981' },
                { id: 'lambda3', name: 'Process Function', x: 250, y: 240, width: 120, height: 60, color: '#10b981' },
                { id: 'dynamo', name: 'DynamoDB', x: 450, y: 120, width: 120, height: 60, color: '#ef4444' },
                { id: 's3', name: 'S3 Storage', x: 450, y: 200, width: 120, height: 60, color: '#f59e0b' }
            ],
            connections: [
                { from: 'client', to: 'lambda1' },
                { from: 'client', to: 'lambda2' },
                { from: 'cdn', to: 'lambda3' },
                { from: 'lambda1', to: 'dynamo' },
                { from: 'lambda2', to: 'dynamo' },
                { from: 'lambda3', to: 's3' }
            ]
        }
    };

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const currentArch = architectures[architectureType];
        
        // Draw connections
        const connections = svg.selectAll('.connection')
            .data(currentArch.connections)
            .enter()
            .append('line')
            .attr('class', 'connection')
            .attr('x1', d => {
                const from = currentArch.components.find(c => c.id === d.from);
                return from.x + from.width / 2;
            })
            .attr('y1', d => {
                const from = currentArch.components.find(c => c.id === d.from);
                return from.y + from.height;
            })
            .attr('x2', d => {
                const to = currentArch.components.find(c => c.id === d.to);
                return to.x + to.width / 2;
            })
            .attr('y2', d => {
                const to = currentArch.components.find(c => c.id === d.to);
                return to.y;
            })
            .attr('stroke', '#6b7280')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');

        // Add arrowhead marker
        svg.append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#6b7280');

        // Draw components
        const components = svg.selectAll('.component')
            .data(currentArch.components)
            .enter()
            .append('g')
            .attr('class', 'component');

        components.append('rect')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('fill', d => d.color)
            .attr('rx', 8)
            .attr('opacity', 0.8);

        components.append('text')
            .attr('x', d => d.x + d.width / 2)
            .attr('y', d => d.y + d.height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => d.name);

        // Add data flow animation
        if (dataFlow) {
            const animateDataFlow = () => {
                currentArch.connections.forEach((conn, index) => {
                    setTimeout(() => {
                        const from = currentArch.components.find(c => c.id === conn.from);
                        const to = currentArch.components.find(c => c.id === conn.to);
                        
                        const circle = svg.append('circle')
                            .attr('cx', from.x + from.width / 2)
                            .attr('cy', from.y + from.height)
                            .attr('r', 4)
                            .attr('fill', '#fbbf24')
                            .attr('opacity', 0.8);

                        circle.transition()
                            .duration(1000)
                            .attr('cx', to.x + to.width / 2)
                            .attr('cy', to.y)
                            .on('end', () => circle.remove());
                    }, index * 200);
                });
            };

            const interval = setInterval(animateDataFlow, 2000);
            animateDataFlow();

            return () => clearInterval(interval);
        }
    }, [architectureType, dataFlow]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">System Architecture Visualization</h3>
            
            <div className="mb-4 flex gap-4">
                {Object.entries(architectures).map(([key, arch]) => (
                    <button
                        key={key}
                        onClick={() => setArchitectureType(key)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            architectureType === key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {arch.name}
                    </button>
                ))}
            </div>

            <div className="mb-4">
                <label className="flex items-center text-white">
                    <input
                        type="checkbox"
                        checked={dataFlow}
                        onChange={(e) => setDataFlow(e.target.checked)}
                        className="mr-2"
                    />
                    Show Data Flow Animation
                </label>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
                <svg
                    ref={svgRef}
                    width="650"
                    height="400"
                    className="w-full h-auto"
                />
            </div>

            <div className="mt-4 text-sm text-gray-300">
                <p><strong>Current:</strong> {architectures[architectureType].name}</p>
                <p className="mt-2">
                    {architectureType === 'monolithic' && 'Single deployable unit with tight coupling between components.'}
                    {architectureType === 'microservices' && 'Distributed services with independent deployment and scaling.'}
                    {architectureType === 'serverless' && 'Event-driven functions with automatic scaling and pay-per-use pricing.'}
                </p>
            </div>
        </div>
    );
};

// Distributed System Animation Component
export const DistributedSystemAnimation = () => {
    const [algorithm, setAlgorithm] = useState('raft');
    const [isRunning, setIsRunning] = useState(false);
    const [step, setStep] = useState(0);
    const svgRef = useRef();

    const algorithms = {
        raft: {
            name: 'Raft Consensus',
            nodes: [
                { id: 'leader', name: 'Leader', x: 300, y: 100, state: 'leader', color: '#10b981' },
                { id: 'follower1', name: 'Follower 1', x: 150, y: 200, state: 'follower', color: '#3b82f6' },
                { id: 'follower2', name: 'Follower 2', x: 450, y: 200, state: 'follower', color: '#3b82f6' },
                { id: 'follower3', name: 'Follower 3', x: 200, y: 300, state: 'follower', color: '#3b82f6' },
                { id: 'follower4', name: 'Follower 4', x: 400, y: 300, state: 'follower', color: '#3b82f6' }
            ],
            steps: [
                'Leader sends heartbeat to followers',
                'Followers acknowledge heartbeat',
                'Client sends request to leader',
                'Leader replicates log entry',
                'Majority acknowledges replication',
                'Leader commits entry and responds'
            ]
        },
        gossip: {
            name: 'Gossip Protocol',
            nodes: [
                { id: 'node1', name: 'Node 1', x: 300, y: 100, state: 'active', color: '#8b5cf6' },
                { id: 'node2', name: 'Node 2', x: 150, y: 200, state: 'active', color: '#8b5cf6' },
                { id: 'node3', name: 'Node 3', x: 450, y: 200, state: 'active', color: '#8b5cf6' },
                { id: 'node4', name: 'Node 4', x: 200, y: 300, state: 'active', color: '#8b5cf6' },
                { id: 'node5', name: 'Node 5', x: 400, y: 300, state: 'active', color: '#8b5cf6' }
            ],
            steps: [
                'Node 1 receives new information',
                'Node 1 gossips to random neighbors',
                'Neighbors propagate to their neighbors',
                'Information spreads exponentially',
                'All nodes eventually receive information',
                'System reaches consistency'
            ]
        },
        byzantine: {
            name: 'Byzantine Fault Tolerance',
            nodes: [
                { id: 'general1', name: 'General 1', x: 300, y: 80, state: 'honest', color: '#10b981' },
                { id: 'general2', name: 'General 2', x: 150, y: 180, state: 'honest', color: '#10b981' },
                { id: 'general3', name: 'General 3', x: 450, y: 180, state: 'byzantine', color: '#ef4444' },
                { id: 'general4', name: 'General 4', x: 200, y: 280, state: 'honest', color: '#10b981' },
                { id: 'general5', name: 'General 5', x: 400, y: 280, state: 'honest', color: '#10b981' }
            ],
            steps: [
                'Generals propose attack/retreat',
                'Byzantine general sends conflicting messages',
                'Honest generals exchange messages',
                'Majority voting determines consensus',
                'Honest nodes ignore Byzantine messages',
                'Consensus achieved despite fault'
            ]
        }
    };

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const currentAlg = algorithms[algorithm];
        
        // Draw connections between all nodes
        const connections = [];
        for (let i = 0; i < currentAlg.nodes.length; i++) {
            for (let j = i + 1; j < currentAlg.nodes.length; j++) {
                connections.push({
                    from: currentAlg.nodes[i],
                    to: currentAlg.nodes[j]
                });
            }
        }

        svg.selectAll('.connection')
            .data(connections)
            .enter()
            .append('line')
            .attr('class', 'connection')
            .attr('x1', d => d.from.x)
            .attr('y1', d => d.from.y)
            .attr('x2', d => d.to.x)
            .attr('y2', d => d.to.y)
            .attr('stroke', '#374151')
            .attr('stroke-width', 1)
            .attr('opacity', 0.3);

        // Draw nodes
        const nodes = svg.selectAll('.node')
            .data(currentAlg.nodes)
            .enter()
            .append('g')
            .attr('class', 'node');

        nodes.append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 30)
            .attr('fill', d => d.color)
            .attr('stroke', '#1f2937')
            .attr('stroke-width', 2);

        nodes.append('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .text(d => d.name);

        // Add state labels
        nodes.append('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y + 45)
            .attr('text-anchor', 'middle')
            .attr('fill', '#9ca3af')
            .attr('font-size', '8px')
            .text(d => d.state);

    }, [algorithm]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setStep(prev => (prev + 1) % algorithms[algorithm].steps.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isRunning, algorithm]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Distributed System Algorithms</h3>
            
            <div className="mb-4 flex gap-4">
                {Object.entries(algorithms).map(([key, alg]) => (
                    <button
                        key={key}
                        onClick={() => {
                            setAlgorithm(key);
                            setStep(0);
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            algorithm === key
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {alg.name}
                    </button>
                ))}
            </div>

            <div className="mb-4">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        isRunning
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                    {isRunning ? 'Stop Animation' : 'Start Animation'}
                </button>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <svg
                    ref={svgRef}
                    width="600"
                    height="400"
                    className="w-full h-auto"
                />
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-bold text-white mb-2">Algorithm Steps:</h4>
                <div className="space-y-2">
                    {algorithms[algorithm].steps.map((stepText, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded transition-colors ${
                                index === step && isRunning
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-300'
                            }`}
                        >
                            <span className="font-medium">{index + 1}.</span> {stepText}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Scalability Demonstration Component
export const ScalabilityDemonstration = () => {
    const [scalingType, setScalingType] = useState('horizontal');
    const [load, setLoad] = useState(50);
    const [servers, setServers] = useState([{ id: 1, cpu: 50, memory: 60, load: 50 }]);
    const [isAutoScaling, setIsAutoScaling] = useState(false);

    const metrics = {
        totalRequests: servers.reduce((sum, server) => sum + server.load * 10, 0),
        avgResponseTime: Math.max(50, Math.min(500, load * 2 + Math.random() * 50)),
        throughput: servers.length * Math.max(0, 100 - load) * 2,
        cost: servers.length * (scalingType === 'horizontal' ? 50 : 100)
    };

    const handleLoadChange = (newLoad) => {
        setLoad(newLoad);
        
        if (scalingType === 'vertical') {
            // Vertical scaling - upgrade existing servers
            setServers(prevServers => 
                prevServers.map(server => ({
                    ...server,
                    cpu: Math.min(100, newLoad + Math.random() * 20),
                    memory: Math.min(100, newLoad + Math.random() * 15),
                    load: newLoad
                }))
            );
        } else {
            // Horizontal scaling
            if (isAutoScaling) {
                const optimalServers = Math.max(1, Math.ceil(newLoad / 70));
                const currentServers = servers.length;
                
                if (optimalServers > currentServers) {
                    // Scale out
                    const newServers = [];
                    for (let i = currentServers + 1; i <= optimalServers; i++) {
                        newServers.push({
                            id: i,
                            cpu: newLoad / optimalServers + Math.random() * 10,
                            memory: newLoad / optimalServers + Math.random() * 15,
                            load: newLoad / optimalServers
                        });
                    }
                    setServers(prev => [...prev, ...newServers]);
                } else if (optimalServers < currentServers && optimalServers >= 1) {
                    // Scale in
                    setServers(prev => prev.slice(0, optimalServers));
                }
            }
            
            // Update existing servers
            setServers(prevServers => 
                prevServers.map(server => ({
                    ...server,
                    cpu: Math.min(100, newLoad / prevServers.length + Math.random() * 15),
                    memory: Math.min(100, newLoad / prevServers.length + Math.random() * 10),
                    load: newLoad / prevServers.length
                }))
            );
        }
    };

    const addServer = () => {
        if (scalingType === 'horizontal') {
            const newServer = {
                id: servers.length + 1,
                cpu: load / (servers.length + 1) + Math.random() * 10,
                memory: load / (servers.length + 1) + Math.random() * 15,
                load: load / (servers.length + 1)
            };
            setServers(prev => [...prev, newServer]);
        }
    };

    const removeServer = () => {
        if (servers.length > 1) {
            setServers(prev => prev.slice(0, -1));
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Scalability Demonstration</h3>
            
            <div className="mb-6 flex gap-4">
                <button
                    onClick={() => setScalingType('horizontal')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        scalingType === 'horizontal'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Horizontal Scaling
                </button>
                <button
                    onClick={() => setScalingType('vertical')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        scalingType === 'vertical'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Vertical Scaling
                </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white mb-2">System Load: {load}%</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={load}
                        onChange={(e) => handleLoadChange(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
                
                {scalingType === 'horizontal' && (
                    <div className="flex items-center">
                        <label className="flex items-center text-white">
                            <input
                                type="checkbox"
                                checked={isAutoScaling}
                                onChange={(e) => setIsAutoScaling(e.target.checked)}
                                className="mr-2"
                            />
                            Auto Scaling
                        </label>
                    </div>
                )}
            </div>

            {/* Metrics Dashboard */}
            <div className="mb-6 grid grid-cols-4 gap-4">
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{Math.round(metrics.totalRequests)}</div>
                    <div className="text-sm text-gray-300">Total Requests/sec</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">{Math.round(metrics.avgResponseTime)}ms</div>
                    <div className="text-sm text-gray-300">Avg Response Time</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">{Math.round(metrics.throughput)}</div>
                    <div className="text-sm text-gray-300">Throughput</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">${metrics.cost}</div>
                    <div className="text-sm text-gray-300">Cost/hour</div>
                </div>
            </div>

            {/* Server Controls */}
            {scalingType === 'horizontal' && !isAutoScaling && (
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={addServer}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                        Add Server
                    </button>
                    <button
                        onClick={removeServer}
                        disabled={servers.length <= 1}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Remove Server
                    </button>
                </div>
            )}

            {/* Server Visualization */}
            <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="text-white font-bold mb-4">
                    {scalingType === 'horizontal' ? 'Server Farm' : 'Server Resources'} 
                    ({servers.length} server{servers.length !== 1 ? 's' : ''})
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {servers.map((server) => (
                        <div key={server.id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="text-white font-medium mb-3">
                                Server {server.id}
                                {scalingType === 'vertical' && servers.length === 1 && (
                                    <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">
                                        Upgraded
                                    </span>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">CPU</span>
                                        <span className="text-gray-300">{Math.round(server.cpu)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                server.cpu > 80 ? 'bg-red-500' : 
                                                server.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(100, server.cpu)}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Memory</span>
                                        <span className="text-gray-300">{Math.round(server.memory)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                server.memory > 80 ? 'bg-red-500' : 
                                                server.memory > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${Math.min(100, server.memory)}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Load</span>
                                        <span className="text-gray-300">{Math.round(server.load)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-purple-500 transition-all duration-500"
                                            style={{ width: `${Math.min(100, server.load)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-300">
                <p>
                    <strong>{scalingType === 'horizontal' ? 'Horizontal' : 'Vertical'} Scaling:</strong>{' '}
                    {scalingType === 'horizontal' 
                        ? 'Adding more servers to handle increased load. Better fault tolerance but more complex management.'
                        : 'Upgrading server resources (CPU, RAM) to handle increased load. Simpler but has limits and single point of failure.'
                    }
                </p>
            </div>
        </div>
    );
};

// Performance Optimization Tools Component
export const PerformanceOptimizationTools = () => {
    const [activeTab, setActiveTab] = useState('cpu');
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [metrics, setMetrics] = useState({
        cpu: { usage: 45, cores: [23, 67, 45, 34], temperature: 68 },
        memory: { used: 65, available: 16, swap: 12, cached: 23 },
        network: { inbound: 120, outbound: 89, connections: 234, latency: 45 },
        disk: { read: 45, write: 23, usage: 78, iops: 1250 }
    });
    const [optimizations, setOptimizations] = useState([]);

    // Simulate real-time metrics updates
    useEffect(() => {
        if (!isMonitoring) return;

        const interval = setInterval(() => {
            setMetrics(prev => ({
                cpu: {
                    usage: Math.max(0, Math.min(100, prev.cpu.usage + (Math.random() - 0.5) * 10)),
                    cores: prev.cpu.cores.map(core => 
                        Math.max(0, Math.min(100, core + (Math.random() - 0.5) * 15))
                    ),
                    temperature: Math.max(30, Math.min(90, prev.cpu.temperature + (Math.random() - 0.5) * 5))
                },
                memory: {
                    used: Math.max(0, Math.min(100, prev.memory.used + (Math.random() - 0.5) * 8)),
                    available: Math.max(0, 32 - (prev.memory.used * 0.32)),
                    swap: Math.max(0, Math.min(50, prev.memory.swap + (Math.random() - 0.5) * 3)),
                    cached: Math.max(0, Math.min(40, prev.memory.cached + (Math.random() - 0.5) * 5))
                },
                network: {
                    inbound: Math.max(0, prev.network.inbound + (Math.random() - 0.5) * 30),
                    outbound: Math.max(0, prev.network.outbound + (Math.random() - 0.5) * 25),
                    connections: Math.max(0, prev.network.connections + Math.floor((Math.random() - 0.5) * 20)),
                    latency: Math.max(1, prev.network.latency + (Math.random() - 0.5) * 10)
                },
                disk: {
                    read: Math.max(0, prev.disk.read + (Math.random() - 0.5) * 20),
                    write: Math.max(0, prev.disk.write + (Math.random() - 0.5) * 15),
                    usage: Math.max(0, Math.min(100, prev.disk.usage + (Math.random() - 0.5) * 2)),
                    iops: Math.max(0, prev.disk.iops + Math.floor((Math.random() - 0.5) * 200))
                }
            }));

            // Generate optimization suggestions based on metrics
            const newOptimizations = [];
            if (metrics.cpu.usage > 80) {
                newOptimizations.push({
                    type: 'warning',
                    title: 'High CPU Usage',
                    description: 'Consider optimizing CPU-intensive operations or scaling up',
                    action: 'Optimize Code'
                });
            }
            if (metrics.memory.used > 85) {
                newOptimizations.push({
                    type: 'error',
                    title: 'Memory Pressure',
                    description: 'Memory usage is critically high. Check for memory leaks',
                    action: 'Analyze Memory'
                });
            }
            if (metrics.network.latency > 100) {
                newOptimizations.push({
                    type: 'warning',
                    title: 'High Network Latency',
                    description: 'Network performance is degraded. Check network configuration',
                    action: 'Optimize Network'
                });
            }
            
            setOptimizations(newOptimizations.slice(0, 3)); // Keep only top 3
        }, 1000);

        return () => clearInterval(interval);
    }, [isMonitoring, metrics]);

    const tabs = {
        cpu: {
            name: 'CPU Profiler',
            icon: '🖥️',
            component: (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Overall CPU Usage</h4>
                            <div className="text-3xl font-bold text-blue-400 mb-2">{Math.round(metrics.cpu.usage)}%</div>
                            <div className="w-full bg-gray-600 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                        metrics.cpu.usage > 80 ? 'bg-red-500' : 
                                        metrics.cpu.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${metrics.cpu.usage}%` }}
                                />
                            </div>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Temperature</h4>
                            <div className="text-3xl font-bold text-orange-400 mb-2">{Math.round(metrics.cpu.temperature)}°C</div>
                            <div className="text-sm text-gray-300">
                                {metrics.cpu.temperature > 75 ? 'Running Hot' : 'Normal'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-3">Core Usage</h4>
                        <div className="space-y-2">
                            {metrics.cpu.cores.map((usage, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <span className="text-gray-300 w-16">Core {index + 1}</span>
                                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                usage > 80 ? 'bg-red-500' : 
                                                usage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${usage}%` }}
                                        />
                                    </div>
                                    <span className="text-gray-300 w-12 text-right">{Math.round(usage)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        memory: {
            name: 'Memory Analyzer',
            icon: '🧠',
            component: (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Memory Usage</h4>
                            <div className="text-3xl font-bold text-purple-400 mb-2">{Math.round(metrics.memory.used)}%</div>
                            <div className="text-sm text-gray-300">{Math.round(metrics.memory.available)}GB Available</div>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Swap Usage</h4>
                            <div className="text-3xl font-bold text-yellow-400 mb-2">{Math.round(metrics.memory.swap)}%</div>
                            <div className="text-sm text-gray-300">
                                {metrics.memory.swap > 50 ? 'High Swap Usage' : 'Normal'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-3">Memory Breakdown</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Used</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-600 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-purple-500 transition-all duration-500"
                                            style={{ width: `${metrics.memory.used}%` }}
                                        />
                                    </div>
                                    <span className="text-white w-12 text-right">{Math.round(metrics.memory.used)}%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Cached</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-600 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${metrics.memory.cached}%` }}
                                        />
                                    </div>
                                    <span className="text-white w-12 text-right">{Math.round(metrics.memory.cached)}%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Swap</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-600 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-yellow-500 transition-all duration-500"
                                            style={{ width: `${metrics.memory.swap}%` }}
                                        />
                                    </div>
                                    <span className="text-white w-12 text-right">{Math.round(metrics.memory.swap)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        network: {
            name: 'Network Monitor',
            icon: '🌐',
            component: (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Inbound Traffic</h4>
                            <div className="text-3xl font-bold text-green-400 mb-2">{Math.round(metrics.network.inbound)} MB/s</div>
                            <div className="text-sm text-gray-300">Download Speed</div>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Outbound Traffic</h4>
                            <div className="text-3xl font-bold text-red-400 mb-2">{Math.round(metrics.network.outbound)} MB/s</div>
                            <div className="text-sm text-gray-300">Upload Speed</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Active Connections</h4>
                            <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.network.connections}</div>
                            <div className="text-sm text-gray-300">TCP Connections</div>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Latency</h4>
                            <div className="text-3xl font-bold text-orange-400 mb-2">{Math.round(metrics.network.latency)}ms</div>
                            <div className="text-sm text-gray-300">
                                {metrics.network.latency > 100 ? 'High Latency' : 'Good'}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        bottlenecks: {
            name: 'Bottleneck Detector',
            icon: '🔍',
            component: (
                <div className="space-y-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-3">Performance Issues</h4>
                        {optimizations.length > 0 ? (
                            <div className="space-y-3">
                                {optimizations.map((opt, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg border-l-4 ${
                                            opt.type === 'error' 
                                                ? 'bg-red-900 border-red-500' 
                                                : 'bg-yellow-900 border-yellow-500'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="text-white font-medium">{opt.title}</h5>
                                                <p className="text-gray-300 text-sm mt-1">{opt.description}</p>
                                            </div>
                                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                                                {opt.action}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">✅</div>
                                <p className="text-green-400 font-medium">No Performance Issues Detected</p>
                                <p className="text-gray-400 text-sm">Your system is running optimally</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-3">System Health Score</h4>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <div className="w-full bg-gray-600 rounded-full h-4">
                                    <div
                                        className={`h-4 rounded-full transition-all duration-500 ${
                                            optimizations.length === 0 ? 'bg-green-500' :
                                            optimizations.length <= 2 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ 
                                            width: `${Math.max(20, 100 - optimizations.length * 25)}%` 
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {Math.max(20, 100 - optimizations.length * 25)}%
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Performance Optimization Tools</h3>
                <button
                    onClick={() => setIsMonitoring(!isMonitoring)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        isMonitoring
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                    {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </button>
            </div>
            
            <div className="mb-6 flex gap-2 overflow-x-auto">
                {Object.entries(tabs).map(([key, tab]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-2 ${
                            activeTab === key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
                {tabs[activeTab].component}
            </div>

            {isMonitoring && (
                <div className="mt-4 text-sm text-gray-400 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live monitoring active - metrics update every second</span>
                </div>
            )}
        </div>
    );
};