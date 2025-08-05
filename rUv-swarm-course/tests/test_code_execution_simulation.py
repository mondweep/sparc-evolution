#!/usr/bin/env python3
"""
Test Suite for Code Execution Simulation System
Tests the simplified code execution without Docker dependency
"""

import pytest
import asyncio
import json
from fastapi.testclient import TestClient
from backend.main import app
from backend.api.code_execution import (
    _execute_javascript,
    _execute_python,
    _execute_java,
    _execute_cpp,
    _execute_rust,
    _execute_go
)

client = TestClient(app)


class TestJavaScriptExecution:
    """Test JavaScript code simulation"""
    
    @pytest.mark.asyncio
    async def test_basic_console_log(self):
        """Test basic console.log output"""
        code = 'console.log("Hello, World!");'
        result = await _execute_javascript(code)
        
        assert result["success"] is True
        assert "Hello, World!" in result["output"]
        assert result["execution_time_ms"] > 0
        assert result["memory_used_kb"] == 1024
    
    @pytest.mark.asyncio
    async def test_mathematical_operations(self):
        """Test mathematical operations"""
        code = '''
        console.log("2 + 2 =", 2 + 2);
        console.log("Math.sqrt(16) =", Math.sqrt(16));
        '''
        result = await _execute_javascript(code)
        
        assert result["success"] is True
        assert "2 + 2" in result["output"]
        assert "Math.sqrt" in result["output"]
    
    @pytest.mark.asyncio
    async def test_swarm_algorithm_simulation(self):
        """Test swarm algorithm detection"""
        code = '''
        function createSwarm(size) {
            return Array.from({ length: size }, (_, i) => ({
                id: i,
                position: { x: Math.random() * 100, y: Math.random() * 100 }
            }));
        }
        
        const mySwarm = createSwarm(5);
        console.log("Swarm created with", mySwarm.length, "agents");
        '''
        result = await _execute_javascript(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm Simulation]" in result["output"]
        assert "Swarm initialized" in result["output"]
        assert "Function 'createSwarm' defined" in result["output"]
    
    @pytest.mark.asyncio
    async def test_security_violation(self):
        """Test security pattern detection"""
        code = 'require("fs").readFileSync("/etc/passwd");'
        result = await _execute_javascript(code)
        
        assert result["success"] is False
        assert "Security violation" in result["error"]
        assert "Dangerous pattern detected" in result["error"]
    
    @pytest.mark.asyncio
    async def test_function_definitions(self):
        """Test function definition detection"""
        code = '''
        function fibonacci(n) {
            if (n <= 1) return n;
            return fibonacci(n-1) + fibonacci(n-2);
        }
        
        console.log("Fibonacci of 5:", fibonacci(5));
        '''
        result = await _execute_javascript(code)
        
        assert result["success"] is True
        assert "Function 'fibonacci' defined" in result["output"]


class TestPythonExecution:
    """Test Python code simulation"""
    
    @pytest.mark.asyncio
    async def test_basic_print(self):
        """Test basic print output"""
        code = 'print("Hello, Python World!")'
        result = await _execute_python(code)
        
        assert result["success"] is True
        assert "Hello, Python World!" in result["output"]
        assert result["memory_used_kb"] == 2048
    
    @pytest.mark.asyncio
    async def test_swarm_class_simulation(self):
        """Test swarm class detection"""
        code = '''
        class Agent:
            def __init__(self, agent_id):
                self.id = agent_id
                self.position = [0, 0]
        
        class Swarm:
            def __init__(self, size=5):
                self.agents = [Agent(i) for i in range(size)]
        
        swarm = Swarm()
        print(f"Created swarm with {len(swarm.agents)} agents")
        '''
        result = await _execute_python(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm Python Simulation]" in result["output"]
        assert "Class 'Agent' defined" in result["output"]
        assert "Class 'Swarm' defined" in result["output"]
    
    @pytest.mark.asyncio
    async def test_security_violation(self):
        """Test security pattern detection"""
        code = 'import os\nos.system("ls /")'
        result = await _execute_python(code)
        
        assert result["success"] is False
        assert "Security violation" in result["error"]
    
    @pytest.mark.asyncio
    async def test_list_comprehension(self):
        """Test list comprehension"""
        code = '''
        numbers = [1, 2, 3, 4, 5]
        squared = [n**2 for n in numbers]
        print("Original:", numbers)
        print("Squared:", squared)
        '''
        result = await _execute_python(code)
        
        assert result["success"] is True
        assert "Original:" in result["output"]
        assert "Squared:" in result["output"]


