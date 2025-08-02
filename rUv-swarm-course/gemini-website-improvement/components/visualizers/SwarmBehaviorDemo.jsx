import React, { useState, useEffect, useRef } from 'react';

const SwarmBehaviorDemo = () => {
    const canvasRef = useRef();
    const animationRef = useRef();
    const [isRunning, setIsRunning] = useState(false);
    const [boids, setBoids] = useState([]);
    const [behaviorMode, setBehaviorMode] = useState('flocking');
    const [parameters, setParameters] = useState({
        separation: 25,
        alignment: 50,
        cohesion: 50,
        maxSpeed: 2,
        maxForce: 0.03,
        boidCount: 80
    });

    // Boid class for flocking behavior
    class Boid {
        constructor(x, y, canvas) {
            this.position = { x, y };
            this.velocity = { 
                x: (Math.random() - 0.5) * 2, 
                y: (Math.random() - 0.5) * 2 
            };
            this.acceleration = { x: 0, y: 0 };
            this.maxSpeed = parameters.maxSpeed;
            this.maxForce = parameters.maxForce;
            this.canvas = canvas;
            this.size = 3;
            this.trail = [];
        }

        // Calculate separation force
        separate(boids) {
            const desiredSeparation = parameters.separation;
            let steer = { x: 0, y: 0 };
            let count = 0;

            for (let other of boids) {
                const distance = this.distance(this.position, other.position);
                if (distance > 0 && distance < desiredSeparation) {
                    let diff = {
                        x: this.position.x - other.position.x,
                        y: this.position.y - other.position.y
                    };
                    diff = this.normalize(diff);
                    diff.x /= distance; // Weight by distance
                    diff.y /= distance;
                    steer.x += diff.x;
                    steer.y += diff.y;
                    count++;
                }
            }

            if (count > 0) {
                steer.x /= count;
                steer.y /= count;
                steer = this.normalize(steer);
                steer.x *= this.maxSpeed;
                steer.y *= this.maxSpeed;
                steer.x -= this.velocity.x;
                steer.y -= this.velocity.y;
                steer = this.limit(steer, this.maxForce);
            }

            return steer;
        }

        // Calculate alignment force
        align(boids) {
            const neighborDist = parameters.alignment;
            let sum = { x: 0, y: 0 };
            let count = 0;

            for (let other of boids) {
                const distance = this.distance(this.position, other.position);
                if (distance > 0 && distance < neighborDist) {
                    sum.x += other.velocity.x;
                    sum.y += other.velocity.y;
                    count++;
                }
            }

            if (count > 0) {
                sum.x /= count;
                sum.y /= count;
                sum = this.normalize(sum);
                sum.x *= this.maxSpeed;
                sum.y *= this.maxSpeed;
                let steer = { x: sum.x - this.velocity.x, y: sum.y - this.velocity.y };
                steer = this.limit(steer, this.maxForce);
                return steer;
            }

            return { x: 0, y: 0 };
        }

        // Calculate cohesion force
        cohesion(boids) {
            const neighborDist = parameters.cohesion;
            let sum = { x: 0, y: 0 };
            let count = 0;

            for (let other of boids) {
                const distance = this.distance(this.position, other.position);
                if (distance > 0 && distance < neighborDist) {
                    sum.x += other.position.x;
                    sum.y += other.position.y;
                    count++;
                }
            }

            if (count > 0) {
                sum.x /= count;
                sum.y /= count;
                return this.seek(sum);
            }

            return { x: 0, y: 0 };
        }

        // Seek a target
        seek(target) {
            let desired = { 
                x: target.x - this.position.x, 
                y: target.y - this.position.y 
            };
            desired = this.normalize(desired);
            desired.x *= this.maxSpeed;
            desired.y *= this.maxSpeed;

            let steer = { 
                x: desired.x - this.velocity.x, 
                y: desired.y - this.velocity.y 
            };
            steer = this.limit(steer, this.maxForce);
            return steer;
        }

        // Update position and velocity
        update(boids) {
            this.acceleration = { x: 0, y: 0 };

            if (behaviorMode === 'flocking') {
                let sep = this.separate(boids);
                let ali = this.align(boids);
                let coh = this.cohesion(boids);

                // Weight the forces
                sep.x *= 1.5;
                sep.y *= 1.5;
                ali.x *= 1.0;
                ali.y *= 1.0;
                coh.x *= 1.0;
                coh.y *= 1.0;

                this.acceleration.x += sep.x + ali.x + coh.x;
                this.acceleration.y += sep.y + ali.y + coh.y;
            } else if (behaviorMode === 'swarm') {
                // Simple swarm behavior - move toward center of mass
                let center = this.getCenterOfMass(boids);
                let seek = this.seek(center);
                let sep = this.separate(boids);
                
                seek.x *= 0.5;
                seek.y *= 0.5;
                sep.x *= 2.0;
                sep.y *= 2.0;

                this.acceleration.x += seek.x + sep.x;
                this.acceleration.y += seek.y + sep.y;
            }

            // Update velocity
            this.velocity.x += this.acceleration.x;
            this.velocity.y += this.acceleration.y;
            this.velocity = this.limit(this.velocity, this.maxSpeed);

            // Update position
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            // Wrap around edges
            this.wrapEdges();

            // Update trail
            this.trail.push({ ...this.position });
            if (this.trail.length > 20) {
                this.trail.shift();
            }
        }

        // Wrap around canvas edges
        wrapEdges() {
            if (this.position.x < 0) this.position.x = this.canvas.width;
            if (this.position.x > this.canvas.width) this.position.x = 0;
            if (this.position.y < 0) this.position.y = this.canvas.height;
            if (this.position.y > this.canvas.height) this.position.y = 0;
        }

        // Helper functions
        distance(a, b) {
            return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        }

        normalize(vector) {
            const mag = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            if (mag > 0) {
                return { x: vector.x / mag, y: vector.y / mag };
            }
            return { x: 0, y: 0 };
        }

        limit(vector, max) {
            const mag = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            if (mag > max) {
                return { x: (vector.x / mag) * max, y: (vector.y / mag) * max };
            }
            return vector;
        }

        getCenterOfMass(boids) {
            let sum = { x: 0, y: 0 };
            for (let boid of boids) {
                sum.x += boid.position.x;
                sum.y += boid.position.y;
            }
            return { x: sum.x / boids.length, y: sum.y / boids.length };
        }

        // Render the boid
        render(ctx) {
            // Draw trail
            if (this.trail.length > 1) {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                for (let i = 1; i < this.trail.length; i++) {
                    ctx.lineTo(this.trail[i].x, this.trail[i].y);
                }
                ctx.stroke();
            }

            // Draw boid as triangle pointing in velocity direction
            const angle = Math.atan2(this.velocity.y, this.velocity.x);
            
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(angle);
            
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.moveTo(this.size * 2, 0);
            ctx.lineTo(-this.size, this.size);
            ctx.lineTo(-this.size, -this.size);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
    }

    // Initialize boids
    const initializeBoids = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const newBoids = [];
        for (let i = 0; i < parameters.boidCount; i++) {
            newBoids.push(new Boid(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                canvas
            ));
        }
        setBoids(newBoids);
    };

    // Animation loop
    const animate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = 'rgba(17, 24, 39, 0.1)'; // Slight trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and render boids
        boids.forEach(boid => {
            boid.maxSpeed = parameters.maxSpeed;
            boid.maxForce = parameters.maxForce;
            boid.update(boids);
            boid.render(ctx);
        });

        if (isRunning) {
            animationRef.current = requestAnimationFrame(animate);
        }
    };

    // Start/stop animation
    useEffect(() => {
        if (isRunning) {
            animate();
        } else {
            cancelAnimationFrame(animationRef.current);
        }
        
        return () => cancelAnimationFrame(animationRef.current);
    }, [isRunning, boids, parameters, behaviorMode]);

    // Initialize on mount
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 600;
            canvas.height = 400;
            initializeBoids();
        }
    }, [parameters.boidCount]);

    const toggleAnimation = () => {
        setIsRunning(!isRunning);
    };

    const resetBoids = () => {
        setIsRunning(false);
        initializeBoids();
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6">
            <h3 className="text-xl font-bold text-white mb-4">Swarm Behavior Demonstration</h3>
            
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow">
                    <canvas 
                        ref={canvasRef}
                        className="border border-gray-700 rounded-lg bg-gray-800"
                        width={600}
                        height={400}
                    />
                    
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={toggleAnimation}
                            className={`px-4 py-2 rounded font-semibold ${
                                isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                        >
                            {isRunning ? 'Pause' : 'Start'} Simulation
                        </button>
                        <button
                            onClick={resetBoids}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                        >
                            Reset
                        </button>
                    </div>
                </div>
                
                <div className="w-full lg:w-80 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Behavior Controls</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Behavior Mode
                            </label>
                            <select
                                value={behaviorMode}
                                onChange={(e) => setBehaviorMode(e.target.value)}
                                className="w-full bg-gray-700 text-white rounded px-3 py-2"
                            >
                                <option value="flocking">Flocking (Boids)</option>
                                <option value="swarm">Simple Swarm</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Boid Count: {parameters.boidCount}
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="150"
                                value={parameters.boidCount}
                                onChange={(e) => setParameters(prev => ({ ...prev, boidCount: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Max Speed: {parameters.maxSpeed.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.1"
                                value={parameters.maxSpeed}
                                onChange={(e) => setParameters(prev => ({ ...prev, maxSpeed: parseFloat(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Max Force: {parameters.maxForce.toFixed(3)}
                            </label>
                            <input
                                type="range"
                                min="0.01"
                                max="0.1"
                                step="0.005"
                                value={parameters.maxForce}
                                onChange={(e) => setParameters(prev => ({ ...prev, maxForce: parseFloat(e.target.value) }))}
                                className="w-full"
                            />
                        </div>
                        
                        {behaviorMode === 'flocking' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Separation: {parameters.separation}
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="50"
                                        value={parameters.separation}
                                        onChange={(e) => setParameters(prev => ({ ...prev, separation: parseInt(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Alignment: {parameters.alignment}
                                    </label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="80"
                                        value={parameters.alignment}
                                        onChange={(e) => setParameters(prev => ({ ...prev, alignment: parseInt(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Cohesion: {parameters.cohesion}
                                    </label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="80"
                                        value={parameters.cohesion}
                                        onChange={(e) => setParameters(prev => ({ ...prev, cohesion: parseInt(e.target.value) }))}
                                        className="w-full"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-400">
                        <h5 className="font-semibold text-gray-300 mb-2">About This Demo:</h5>
                        <p className="mb-2">
                            This simulation demonstrates emergent swarm behavior where simple individual rules create complex group patterns.
                        </p>
                        <p>
                            <strong>Flocking:</strong> Uses separation, alignment, and cohesion rules.<br/>
                            <strong>Swarm:</strong> Simple attraction to group center with separation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwarmBehaviorDemo;