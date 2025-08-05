import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import * as THREE from 'three';

// Base Interactive Component Container
const InteractiveContainer = ({ title, description, children, className = "" }) => (
  <div className={`bg-gradient-to-br from-slate-100 to-blue-50 rounded-xl p-4 border border-blue-200 shadow-lg max-w-2xl mx-auto my-4 ${className}`}>
    <div className="mb-3">
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      {description && <p className="text-slate-600 text-sm">{description}</p>}
    </div>
    <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
      {children}
    </div>
  </div>
);

// Activation Function Visualizer using D3.js
export const ActivationFunctionDemo = ({ width = 400, height = 250 }) => {
  const svgRef = useRef();
  const [selectedFunction, setSelectedFunction] = useState('sigmoid');

  const activationFunctions = {
    sigmoid: (x) => 1 / (1 + Math.exp(-x)),
    tanh: (x) => Math.tanh(x),
    relu: (x) => Math.max(0, x),
    leakyRelu: (x) => x > 0 ? x : 0.01 * x
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([-2, 2])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 35)
      .attr('fill', '#64748B')
      .style('text-anchor', 'middle')
      .text('Input (x)');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -innerHeight / 2)
      .attr('fill', '#64748B')
      .style('text-anchor', 'middle')
      .text('Output f(x)');

    // Grid lines
    g.selectAll('.grid-line-x')
      .data(xScale.ticks())
      .enter().append('line')
      .attr('class', 'grid-line-x')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3);

    g.selectAll('.grid-line-y')
      .data(yScale.ticks())
      .enter().append('line')
      .attr('class', 'grid-line-y')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3);

    // Function line
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    const data = d3.range(-5, 5.1, 0.1).map(x => ({
      x: x,
      y: activationFunctions[selectedFunction](x)
    }));

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Zero lines
    g.append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#6B7280')
      .attr('stroke-width', 1);

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#6B7280')
      .attr('stroke-width', 1);

  }, [selectedFunction, width, height]);

  return (
    <InteractiveContainer 
      title="Activation Function Explorer" 
      description="Explore different activation functions used in neural networks"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2">
          {Object.keys(activationFunctions).map(func => (
            <button
              key={func}
              onClick={() => setSelectedFunction(func)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedFunction === func 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {func.charAt(0).toUpperCase() + func.slice(1)}
            </button>
          ))}
        </div>
        <svg ref={svgRef} width={width} height={height} className="border border-slate-300 rounded"></svg>
        <div className="text-sm text-slate-600">
          <strong>Current:</strong> {selectedFunction} - {
            selectedFunction === 'sigmoid' ? 'Smooth S-curve, outputs between 0 and 1' :
            selectedFunction === 'tanh' ? 'Similar to sigmoid but outputs between -1 and 1' :
            selectedFunction === 'relu' ? 'Simple and effective, zero for negative inputs' :
            'Like ReLU but allows small negative values'
          }
        </div>
      </div>
    </InteractiveContainer>
  );
};