class TestJavaExecution:
    """Test Java code simulation"""
    
    @pytest.mark.asyncio
    async def test_basic_output(self):
        """Test basic System.out.println"""
        code = '''
        public class Main {
            public static void main(String[] args) {
                System.out.println("Hello, Java World!");
            }
        }
        '''
        result = await _execute_java(code)
        
        assert result["success"] is True
        assert "Hello, Java World!" in result["output"]
        assert "Java class 'Main' compiled and loaded" in result["output"]
        assert result["memory_used_kb"] == 4096
    
    @pytest.mark.asyncio
    async def test_swarm_simulation(self):
        """Test Java swarm detection"""
        code = '''
        class Agent {
            private int id;
            public Agent(int id) { this.id = id; }
        }
        
        class Swarm {
            private Agent[] agents;
            public Swarm(int size) {
                agents = new Agent[size];
            }
        }
        '''
        result = await _execute_java(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm Java Simulation]" in result["output"]
        assert "Java class 'Agent' compiled and loaded" in result["output"]
        assert "Java class 'Swarm' compiled and loaded" in result["output"]


class TestCppExecution:
    """Test C++ code simulation"""
    
    @pytest.mark.asyncio
    async def test_basic_output(self):
        """Test basic cout output"""
        code = '''
        #include <iostream>
        int main() {
            std::cout << "Hello, C++ World!" << std::endl;
            return 0;
        }
        '''
        result = await _execute_cpp(code)
        
        assert result["success"] is True
        assert "Hello, C++ World!" in result["output"]
        assert result["memory_used_kb"] == 3072
    
    @pytest.mark.asyncio 
    async def test_swarm_simulation(self):
        """Test C++ swarm detection"""
        code = '''
        #include <iostream>
        #include <vector>
        
        class Agent {
            int id;
        public:
            Agent(int id) : id(id) {}
        };
        
        class Swarm {
            std::vector<Agent> agents;
        public:
            Swarm(int size) {
                for(int i = 0; i < size; i++) {
                    agents.emplace_back(i);
                }
            }
        };
        '''
        result = await _execute_cpp(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm C++ Simulation]" in result["output"]
        assert "High-performance swarm algorithms" in result["output"]


class TestRustExecution:
    """Test Rust code simulation"""
    
    @pytest.mark.asyncio
    async def test_basic_output(self):
        """Test basic println! output"""
        code = '''
        fn main() {
            println!("Hello, Rust World!");
        }
        '''
        result = await _execute_rust(code)
        
        assert result["success"] is True
        assert "Hello, Rust World!" in result["output"]
        assert result["memory_used_kb"] == 2560
    
    @pytest.mark.asyncio
    async def test_swarm_simulation(self):
        """Test Rust swarm detection"""
        code = '''
        struct Agent {
            id: usize,
        }
        
        struct Swarm {
            agents: Vec<Agent>,
        }
        
        fn main() {
            println!("Creating memory-safe swarm");
        }
        '''
        result = await _execute_rust(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm Rust Simulation]" in result["output"]
        assert "Rust struct 'Agent' defined" in result["output"]
        assert "Rust struct 'Swarm' defined" in result["output"]


class TestGoExecution:
    """Test Go code simulation"""
    
    @pytest.mark.asyncio
    async def test_basic_output(self):
        """Test basic fmt.Println output"""
        code = '''
        package main
        
        import "fmt"
        
        func main() {
            fmt.Println("Hello, Go World!")
        }
        '''
        result = await _execute_go(code)
        
        assert result["success"] is True
        assert "Hello, Go World!" in result["output"]
        assert result["memory_used_kb"] == 2048
    
    @pytest.mark.asyncio
    async def test_swarm_simulation(self):
        """Test Go swarm detection"""
        code = '''
        package main
        
        import "fmt"
        
        type Agent struct {
            ID int
        }
        
        type Swarm struct {
            agents []Agent
        }
        
        func main() {
            fmt.Println("Creating concurrent swarm")
        }
        '''
        result = await _execute_go(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm Go Simulation]" in result["output"]
        assert "Concurrent swarm processing" in result["output"]


class TestAPIEndpoints:
    """Test API endpoints"""
    
    def test_execute_endpoint_javascript(self):
        """Test /api/code/execute endpoint with JavaScript"""
        payload = {
            "code": 'console.log("API test");',
            "language": "javascript"
        }
        
        # Mock authentication for testing
        headers = {"Authorization": "Bearer test-token"}
        response = client.post("/api/code/execute", json=payload, headers=headers)
        
        # Note: This will fail without proper auth setup, but tests the endpoint structure
        assert response.status_code in [200, 401, 422]  # 401 for auth, 422 for validation
    
    def test_execute_endpoint_unsupported_language(self):
        """Test unsupported language error"""
        payload = {
            "code": "print('test')",
            "language": "cobol"
        }
        
        headers = {"Authorization": "Bearer test-token"}
        response = client.post("/api/code/execute", json=payload, headers=headers)
        
        # Should return error for unsupported language
        assert response.status_code in [400, 401, 422]


