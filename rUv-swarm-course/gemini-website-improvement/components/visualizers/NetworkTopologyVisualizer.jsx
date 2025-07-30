import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const NetworkTopologyVisualizer = () => {
    const mountRef = useRef(null);
    const [topology, setTopology] = useState([2, 3, 1]); // Default: 2-3-1

    useEffect(() => {
        const mount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.z = 15;

        const group = new THREE.Group();
        scene.add(group);

        // Create nodes
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const nodeMaterials = [
            new THREE.MeshBasicMaterial({ color: 0x3b82f6 }), // Input
            new THREE.MeshBasicMaterial({ color: 0x16a34a }), // Hidden
            new THREE.MeshBasicMaterial({ color: 0xdc2626 }), // Output
        ];

        const layerSpacing = 7;
        const nodeSpacing = 3;
        const nodes = [];
        let maxNodesInLayer = 0;

        topology.forEach(layerSize => {
            if (layerSize > maxNodesInLayer) maxNodesInLayer = layerSize;
        });

        const totalWidth = (topology.length - 1) * layerSpacing;

        topology.forEach((layerSize, layerIndex) => {
            const layerNodes = [];
            const layerX = -totalWidth / 2 + layerIndex * layerSpacing;
            const material = nodeMaterials[layerIndex === 0 ? 0 : layerIndex === topology.length - 1 ? 2 : 1];

            for (let i = 0; i < layerSize; i++) {
                const node = new THREE.Mesh(sphereGeometry, material);
                const y = (i - (layerSize - 1) / 2) * nodeSpacing;
                node.position.set(layerX, y, 0);
                group.add(node);
                layerNodes.push(node);
            }
            nodes.push(layerNodes);
        });

        // Create connections
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6b7280, transparent: true, opacity: 0.5 });
        for (let i = 0; i < nodes.length - 1; i++) {
            for (const startNode of nodes[i]) {
                for (const endNode of nodes[i + 1]) {
                    const points = [startNode.position, endNode.position];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial);
                    group.add(line);
                }
            }
        }

        const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
             if (mount) {
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if(mount) mount.removeChild(renderer.domElement);
        };
    }, [topology]);

    return (
        <div className="bg-gray-900 p-6 rounded-lg my-6">
             <h3 className="text-xl font-bold text-white mb-4">Interactive Network Topology</h3>
             <div className="flex justify-center space-x-2 mb-4">
                 <button onClick={() => setTopology([2,3,1])} className={`px-3 py-1 text-sm rounded ${JSON.stringify(topology) === JSON.stringify([2,3,1]) ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Standard (2-3-1)</button>
                 <button onClick={() => setTopology([4,6,6,2])} className={`px-3 py-1 text-sm rounded ${JSON.stringify(topology) === JSON.stringify([4,6,6,2]) ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Deeper (4-6-6-2)</button>
                 <button onClick={() => setTopology([3,8,2])} className={`px-3 py-1 text-sm rounded ${JSON.stringify(topology) === JSON.stringify([3,8,2]) ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Wider (3-8-2)</button>
             </div>
            <div ref={mountRef} style={{ width: '100%', height: '400px' }} className="rounded-md" />
            <p className="text-center text-sm text-gray-400 mt-2">Click and drag to rotate. Scroll to zoom.</p>
        </div>
    );
};

export default NetworkTopologyVisualizer;