// Neural Network Topology Visualizer using Three.js
export const NetworkTopologyDemo = ({ width = 400, height = 280 }) => {
  const mountRef = useRef();
  const [topology, setTopology] = useState([3, 4, 4, 2]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear previous content
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Three.js setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create neurons and connections
    const layers = [];
    const connections = [];
    const maxLayerSize = Math.max(...topology);
    const layerSpacing = 3;
    
    topology.forEach((layerSize, layerIndex) => {
      const layer = [];
      const yOffset = (maxLayerSize - layerSize) * 0.5;
      
      for (let i = 0; i < layerSize; i++) {
        // Neuron geometry
        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
        const material = new THREE.MeshPhongMaterial({ 
          color: layerIndex === 0 ? 0x10b981 : 
                 layerIndex === topology.length - 1 ? 0xef4444 : 0x3b82f6,
          transparent: false,
          opacity: 1.0
        });
        
        const neuron = new THREE.Mesh(geometry, material);
        neuron.position.set(
          layerIndex * layerSpacing - (topology.length - 1) * layerSpacing / 2,
          i - layerSize / 2 + 0.5 + yOffset,
          0
        );
        
        scene.add(neuron);
        layer.push(neuron);
        
        // Create connections to next layer
        if (layerIndex < topology.length - 1) {
          const nextLayerSize = topology[layerIndex + 1];
          for (let j = 0; j < nextLayerSize; j++) {
            const startPos = neuron.position;
            const endPos = new THREE.Vector3(
              (layerIndex + 1) * layerSpacing - (topology.length - 1) * layerSpacing / 2,
              j - nextLayerSize / 2 + 0.5 + (maxLayerSize - nextLayerSize) * 0.5,
              0
            );
            
            const direction = new THREE.Vector3().subVectors(endPos, startPos);
            const distance = direction.length();
            
            const geometry = new THREE.CylinderGeometry(0.01, 0.01, distance, 8);
            const material = new THREE.MeshBasicMaterial({ 
              color: 0x64748b,
              transparent: true,
              opacity: 0.6
            });
            
            const connection = new THREE.Mesh(geometry, material);
            connection.position.copy(startPos).add(direction.multiplyScalar(0.5));
            connection.lookAt(endPos);
            connection.rotateX(Math.PI / 2);
            
            scene.add(connection);
            connections.push(connection);
          }
        }
      }
      layers.push(layer);
    });

    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (isAnimating) {
        const time = Date.now() * 0.001;
        
        // Animate neuron pulsing
        layers.forEach((layer, layerIndex) => {
          layer.forEach((neuron, neuronIndex) => {
            const phase = time + layerIndex * 0.5 + neuronIndex * 0.2;
            neuron.scale.setScalar(1 + 0.2 * Math.sin(phase * 2));
          });
        });
        
        // Animate connection opacity
        connections.forEach((connection, index) => {
          const phase = time + index * 0.1;
          connection.material.opacity = 0.3 + 0.3 * Math.sin(phase * 3);
        });
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [topology, isAnimating, width, height]);

  const presetTopologies = {
    'Simple': [2, 3, 1],
    'Deep': [4, 6, 6, 4, 2],
    'Wide': [3, 8, 8, 3],
    'Complex': [5, 8, 6, 4, 3, 2]
  };

  return (
    <InteractiveContainer 
      title="3D Neural Network Topology" 
      description="Visualize different neural network architectures in 3D"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(presetTopologies).map(([name, topo]) => (
            <button
              key={name}
              onClick={() => setTopology(topo)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                JSON.stringify(topology) === JSON.stringify(topo)
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isAnimating 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isAnimating ? 'Stop Animation' : 'Start Animation'}
          </button>
          <span className="text-sm text-slate-600">
            Topology: [{topology.join(', ')}]
          </span>
        </div>
        
        <div ref={mountRef} className="border border-slate-300 rounded overflow-hidden"></div>
      </div>
    </InteractiveContainer>
  );
};

// XOR Problem Visualizer
export const InteractiveXOR = ({ width = 400, height = 300 }) => {
  const svgRef = useRef();
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([-0.5, 1.5]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([-0.5, 1.5]).range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(3));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(3));

    // XOR data points
    const xorData = [
      { x: 0, y: 0, output: 0, label: '(0,0) → 0' },
      { x: 0, y: 1, output: 1, label: '(0,1) → 1' },
      { x: 1, y: 0, output: 1, label: '(1,0) → 1' },
      { x: 1, y: 1, output: 0, label: '(1,1) → 0' }
    ];

    // Draw data points
    g.selectAll('.xor-point')
      .data(xorData)
      .enter().append('circle')
      .attr('class', 'xor-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 12)
      .attr('fill', d => d.output === 1 ? '#10B981' : '#EF4444')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Labels
    g.selectAll('.xor-label')
      .data(xorData)
      .enter().append('text')
      .attr('class', 'xor-label')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y) - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#475569')
      .attr('font-size', '10px')
      .text(d => d.label);

    // Decision boundary attempt (if not showing solution)
    if (!showSolution) {
      // Show that no single line can separate XOR
      const attempts = [
        { x1: 0, y1: 0.5, x2: 1, y2: 0.5, color: '#FF6B6B', label: 'Horizontal line fails' },
        { x1: 0.5, y1: 0, x2: 0.5, y2: 1, color: '#4ECDC4', label: 'Vertical line fails' },
        { x1: 0, y1: 0, x2: 1, y2: 1, color: '#45B7D1', label: 'Diagonal line fails' }
      ];

      attempts.forEach((attempt, i) => {
        g.append('line')
          .attr('x1', xScale(attempt.x1))
          .attr('y1', yScale(attempt.y1))
          .attr('x2', xScale(attempt.x2))
          .attr('y2', yScale(attempt.y2))
          .attr('stroke', attempt.color)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5')
          .attr('opacity', 0.7);
      });

      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ef4444')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('No single line can separate XOR!');
    } else {
      // Show solution with decision regions
      const regions = [
        { path: `M ${xScale(0)} ${yScale(0.5)} L ${xScale(0.5)} ${yScale(0)} L ${xScale(1)} ${yScale(0.5)} L ${xScale(0.5)} ${yScale(1)} Z`, color: '#10B981', opacity: 0.2 },
        { path: `M ${xScale(0)} ${yScale(0)} L ${xScale(0)} ${yScale(0.5)} L ${xScale(0.5)} ${yScale(0)} Z`, color: '#EF4444', opacity: 0.2 },
        { path: `M ${xScale(0.5)} ${yScale(0)} L ${xScale(1)} ${yScale(0)} L ${xScale(1)} ${yScale(0.5)} Z`, color: '#EF4444', opacity: 0.2 },
        { path: `M ${xScale(0)} ${yScale(0.5)} L ${xScale(0)} ${yScale(1)} L ${xScale(0.5)} ${yScale(1)} Z`, color: '#EF4444', opacity: 0.2 },
        { path: `M ${xScale(0.5)} ${yScale(1)} L ${xScale(1)} ${yScale(1)} L ${xScale(1)} ${yScale(0.5)} Z`, color: '#EF4444', opacity: 0.2 }
      ];

      regions.forEach(region => {
        g.append('path')
          .attr('d', region.path)
          .attr('fill', region.color)
          .attr('opacity', region.opacity);
      });

      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#10b981')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('Multi-layer network creates non-linear boundary');
    }

  }, [showSolution, width, height]);

  return (
    <InteractiveContainer 
      title="XOR Problem Visualization" 
      description="Understand why XOR requires multi-layer neural networks"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            {showSolution ? 'Show Problem' : 'Show Solution'}
          </button>
        </div>
        
        <svg ref={svgRef} width={width} height={height} className="border border-slate-300 rounded bg-white"></svg>
        
        <div className="text-sm text-slate-600 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Output = 1 (True)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Output = 0 (False)</span>
          </div>
          <p className="text-xs mt-2">
            {showSolution 
              ? 'A multi-layer network can create complex decision boundaries to solve XOR.'
              : 'No single straight line can separate the XOR pattern - this is why we need hidden layers!'
            }
          </p>
        </div>
      </div>
    </InteractiveContainer>
  );
};