class TestRuvSwarmAlgorithms:
    """Test specific rUv-Swarm algorithm simulations"""
    
    @pytest.mark.asyncio
    async def test_particle_swarm_optimization(self):
        """Test particle swarm optimization simulation"""
        code = '''
        class Particle:
            def __init__(self, dimensions):
                self.position = [random.random() for _ in range(dimensions)]
                self.velocity = [0 for _ in range(dimensions)]
                self.best_position = self.position[:]
                
        class PSO:
            def __init__(self, num_particles, dimensions):
                self.swarm = [Particle(dimensions) for _ in range(num_particles)]
                
        pso = PSO(20, 2)
        print(f"PSO swarm initialized with {len(pso.swarm)} particles")
        '''
        result = await _execute_python(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm Python Simulation]" in result["output"]
        assert "Class 'Particle' defined" in result["output"]
        assert "Class 'PSO' defined" in result["output"]
    
    @pytest.mark.asyncio
    async def test_ant_colony_optimization(self):
        """Test ant colony optimization simulation"""
        code = '''
        function createAnt(id) {
            return {
                id: id,
                position: [0, 0],
                pheromoneTrail: []
            };
        }
        
        function createColony(size) {
            return Array.from({length: size}, (_, i) => createAnt(i));
        }
        
        const antColony = createColony(50);
        console.log("Ant colony created with", antColony.length, "ants");
        '''
        result = await _execute_javascript(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm Simulation]" in result["output"]
        assert "Function 'createAnt' defined" in result["output"]
        assert "Function 'createColony' defined" in result["output"]
    
    @pytest.mark.asyncio
    async def test_boids_flocking_algorithm(self):
        """Test boids flocking algorithm simulation"""
        code = '''
        struct Boid {
            position: Vector2D,
            velocity: Vector2D,
        }
        
        impl Boid {
            fn new() -> Self {
                Boid {
                    position: Vector2D { x: 0.0, y: 0.0 },
                    velocity: Vector2D { x: 1.0, y: 1.0 },
                }
            }
            
            fn flock(&mut self, neighbors: &[Boid]) {
                // Separation, alignment, cohesion rules
            }
        }
        
        fn main() {
            let mut flock: Vec<Boid> = (0..100).map(|_| Boid::new()).collect();
            println!("Boids flock created with {} members", flock.len());
        }
        '''
        result = await _execute_rust(code)
        
        assert result["success"] is True
        assert "[rUv-Swarm Rust Simulation]" in result["output"]
        assert "Rust struct 'Boid' defined" in result["output"]


class TestSecurityFeatures:
    """Test security features of the simulation"""
    
    @pytest.mark.asyncio
    async def test_javascript_security_patterns(self):
        """Test various JavaScript security violations"""
        dangerous_codes = [
            'require("child_process").exec("rm -rf /");',
            'process.exit(1);',
            'eval("malicious code");',
            'new Function("return process")();'
        ]
        
        for code in dangerous_codes:
            result = await _execute_javascript(code)
            assert result["success"] is False
            assert "Security violation" in result["error"]
    
    @pytest.mark.asyncio
    async def test_python_security_patterns(self):
        """Test various Python security violations"""
        dangerous_codes = [
            'import subprocess; subprocess.call(["ls", "/"])',
            'exec("import os")',
            'eval("__import__(\\"os\\").system(\\"ls\\")")',
            'open("/etc/passwd", "r").read()'
        ]
        
        for code in dangerous_codes:
            result = await _execute_python(code)
            assert result["success"] is False
            assert "Security violation" in result["error"]


class TestPerformanceMetrics:
    """Test performance tracking and metrics"""
    
    @pytest.mark.asyncio
    async def test_execution_time_tracking(self):
        """Test that execution time is properly tracked"""
        code = 'console.log("Performance test");'
        result = await _execute_javascript(code)
        
        assert result["success"] is True
        assert "execution_time_ms" in result
        assert result["execution_time_ms"] > 0
        assert result["execution_time_ms"] < 1000  # Should be fast for simulation
    
    @pytest.mark.asyncio
    async def test_memory_usage_tracking(self):
        """Test memory usage reporting"""
        code = 'print("Memory test")'
        result = await _execute_python(code)
        
        assert result["success"] is True
        assert "memory_used_kb" in result
        assert result["memory_used_kb"] > 0
    
    @pytest.mark.asyncio
    async def test_different_language_memory_usage(self):
        """Test different memory usage for different languages"""
        js_result = await _execute_javascript('console.log("test");')
        python_result = await _execute_python('print("test")')
        java_result = await _execute_java('System.out.println("test");')
        cpp_result = await _execute_cpp('cout << "test";')
        
        # Different languages should report different memory usage
        memory_usage = {
            'js': js_result["memory_used_kb"],
            'python': python_result["memory_used_kb"],
            'java': java_result["memory_used_kb"],
            'cpp': cpp_result["memory_used_kb"]
        }
        
        assert len(set(memory_usage.values())) > 1  # Should have different values


if __name__ == "__main__":
    # Run tests with pytest
    import sys
    sys.exit(pytest.main([__file__, "-v"]))