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