// Swarm Intelligence Demo
export const SwarmIntelligenceDemo = ({ width = 400, height = 300 }) => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const [isRunning, setIsRunning] = useState(false);
  const [swarmType, setSwarmType] = useState('boids');
  const [agents, setAgents] = useState([]);

  const initializeSwarm = useCallback((type) => {
    const newAgents = [];
    const count = type === 'ants' ? 50 : type === 'particles' ? 30 : 40;
    
    for (let i = 0; i < count; i++) {
      newAgents.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: type === 'ants' ? 3 : type === 'particles' ? 4 : 5,
        color: type === 'ants' ? '#a16207' : type === 'particles' ? '#2563eb' : '#059669',
        trail: type === 'ants' ? [] : null,
        personalBest: type === 'particles' ? { x: Math.random() * width, y: Math.random() * height, fitness: Infinity } : null
      });
    }
    setAgents(newAgents);
  }, [width, height]);

  useEffect(() => {
    initializeSwarm(swarmType);
  }, [swarmType, initializeSwarm]);

  useEffect(() => {
    if (!canvasRef.current || !isRunning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      ctx.fillStyle = 'rgba(248, 250, 252, 0.8)';
      ctx.fillRect(0, 0, width, height);

      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          let newAgent = { ...agent };
          
          if (swarmType === 'boids') {
            // Boids flocking behavior
            const neighbors = prevAgents.filter(other => 
              other.id !== agent.id && 
              Math.hypot(other.x - agent.x, other.y - agent.y) < 50
            );

            if (neighbors.length > 0) {
              // Separation, alignment, cohesion
              let sepX = 0, sepY = 0, alignX = 0, alignY = 0, cohX = 0, cohY = 0;
              
              neighbors.forEach(neighbor => {
                const dx = agent.x - neighbor.x;
                const dy = agent.y - neighbor.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < 25) {
                  sepX += dx / dist;
                  sepY += dy / dist;
                }
                
                alignX += neighbor.vx;
                alignY += neighbor.vy;
                cohX += neighbor.x;
                cohY += neighbor.y;
              });
              
              sepX /= neighbors.length;
              sepY /= neighbors.length;
              alignX /= neighbors.length;
              alignY /= neighbors.length;
              cohX = cohX / neighbors.length - agent.x;
              cohY = cohY / neighbors.length - agent.y;
              
              newAgent.vx += sepX * 0.05 + alignX * 0.02 + cohX * 0.02;
              newAgent.vy += sepY * 0.05 + alignY * 0.02 + cohY * 0.02;
            }
          } else if (swarmType === 'particles') {
            // PSO behavior
            const globalBest = { x: width / 2, y: height / 2 }; // Target center
            
            // Update velocity based on personal and global best
            const w = 0.7; // inertia
            const c1 = 1.5; // personal best weight
            const c2 = 1.5; // global best weight
            
            newAgent.vx = w * agent.vx + 
                         c1 * Math.random() * (agent.personalBest.x - agent.x) +
                         c2 * Math.random() * (globalBest.x - agent.x);
            newAgent.vy = w * agent.vy + 
                         c1 * Math.random() * (agent.personalBest.y - agent.y) +
                         c2 * Math.random() * (globalBest.y - agent.y);
          } else if (swarmType === 'ants') {
            // Ant colony behavior - simple random walk with pheromone trails
            newAgent.vx += (Math.random() - 0.5) * 0.5;
            newAgent.vy += (Math.random() - 0.5) * 0.5;
            
            // Add to trail
            if (!newAgent.trail) newAgent.trail = [];
            newAgent.trail.push({ x: agent.x, y: agent.y });
            if (newAgent.trail.length > 20) newAgent.trail.shift();
          }

          // Limit velocity
          const maxSpeed = 2;
          const speed = Math.hypot(newAgent.vx, newAgent.vy);
          if (speed > maxSpeed) {
            newAgent.vx = (newAgent.vx / speed) * maxSpeed;
            newAgent.vy = (newAgent.vy / speed) * maxSpeed;
          }

          // Update position
          newAgent.x += newAgent.vx;
          newAgent.y += newAgent.vy;

          // Boundary conditions
          if (newAgent.x < 0 || newAgent.x > width) newAgent.vx *= -1;
          if (newAgent.y < 0 || newAgent.y > height) newAgent.vy *= -1;
          newAgent.x = Math.max(0, Math.min(width, newAgent.x));
          newAgent.y = Math.max(0, Math.min(height, newAgent.y));

          return newAgent;
        });
      });

      // Draw agents
      agents.forEach(agent => {
        // Draw trail for ants
        if (agent.trail && agent.trail.length > 1) {
          ctx.strokeStyle = 'rgba(161, 98, 7, 0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(agent.trail[0].x, agent.trail[0].y);
          agent.trail.forEach(point => ctx.lineTo(point.x, point.y));
          ctx.stroke();
        }

        // Draw agent
        ctx.fillStyle = agent.color;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, agent.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw velocity vector
        ctx.strokeStyle = agent.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(agent.x, agent.y);
        ctx.lineTo(agent.x + agent.vx * 10, agent.y + agent.vy * 10);
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, agents, swarmType, width, height]);

  const swarmTypes = {
    'boids': 'Flocking Birds',
    'particles': 'Particle Swarm',
    'ants': 'Ant Colony'
  };

  return (
    <InteractiveContainer 
      title="Swarm Intelligence Simulator" 
      description="Watch different swarm behaviors emerge from simple rules"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(swarmTypes).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSwarmType(key);
                setIsRunning(false);
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                swarmType === key 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          
          <button
            onClick={() => initializeSwarm(swarmType)}
            className="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded font-medium transition-colors"
          >
            Reset
          </button>
          
          <span className="text-sm text-slate-600">
            Agents: {agents.length}
          </span>
        </div>
        
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height} 
          className="border border-slate-300 rounded bg-white"
        />
        
        <div className="text-sm text-slate-600">
          <strong>Current Behavior:</strong> {
            swarmType === 'boids' ? 'Flocking with separation, alignment, and cohesion rules' :
            swarmType === 'particles' ? 'Optimization using personal and global best positions' :
            'Foraging with pheromone trail formation'
          }
        </div>
      </div>
    </InteractiveContainer>
  );
};

