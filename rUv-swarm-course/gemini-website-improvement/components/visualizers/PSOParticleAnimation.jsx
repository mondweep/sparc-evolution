import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PSOParticleAnimation = () => {
    const svgRef = useRef();
    const animationRef = useRef();
    const [isRunning, setIsRunning] = useState(false);
    const [iteration, setIteration] = useState(0);
    const [particles, setParticles] = useState([]);
    const [globalBest, setGlobalBest] = useState({ x: 300, y: 200, fitness: 0 });
    const [parameters, setParameters] = useState({
        swarmSize: 20,
        inertia: 0.7,
        cognitive: 1.5,
        social: 1.5,
        speed: 1
    });

    // Optimization function (2D function to minimize)
    const fitnessFunction = (x, y) => {
        // Rastrigin function - multiple local minima
        const A = 10;
        const n = 2;
        const term1 = A * n;
        const term2 = (x * x - A * Math.cos(2 * Math.PI * x));
        const term3 = (y * y - A * Math.cos(2 * Math.PI * y));
        return -(term1 + term2 + term3); // Negative for maximization
    };

    // Initialize particles
    const initializeParticles = () => {
        const newParticles = [];
        let bestFitness = -Infinity;
        let bestPosition = { x: 300, y: 200 };

        for (let i = 0; i < parameters.swarmSize; i++) {
            const x = Math.random() * 500 + 50;
            const y = Math.random() * 300 + 50;
            const fitness = fitnessFunction(x, y);
            
            const particle = {
                id: i,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                fitness: fitness,
                bestX: x,
                bestY: y,
                bestFitness: fitness,
                trail: [{ x, y }]
            };
            
            if (fitness > bestFitness) {
                bestFitness = fitness;
                bestPosition = { x, y };
            }
            
            newParticles.push(particle);
        }
        
        setGlobalBest({ ...bestPosition, fitness: bestFitness });
        setParticles(newParticles);
        setIteration(0);
    };

    // PSO update step
    const updateParticles = () => {
        setParticles(prevParticles => {
            let newGlobalBest = globalBest;
            
            const updatedParticles = prevParticles.map(particle => {
                // Update velocity
                const r1 = Math.random();
                const r2 = Math.random();
                
                const cognitiveComponent = parameters.cognitive * r1 * (particle.bestX - particle.x);
                const socialComponent = parameters.social * r2 * (globalBest.x - particle.x);
                
                const newVx = parameters.inertia * particle.vx + cognitiveComponent + socialComponent;
                const newVy = parameters.inertia * particle.vy + 
                            parameters.cognitive * r1 * (particle.bestY - particle.y) +
                            parameters.social * r2 * (globalBest.y - particle.y);
                
                // Update position
                let newX = particle.x + newVx * parameters.speed;
                let newY = particle.y + newVy * parameters.speed;
                
                // Boundary constraints
                newX = Math.max(25, Math.min(575, newX));
                newY = Math.max(25, Math.min(375, newY));
                
                // Evaluate fitness
                const fitness = fitnessFunction(newX, newY);
                
                // Update personal best
                let bestX = particle.bestX;
                let bestY = particle.bestY;
                let bestFitness = particle.bestFitness;
                
                if (fitness > bestFitness) {
                    bestX = newX;
                    bestY = newY;
                    bestFitness = fitness;
                }
                
                // Update global best
                if (fitness > newGlobalBest.fitness) {
                    newGlobalBest = { x: newX, y: newY, fitness };
                }
                
                // Update trail (keep last 10 positions)
                const newTrail = [...particle.trail, { x: newX, y: newY }];
                if (newTrail.length > 10) {
                    newTrail.shift();
                }
                
                return {
                    ...particle,
                    x: newX,
                    y: newY,
                    vx: newVx,
                    vy: newVy,
                    fitness,
                    bestX,
                    bestY,
                    bestFitness,
                    trail: newTrail
                };
            });
            
            setGlobalBest(newGlobalBest);
            return updatedParticles;
        });
    };

    // Animation loop
    useEffect(() => {
        if (isRunning) {
            animationRef.current = setInterval(() => {
                updateParticles();
                setIteration(prev => prev + 1);
            }, 100);
        } else {
            clearInterval(animationRef.current);
        }
        
        return () => clearInterval(animationRef.current);
    }, [isRunning, parameters]);

    // D3 visualization
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        const width = 600;
        const height = 400;
        svg.attr("width", width).attr("height", height);
        
        // Create background gradient to show fitness landscape
        const defs = svg.append("defs");
        const gradient = defs.append("radialGradient")
            .attr("id", "fitnessGradient")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%");
        
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#22c55e")
            .attr("stop-opacity", 0.3);
        
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#dc2626")
            .attr("stop-opacity", 0.1);
        
        // Background
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "url(#fitnessGradient)");
        
        // Draw particles
        particles.forEach(particle => {
            // Draw trail
            if (particle.trail.length > 1) {
                const line = d3.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .curve(d3.curveCardinal);
                
                svg.append("path")
                    .datum(particle.trail)
                    .attr("fill", "none")
                    .attr("stroke", "#64748b")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.4)
                    .attr("d", line);
            }
            
            // Draw particle
            svg.append("circle")
                .attr("cx", particle.x)
                .attr("cy", particle.y)
                .attr("r", 4)
                .attr("fill", "#3b82f6")
                .attr("opacity", 0.8);
            
            // Draw velocity vector
            svg.append("line")
                .attr("x1", particle.x)
                .attr("y1", particle.y)
                .attr("x2", particle.x + particle.vx * 10)
                .attr("y2", particle.y + particle.vy * 10)
                .attr("stroke", "#06b6d4")
                .attr("stroke-width", 1)
                .attr("opacity", 0.6);
        });
        
        // Draw global best
        svg.append("circle")
            .attr("cx", globalBest.x)
            .attr("cy", globalBest.y)
            .attr("r", 8)
            .attr("fill", "#f59e0b")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2);
        
        // Global best label
        svg.append("text")
            .attr("x", globalBest.x)
            .attr("y", globalBest.y - 15)
            .attr("text-anchor", "middle")
            .attr("fill", "#f59e0b")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .text("Global Best");
        
    }, [particles, globalBest]);

    // Initialize on mount
    useEffect(() => {
        initializeParticles();
    }, [parameters.swarmSize]);

    const toggleAnimation = () => {
        setIsRunning(!isRunning);
    };

    const resetAnimation = () => {
        setIsRunning(false);
        initializeParticles();
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6">
            <h3 className="text-xl font-bold text-white mb-4">PSO Particle Movement Animation</h3>
            
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow">
                    <svg ref={svgRef} className="border border-gray-700 rounded-lg" />
                    
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={toggleAnimation}
                            className={`px-4 py-2 rounded font-semibold ${
                                isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                        >
                            {isRunning ? 'Pause' : 'Start'} Animation
                        </button>
                        <button
                            onClick={resetAnimation}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                        >
                            Reset
                        </button>
                    </div>
                </div>
                
                <div className="w-full lg:w-80 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">PSO Parameters</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Swarm Size: {parameters.swarmSize}
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={parameters.swarmSize}
                                onChange={(e) => setParameters(prev => ({ ...prev, swarmSize: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Inertia Weight: {parameters.inertia.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1.0"
                                step="0.05"
                                value={parameters.inertia}
                                onChange={(e) => setParameters(prev => ({ ...prev, inertia: parseFloat(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Cognitive Weight: {parameters.cognitive.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="3.0"
                                step="0.1"
                                value={parameters.cognitive}
                                onChange={(e) => setParameters(prev => ({ ...prev, cognitive: parseFloat(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Social Weight: {parameters.social.toFixed(2)}
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="3.0"
                                step="0.1"
                                value={parameters.social}
                                onChange={(e) => setParameters(prev => ({ ...prev, social: parseFloat(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Animation Speed: {parameters.speed.toFixed(1)}x
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="3.0"
                                step="0.1"
                                value={parameters.speed}
                                onChange={(e) => setParameters(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 space-y-2 text-sm">
                        <div className="text-gray-300">
                            <span className="font-semibold">Iteration:</span> {iteration}
                        </div>
                        <div className="text-gray-300">
                            <span className="font-semibold">Global Best Fitness:</span> {globalBest.fitness.toFixed(4)}
                        </div>
                        <div className="text-gray-300">
                            <span className="font-semibold">Best Position:</span> ({globalBest.x.toFixed(1)}, {globalBest.y.toFixed(1)})
                        </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-400">
                        <p><span className="w-3 h-3 bg-blue-500 inline-block rounded-full mr-2"></span>Particles</p>
                        <p><span className="w-3 h-3 bg-yellow-500 inline-block rounded-full mr-2"></span>Global Best</p>
                        <p><span className="w-3 h-3 bg-cyan-500 inline-block rounded-full mr-2"></span>Velocity Vectors</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PSOParticleAnimation;