// PSO Visualization
export const PSOVisualization = ({ width = 400, height = 300 }) => {
  const canvasRef = useRef();
  const [isRunning, setIsRunning] = useState(false);
  const [particles, setParticles] = useState([]);
  const [globalBest, setGlobalBest] = useState({ x: width/2, y: height/2, fitness: Infinity });

  // Fitness function (distance to center)
  const fitnessFunction = (x, y) => {
    const centerX = width / 2;
    const centerY = height / 2;
    return Math.hypot(x - centerX, y - centerY);
  };

  const initializeParticles = useCallback(() => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      newParticles.push({
        id: i,
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        personalBest: { x, y, fitness: fitnessFunction(x, y) }
      });
    }
    setParticles(newParticles);
    
    // Find initial global best
    const best = newParticles.reduce((best, particle) => 
      particle.personalBest.fitness < best.fitness ? particle.personalBest : best, 
      { fitness: Infinity }
    );
    setGlobalBest(best);
  }, [width, height]);

  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  useEffect(() => {
    if (!isRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
      ctx.fillRect(0, 0, width, height);

      // Draw fitness landscape (contours)
      const centerX = width / 2;
      const centerY = height / 2;
      for (let r = 50; r <= 200; r += 50) {
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 - (r / 200) * 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw global best
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(globalBest.x, globalBest.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw particles
      setParticles(prevParticles => {
        let newGlobalBest = globalBest;

        const updatedParticles = prevParticles.map(particle => {
          const newParticle = { ...particle };

          // PSO velocity update
          const w = 0.7; // inertia weight
          const c1 = 1.4; // cognitive component
          const c2 = 1.4; // social component
          const r1 = Math.random();
          const r2 = Math.random();

          newParticle.vx = w * particle.vx + 
                          c1 * r1 * (particle.personalBest.x - particle.x) +
                          c2 * r2 * (globalBest.x - particle.x);
          
          newParticle.vy = w * particle.vy + 
                          c1 * r1 * (particle.personalBest.y - particle.y) +
                          c2 * r2 * (globalBest.y - particle.y);

          // Limit velocity
          const maxVel = 5;
          newParticle.vx = Math.max(-maxVel, Math.min(maxVel, newParticle.vx));
          newParticle.vy = Math.max(-maxVel, Math.min(maxVel, newParticle.vy));

          // Update position
          newParticle.x += newParticle.vx;
          newParticle.y += newParticle.vy;

          // Boundary conditions
          newParticle.x = Math.max(10, Math.min(width - 10, newParticle.x));
          newParticle.y = Math.max(10, Math.min(height - 10, newParticle.y));

          // Evaluate fitness
          const fitness = fitnessFunction(newParticle.x, newParticle.y);

          // Update personal best
          if (fitness < particle.personalBest.fitness) {
            newParticle.personalBest = { x: newParticle.x, y: newParticle.y, fitness };
          }

          // Check for new global best
          if (fitness < newGlobalBest.fitness) {
            newGlobalBest = { x: newParticle.x, y: newParticle.y, fitness };
          }

          return newParticle;
        });

        // Update global best if changed
        if (newGlobalBest !== globalBest) {
          setGlobalBest(newGlobalBest);
        }

        return updatedParticles;
      });

      // Draw particles
      particles.forEach(particle => {
        // Draw personal best
        ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.beginPath();
        ctx.arc(particle.personalBest.x, particle.personalBest.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw velocity vector
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + particle.vx * 5, particle.y + particle.vy * 5);
        ctx.stroke();

        // Draw particle
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, particles, globalBest, width, height]);

  return (
    <InteractiveContainer 
      title="Particle Swarm Optimization" 
      description="Watch particles optimize towards the global minimum"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          
          <button
            onClick={initializeParticles}
            className="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded font-medium transition-colors"
          >
            Reset
          </button>
          
          <span className="text-sm text-slate-600">
            Best Fitness: {globalBest.fitness.toFixed(2)}
          </span>
        </div>
        
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height} 
          className="border border-slate-300 rounded bg-white"
        />
        
        <div className="text-sm text-slate-600 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Particles</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full opacity-50"></div>
            <span>Personal Best</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Global Best</span>
          </div>
        </div>
      </div>
    </InteractiveContainer>
  );
};

// Export other placeholder components
export const InteractiveNeuralNetwork = () => (
  <InteractiveContainer title="Interactive Neural Network" description="Neural network playground">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🧠</div>
        <p>Interactive Neural Network Component</p>
        <p className="text-sm">Advanced neural network visualization and interaction</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const AdvancedPSODemo = () => (
  <InteractiveContainer title="Advanced PSO Demo" description="Advanced particle swarm optimization">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🔬</div>
        <p>Advanced PSO Visualization</p>
        <p className="text-sm">Multi-objective optimization and advanced PSO variants</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const RuvSwarmSimulation = () => (
  <InteractiveContainer title="rUv-swarm Simulation" description="Complete swarm intelligence platform">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🌊</div>
        <p>rUv-swarm Platform</p>
        <p className="text-sm">Comprehensive swarm intelligence simulation environment</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const FANNUtilsDemo = () => (
  <InteractiveContainer title="FANN Utils Demo" description="Fast Artificial Neural Network utilities">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">⚡</div>
        <p>FANN Library Integration</p>
        <p className="text-sm">Fast neural network training and deployment tools</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const GeneticAlgorithmDemo = () => (
  <InteractiveContainer title="Genetic Algorithm Demo" description="Evolutionary optimization">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🧬</div>
        <p>Genetic Algorithm Visualization</p>
        <p className="text-sm">Evolution-based optimization and learning</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const AdvancedDeepNetworkVisualization = () => (
  <InteractiveContainer title="Advanced Deep Network Visualization" description="Deep learning architectures">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🏗️</div>
        <p>Deep Network Architecture</p>
        <p className="text-sm">Advanced deep learning model visualization</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const AdvancedRLEnvironment = () => (
  <InteractiveContainer title="Advanced RL Environment" description="Reinforcement learning playground">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🎮</div>
        <p>Reinforcement Learning</p>
        <p className="text-sm">Interactive RL agent training environment</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const SystemArchitectureVisualization = () => (
  <InteractiveContainer title="System Architecture Visualization" description="Distributed system design">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🏛️</div>
        <p>System Architecture</p>
        <p className="text-sm">Distributed system design and visualization</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const DistributedSystemAnimation = () => (
  <InteractiveContainer title="Distributed System Animation" description="Distributed computing visualization">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🌐</div>
        <p>Distributed Computing</p>
        <p className="text-sm">Real-time distributed system behavior</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const ScalabilityDemonstration = () => (
  <InteractiveContainer title="Scalability Demonstration" description="System scaling visualization">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">📈</div>
        <p>Scalability Patterns</p>
        <p className="text-sm">System scaling and performance optimization</p>
      </div>
    </div>
  </InteractiveContainer>
);

export const PerformanceOptimizationTools = () => (
  <InteractiveContainer title="Performance Optimization Tools" description="System performance analysis">
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="animate-pulse mb-2">🔧</div>
        <p>Performance Tools</p>
        <p className="text-sm">System optimization and performance analysis</p>
      </div>
    </div>
  </InteractiveContainer>
);

// Multi-Agent Systems Animations
export const AgentCommunicationOverview = ({ width = 400, height = 280 }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        
        // Agent communication visualization
        const agents = Array.from({ length: 8 }, (_, i) => ({
            x: Math.cos(i * Math.PI / 4) * 80 + width/2,
            y: Math.sin(i * Math.PI / 4) * 80 + height/2,
            id: i,
            color: `hsl(${i * 45}, 70%, 60%)`,
            messages: []
        }));
        
        const animate = () => {
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.fillRect(0, 0, width, height);
            
            // Draw agents
            agents.forEach(agent => {
                ctx.beginPath();
                ctx.arc(agent.x, agent.y, 12, 0, Math.PI * 2);
                ctx.fillStyle = agent.color;
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Agent ID
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(agent.id, agent.x, agent.y + 4);
            });
            
            // Animate messages between agents
            if (Math.random() < 0.1) {
                const sender = agents[Math.floor(Math.random() * agents.length)];
                const receiver = agents[Math.floor(Math.random() * agents.length)];
                if (sender !== receiver) {
                    sender.messages.push({
                        target: receiver,
                        progress: 0,
                        color: sender.color
                    });
                }
            }
            
            // Draw and update messages
            agents.forEach(agent => {
                agent.messages = agent.messages.filter(message => {
                    message.progress += 0.02;
                    
                    if (message.progress < 1) {
                        const x = agent.x + (message.target.x - agent.x) * message.progress;
                        const y = agent.y + (message.target.y - agent.y) * message.progress;
                        
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, Math.PI * 2);
                        ctx.fillStyle = message.color;
                        ctx.fill();
                        return true;
                    }
                    return false;
                });
            });
            
            // Draw connection lines
            ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
            ctx.lineWidth = 1;
            agents.forEach(agent => {
                agents.forEach(other => {
                    if (agent.id < other.id) {
                        ctx.beginPath();
                        ctx.moveTo(agent.x, agent.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                });
            });
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [width, height]);
    
    return (
        <InteractiveContainer title="Agent Communication Network" description="Watch agents communicate in a mesh network topology">
            <canvas ref={canvasRef} width={width} height={height} className="border border-gray-300 rounded" />
        </InteractiveContainer>
    );
};

export const SynchronousCommunication = ({ width = 400, height = 280 }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        let time = 0;
        
        const animate = () => {
            time += 0.02;
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.fillRect(0, 0, width, height);
            
            // Draw timeline
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, height/2);
            ctx.lineTo(width - 50, height/2);
            ctx.stroke();
            
            // Draw agents
            const agent1Y = height/2 - 60;
            const agent2Y = height/2 + 60;
            
            // Agent 1
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(40, agent1Y - 10, 20, 20);
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText('Agent 1', 10, agent1Y + 5);
            
            // Agent 2
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(40, agent2Y - 10, 20, 20);
            ctx.fillText('Agent 2', 10, agent2Y + 5);
            
            // Synchronous message exchange
            const phase = (time % 4);
            if (phase < 1) {
                // Send request
                const progress = phase;
                const x = 60 + progress * (width - 120);
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.arc(x, agent1Y + 10, 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Arrow
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(60, agent1Y + 10);
                ctx.lineTo(x, agent2Y - 10);
                ctx.stroke();
            } else if (phase < 2) {
                // Processing at Agent 2
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(width - 80, agent2Y - 15, 30, 30);
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.fillText('Processing...', width - 75, agent2Y);
            } else if (phase < 3) {
                // Send response
                const progress = phase - 2;
                const x = width - 60 - progress * (width - 120);
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(x, agent2Y - 10, 4, 0, Math.PI * 2);
                ctx.fill();
                
                // Arrow
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(width - 60, agent2Y - 10);
                ctx.lineTo(x, agent1Y + 10);
                ctx.stroke();
            } else {
                // Wait for next cycle
                ctx.fillStyle = '#10b981';
                ctx.fillRect(40, agent1Y - 10, 20, 20);
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.fillText('✓', 47, agent1Y + 2);
            }
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [width, height]);
    
    return (
        <InteractiveContainer title="Synchronous Communication" description="Agent 1 waits for Agent 2's response before continuing">
            <canvas ref={canvasRef} width={width} height={height} className="border border-gray-300 rounded" />
        </InteractiveContainer>
    );
};

export const AsynchronousCommunication = ({ width = 400, height = 280 }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        let messages = [];
        let time = 0;
        
        const animate = () => {
            time += 0.02;
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.fillRect(0, 0, width, height);
            
            // Draw agents
            const agents = [
                { x: 60, y: height/3, color: '#3b82f6', name: 'Agent 1' },
                { x: 60, y: 2*height/3, color: '#ef4444', name: 'Agent 2' },
                { x: width - 60, y: height/2, color: '#10b981', name: 'Agent 3' }
            ];
            
            agents.forEach(agent => {
                ctx.fillStyle = agent.color;
                ctx.fillRect(agent.x - 15, agent.y - 10, 30, 20);
                ctx.fillStyle = '#fff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(agent.name.split(' ')[1], agent.x, agent.y + 4);
                ctx.textAlign = 'left';
            });
            
            // Generate messages
            if (Math.random() < 0.05) {
                const sender = agents[Math.floor(Math.random() * agents.length)];
                const receiver = agents[Math.floor(Math.random() * agents.length)];
                if (sender !== receiver) {
                    messages.push({
                        x: sender.x,
                        y: sender.y,
                        targetX: receiver.x,
                        targetY: receiver.y,
                        color: sender.color,
                        progress: 0
                    });
                }
            }
            
            // Update and draw messages
            messages = messages.filter(msg => {
                msg.progress += 0.015;
                
                if (msg.progress < 1) {
                    msg.x = msg.x + (msg.targetX - msg.x) * 0.02;
                    msg.y = msg.y + (msg.targetY - msg.y) * 0.02;
                    
                    ctx.fillStyle = msg.color;
                    ctx.beginPath();
                    ctx.arc(msg.x, msg.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    return true;
                }
                return false;
            });
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [width, height]);
    
    return (
        <InteractiveContainer title="Asynchronous Communication" description="Agents send messages without waiting for responses">
            <canvas ref={canvasRef} width={width} height={height} className="border border-gray-300 rounded" />
        </InteractiveContainer>
    );
};

export const CommunicationTopologyExplorer = ({ width = 400, height = 280 }) => {
    const [topology, setTopology] = useState('mesh');
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        
        const animate = () => {
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.fillRect(0, 0, width, height);
            
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = 80;
            const nodeCount = 6;
            
            // Generate node positions based on topology
            const nodes = Array.from({ length: nodeCount }, (_, i) => ({
                x: centerX + Math.cos(i * 2 * Math.PI / nodeCount) * radius,
                y: centerY + Math.sin(i * 2 * Math.PI / nodeCount) * radius,
                id: i
            }));
            
            // Draw connections based on topology
            ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
            ctx.lineWidth = 2;
            
            if (topology === 'mesh') {
                // All-to-all connections
                nodes.forEach(node1 => {
                    nodes.forEach(node2 => {
                        if (node1.id < node2.id) {
                            ctx.beginPath();
                            ctx.moveTo(node1.x, node1.y);
                            ctx.lineTo(node2.x, node2.y);
                            ctx.stroke();
                        }
                    });
                });
            } else if (topology === 'star') {
                // Central hub connections
                const center = { x: centerX, y: centerY };
                nodes.forEach(node => {
                    ctx.beginPath();
                    ctx.moveTo(center.x, center.y);
                    ctx.lineTo(node.x, node.y);
                    ctx.stroke();
                });
                
                // Draw central node
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(center.x, center.y, 15, 0, Math.PI * 2);
                ctx.fill();
            } else if (topology === 'ring') {
                // Ring connections
                nodes.forEach((node, i) => {
                    const nextNode = nodes[(i + 1) % nodes.length];
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(nextNode.x, nextNode.y);
                    ctx.stroke();
                });
            }
            
            // Draw nodes
            nodes.forEach(node => {
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Node ID
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(node.id, node.x, node.y + 4);
            });
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [topology, width, height]);
    
    return (
        <InteractiveContainer title="Communication Topologies" description="Explore different network topologies for agent communication">
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Topology:</label>
                <select 
                    value={topology} 
                    onChange={(e) => setTopology(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                    <option value="mesh">Mesh (All-to-All)</option>
                    <option value="star">Star (Hub-and-Spoke)</option>
                    <option value="ring">Ring (Circular)</option>
                </select>
            </div>
            <canvas ref={canvasRef} width={width} height={height} className="border border-gray-300 rounded" />
        </InteractiveContainer>
    );
};

// Distributed AI Architecture Animations
export const DistributedMLOverview = ({ width = 400, height = 280 }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        let time = 0;
        
        const animate = () => {
            time += 0.01;
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.fillRect(0, 0, width, height);
            
            // Draw distributed workers
            const workers = [
                { x: 80, y: 80, name: 'Worker 1' },
                { x: 320, y: 80, name: 'Worker 2' },
                { x: 80, y: 200, name: 'Worker 3' },
                { x: 320, y: 200, name: 'Worker 4' }
            ];
            
            // Draw parameter server
            const serverX = width / 2;
            const serverY = height / 2;
            
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(serverX - 20, serverY - 15, 40, 30);
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Parameter', serverX, serverY - 5);
            ctx.fillText('Server', serverX, serverY + 5);
            
            // Draw workers
            workers.forEach((worker, i) => {
                ctx.fillStyle = '#3b82f6';
                ctx.fillRect(worker.x - 15, worker.y - 10, 30, 20);
                ctx.fillStyle = '#fff';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(worker.name, worker.x, worker.y + 2);
                
                // Animate gradient flow
                const phase = (time + i * 0.5) % 2;
                if (phase < 1) {
                    // Gradients to server
                    const progress = phase;
                    const x = worker.x + (serverX - worker.x) * progress;
                    const y = worker.y + (serverY - worker.y) * progress;
                    
                    ctx.fillStyle = '#10b981';
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Updated parameters from server
                    const progress = phase - 1;
                    const x = serverX + (worker.x - serverX) * progress;
                    const y = serverY + (worker.y - serverY) * progress;
                    
                    ctx.fillStyle = '#f59e0b';
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Connection lines
                ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(worker.x, worker.y);
                ctx.lineTo(serverX, serverY);
                ctx.stroke();
            });
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [width, height]);
    
    return (
        <InteractiveContainer title="Distributed ML Parameter Server" description="Workers send gradients to parameter server and receive updates">
            <canvas ref={canvasRef} width={width} height={height} className="border border-gray-300 rounded" />
        </InteractiveContainer>
    );
};

export const FederatedLearningOverview = ({ width = 400, height = 280 }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        let time = 0;
        
        const animate = () => {
            time += 0.015;
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.fillRect(0, 0, width, height);
            
            // Draw federated server
            const serverX = width / 2;
            const serverY = 60;
            
            ctx.fillStyle = '#6366f1';
            ctx.fillRect(serverX - 25, serverY - 15, 50, 30);
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Fed Server', serverX, serverY + 2);
            
            // Draw client devices
            const clients = [
                { x: 80, y: 180, type: 'phone', color: '#3b82f6' },
                { x: 160, y: 220, type: 'laptop', color: '#10b981' },
                { x: 240, y: 220, type: 'tablet', color: '#f59e0b' },
                { x: 320, y: 180, type: 'iot', color: '#ef4444' }
            ];
            
            clients.forEach((client, i) => {
                // Draw device
                ctx.fillStyle = client.color;
                if (client.type === 'phone') {
                    ctx.fillRect(client.x - 8, client.y - 15, 16, 30);
                } else if (client.type === 'laptop') {
                    ctx.fillRect(client.x - 15, client.y - 10, 30, 20);
                } else if (client.type === 'tablet') {
                    ctx.fillRect(client.x - 12, client.y - 12, 24, 24);
                }
                
                // Local data
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                for (let j = 0; j < 5; j++) {
                    ctx.fillRect(client.x - 10 + j * 4, client.y + 20, 2, 8);
                }
                
                // Animate federated learning rounds
                const phase = (time + i * 0.3) % 3;
                if (phase < 1) {
                    // Model download
                    const progress = phase;
                    const x = serverX + (client.x - serverX) * progress;
                    const y = serverY + (client.y - serverY) * progress;
                    
                    ctx.fillStyle = '#8b5cf6';
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (phase < 2) {
                    // Local training (pulsing effect)
                    const pulse = Math.sin((phase - 1) * Math.PI * 8) * 0.5 + 0.5;
                    ctx.fillStyle = `rgba(${client.color.includes('3b82') ? '59, 130, 246' : 
                                        client.color.includes('10b9') ? '16, 185, 129' :
                                        client.color.includes('f59e') ? '245, 158, 11' : '239, 68, 68'}, ${pulse})`;
                    ctx.beginPath();
                    ctx.arc(client.x, client.y, 20, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Model update upload
                    const progress = phase - 2;
                    const x = client.x + (serverX - client.x) * progress;
                    const y = client.y + (serverY - client.y) * progress;
                    
                    ctx.fillStyle = client.color;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Privacy shield
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(client.x, client.y, 25, 0, Math.PI * 2);
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            });
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [width, height]);
    
    return (
        <InteractiveContainer title="Federated Learning Overview" description="Devices train locally while sharing model updates, not data">
            <canvas ref={canvasRef} width={width} height={height} className="border border-gray-300 rounded" />
        </InteractiveContainer>
    );
};

export const SwarmCloudOverview = ({ width = 400, height = 280 }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;
        let time = 0;
        
        const animate = () => {
            time += 0.02;
            ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
            ctx.fillRect(0, 0, width, height);
            
            // Draw cloud
            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
            ctx.beginPath();
            ctx.arc(width/2 - 40, 80, 30, 0, Math.PI * 2);
            ctx.arc(width/2, 70, 35, 0, Math.PI * 2);
            ctx.arc(width/2 + 40, 80, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw swarm agents in cloud
            const agents = Array.from({ length: 12 }, (_, i) => ({
                x: width/2 + Math.cos(i * Math.PI / 6 + time) * (30 + Math.sin(time + i) * 10),
                y: 80 + Math.sin(i * Math.PI / 6 + time) * (20 + Math.cos(time + i) * 5),
                color: `hsl(${(i * 30 + time * 50) % 360}, 70%, 60%)`
            }));
            
            agents.forEach(agent => {
                ctx.fillStyle = agent.color;
                ctx.beginPath();
                ctx.arc(agent.x, agent.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Draw containers/pods
            const containers = [
                { x: 60, y: 160, label: 'Pod 1' },
                { x: 140, y: 180, label: 'Pod 2' },
                { x: 220, y: 160, label: 'Pod 3' },
                { x: 300, y: 180, label: 'Pod 4' },
                { x: 100, y: 220, label: 'Pod 5' },
                { x: 260, y: 220, label: 'Pod 6' }
            ];
            
            containers.forEach(container => {
                // Container box
                ctx.fillStyle = '#e5e7eb';
                ctx.fillRect(container.x - 15, container.y - 10, 30, 20);
                ctx.strokeStyle = '#6b7280';
                ctx.lineWidth = 1;
                ctx.strokeRect(container.x - 15, container.y - 10, 30, 20);
                
                // Container label
                ctx.fillStyle = '#374151';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(container.label, container.x, container.y + 2);
                
                // Auto-scaling animation
                const scale = 1 + Math.sin(time + container.x * 0.01) * 0.1;
                ctx.save();
                ctx.translate(container.x, container.y);
                ctx.scale(scale, scale);
                ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
                ctx.fillRect(-15, -10, 30, 20);
                ctx.restore();
            });
            
            // Draw orchestration layer
            ctx.fillStyle = '#8b5cf6';
            ctx.fillRect(width/2 - 30, 120, 60, 15);
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Kubernetes', width/2, 130);
            
            // Service mesh connections
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
            ctx.lineWidth = 1;
            containers.forEach(container => {
                ctx.beginPath();
                ctx.moveTo(width/2, 135);
                ctx.lineTo(container.x, container.y - 10);
                ctx.stroke();
            });
            
            animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [width, height]);
    
    return (
        <InteractiveContainer title="Cloud-Native Swarm Architecture" description="Swarm agents deployed as microservices with Kubernetes orchestration">
            <canvas ref={canvasRef} width={width} height={height} className="border border-gray-300 rounded" />
        </InteractiveContainer>
    );
};