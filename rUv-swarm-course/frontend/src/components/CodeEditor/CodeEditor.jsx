import {
  Box,
  Flex,
  Button,
  Select,
  HStack,
  VStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Textarea,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { FiPlay, FiSave, FiDownload, FiRefreshCw } from 'react-icons/fi'
import { codeAPI } from '../../services/api'

const CodeEditor = ({ initialCode = '', language = 'javascript', lesson = null }) => {
  const [code, setCode] = useState(initialCode)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [executionStats, setExecutionStats] = useState(null)
  const [hasError, setHasError] = useState(false)
  
  const editorRef = useRef(null)
  const toast = useToast()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Language options
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
  ]

  // Default code templates
  const codeTemplates = {
    javascript: `// Welcome to the rUv Swarm Code Editor!
// Try implementing a simple swarm algorithm

function createSwarm(size = 5) {
  return Array.from({ length: size }, (_, i) => ({
    id: i,
    position: { x: Math.random() * 100, y: Math.random() * 100 },
    velocity: { x: 0, y: 0 }
  }));
}

function updateSwarm(swarm) {
  // Implement swarm behavior here
  return swarm.map(agent => ({
    ...agent,
    position: {
      x: agent.position.x + agent.velocity.x,
      y: agent.position.y + agent.velocity.y
    }
  }));
}

const mySwarm = createSwarm();
console.log('Initial swarm:', mySwarm);
console.log('Updated swarm:', updateSwarm(mySwarm));`,
    
    python: `# Welcome to the rUv Swarm Code Editor!
# Try implementing a simple swarm algorithm

import random
import math

class Agent:
    def __init__(self, agent_id):
        self.id = agent_id
        self.position = [random.uniform(0, 100), random.uniform(0, 100)]
        self.velocity = [0, 0]
    
    def update(self):
        self.position[0] += self.velocity[0]
        self.position[1] += self.velocity[1]

class Swarm:
    def __init__(self, size=5):
        self.agents = [Agent(i) for i in range(size)]
    
    def update(self):
        for agent in self.agents:
            agent.update()
    
    def get_positions(self):
        return [agent.position for agent in self.agents]

# Create and test the swarm
swarm = Swarm()
print("Initial positions:", swarm.get_positions())
swarm.update()
print("Updated positions:", swarm.get_positions())`,
    
    java: `// Welcome to the rUv Swarm Code Editor!
// Try implementing a simple swarm algorithm

import java.util.*;

class Agent {
    private int id;
    private double[] position;
    private double[] velocity;
    
    public Agent(int id) {
        this.id = id;
        this.position = new double[]{Math.random() * 100, Math.random() * 100};
        this.velocity = new double[]{0, 0};
    }
    
    public void update() {
        position[0] += velocity[0];
        position[1] += velocity[1];
    }
    
    public double[] getPosition() { return position; }
    public int getId() { return id; }
}

class Swarm {
    private List<Agent> agents;
    
    public Swarm(int size) {
        agents = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            agents.add(new Agent(i));
        }
    }
    
    public void update() {
        for (Agent agent : agents) {
            agent.update();
        }
    }
    
    public List<Agent> getAgents() { return agents; }
}

public class Main {
    public static void main(String[] args) {
        Swarm swarm = new Swarm(5);
        System.out.println("Swarm created with " + swarm.getAgents().size() + " agents");
        swarm.update();
        System.out.println("Swarm updated successfully");
    }
}`,
    
    cpp: `// Welcome to the rUv Swarm Code Editor!
// Try implementing a high-performance swarm algorithm

#include <iostream>
#include <vector>
#include <cmath>
#include <random>

struct Vector2D {
    double x, y;
    Vector2D(double x = 0, double y = 0) : x(x), y(y) {}
    Vector2D operator+(const Vector2D& other) const { return Vector2D(x + other.x, y + other.y); }
    Vector2D operator*(double scalar) const { return Vector2D(x * scalar, y * scalar); }
};

class Agent {
private:
    int id;
    Vector2D position;
    Vector2D velocity;
    
public:
    Agent(int id) : id(id) {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<> dis(0.0, 100.0);
        position = Vector2D(dis(gen), dis(gen));
        velocity = Vector2D(0, 0);
    }
    
    void update() {
        position = position + velocity;
    }
    
    Vector2D getPosition() const { return position; }
    int getId() const { return id; }
};

class Swarm {
private:
    std::vector<Agent> agents;
    
public:
    Swarm(int size) {
        agents.reserve(size);
        for (int i = 0; i < size; i++) {
            agents.emplace_back(i);
        }
    }
    
    void update() {
        for (auto& agent : agents) {
            agent.update();
        }
    }
    
    size_t size() const { return agents.size(); }
};

int main() {
    Swarm swarm(5);
    std::cout << "High-performance swarm created with " << swarm.size() << " agents" << std::endl;
    swarm.update();
    std::cout << "Swarm update completed" << std::endl;
    return 0;
}
`,

    rust: `// Welcome to the rUv Swarm Code Editor!
// Try implementing a memory-safe swarm algorithm

use std::vec::Vec;
use rand::Rng;

#[derive(Debug, Clone)]
struct Vector2D {
    x: f64,
    y: f64,
}

impl Vector2D {
    fn new(x: f64, y: f64) -> Self {
        Vector2D { x, y }
    }
    
    fn add(&self, other: &Vector2D) -> Vector2D {
        Vector2D::new(self.x + other.x, self.y + other.y)
    }
}

struct Agent {
    id: usize,
    position: Vector2D,
    velocity: Vector2D,
}

impl Agent {
    fn new(id: usize) -> Self {
        let mut rng = rand::thread_rng();
        Agent {
            id,
            position: Vector2D::new(rng.gen_range(0.0..100.0), rng.gen_range(0.0..100.0)),
            velocity: Vector2D::new(0.0, 0.0),
        }
    }
    
    fn update(&mut self) {
        self.position = self.position.add(&self.velocity);
    }
    
    fn get_position(&self) -> &Vector2D {
        &self.position
    }
}

struct Swarm {
    agents: Vec<Agent>,
}

impl Swarm {
    fn new(size: usize) -> Self {
        let mut agents = Vec::with_capacity(size);
        for i in 0..size {
            agents.push(Agent::new(i));
        }
        Swarm { agents }
    }
    
    fn update(&mut self) {
        for agent in &mut self.agents {
            agent.update();
        }
    }
    
    fn len(&self) -> usize {
        self.agents.len()
    }
}

fn main() {
    let mut swarm = Swarm::new(5);
    println!("Memory-safe swarm created with {} agents", swarm.len());
    swarm.update();
    println!("Swarm update completed safely");
}
`,

    go: `// Welcome to the rUv Swarm Code Editor!
// Try implementing a concurrent swarm algorithm

package main

import (
    "fmt"
    "math/rand"
    "sync"
    "time"
)

type Vector2D struct {
    X, Y float64
}

func (v Vector2D) Add(other Vector2D) Vector2D {
    return Vector2D{X: v.X + other.X, Y: v.Y + other.Y}
}

type Agent struct {
    ID       int
    Position Vector2D
    Velocity Vector2D
    mutex    sync.RWMutex
}

func NewAgent(id int) *Agent {
    rand.Seed(time.Now().UnixNano())
    return &Agent{
        ID:       id,
        Position: Vector2D{X: rand.Float64() * 100, Y: rand.Float64() * 100},
        Velocity: Vector2D{X: 0, Y: 0},
    }
}

func (a *Agent) Update() {
    a.mutex.Lock()
    defer a.mutex.Unlock()
    a.Position = a.Position.Add(a.Velocity)
}

func (a *Agent) GetPosition() Vector2D {
    a.mutex.RLock()
    defer a.mutex.RUnlock()
    return a.Position
}

type Swarm struct {
    agents []*Agent
}

func NewSwarm(size int) *Swarm {
    agents := make([]*Agent, size)
    for i := 0; i < size; i++ {
        agents[i] = NewAgent(i)
    }
    return &Swarm{agents: agents}
}

func (s *Swarm) UpdateConcurrently() {
    var wg sync.WaitGroup
    for _, agent := range s.agents {
        wg.Add(1)
        go func(a *Agent) {
            defer wg.Done()
            a.Update()
        }(agent)
    }
    wg.Wait()
}

func (s *Swarm) Size() int {
    return len(s.agents)
}

func main() {
    swarm := NewSwarm(5)
    fmt.Printf("Concurrent swarm created with %d agents\\n", swarm.Size())
    swarm.UpdateConcurrently()
    fmt.Println("Concurrent swarm update completed")
}
`
  }

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure editor
    monaco.editor.defineTheme('swarm-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a202c',
      },
    })
    
    monaco.editor.setTheme('swarm-theme')
  }

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage)
    if (codeTemplates[newLanguage] && !code.trim()) {
      setCode(codeTemplates[newLanguage])
    }
  }

  // Example snippets for quick testing
  const exampleSnippets = {
    javascript: [
      {
        name: 'Hello World',
        code: 'console.log("Hello, rUv-Swarm World!");'
      },
      {
        name: 'Simple Math',
        code: 'console.log("2 + 2 =", 2 + 2);\nconsole.log("Math.sqrt(16) =", Math.sqrt(16));'
      },
      {
        name: 'Array Processing',
        code: 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log("Original:", numbers);\nconsole.log("Doubled:", doubled);'
      }
    ],
    python: [
      {
        name: 'Hello World',
        code: 'print("Hello, rUv-Swarm World!")'
      },
      {
        name: 'List Comprehension',
        code: 'numbers = [1, 2, 3, 4, 5]\nsquared = [n**2 for n in numbers]\nprint("Original:", numbers)\nprint("Squared:", squared)'
      },
      {
        name: 'Simple Class',
        code: 'class Calculator:\n    def add(self, a, b):\n        return a + b\n\ncalc = Calculator()\nresult = calc.add(5, 3)\nprint(f"5 + 3 = {result}")'
      }
    ]
  }

  // Load example snippet
  const loadExample = (snippet) => {
    setCode(snippet.code)
    setOutput('')
    setExecutionStats(null)
    setHasError(false)
  }

  // Run code
  const runCode = async () => {
    if (!code.trim()) {
      toast({
        title: 'No code to run',
        description: 'Please write some code first',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsRunning(true)
    setOutput('Running code...')
    setHasError(false)
    setExecutionStats(null)

    try {
      const response = await codeAPI.execute(code, selectedLanguage)
      
      if (response.data.status === 'success') {
        setOutput(response.data.output || 'Code executed successfully')
        setExecutionStats({
          executionTime: response.data.execution_time * 1000, // Convert to ms
          memoryUsed: 0 // Not available in current implementation
        })
        setHasError(false)
        
        toast({
          title: 'Code executed successfully',
          description: `Executed in ${(response.data.execution_time * 1000).toFixed(2)}ms`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        setOutput(`Error: ${response.data.error}`)
        setHasError(true)
        
        toast({
          title: 'Execution error',
          description: response.data.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Failed to execute code'
      setOutput(`Error: ${errorMessage}`)
      setHasError(true)
      
      toast({
        title: 'Execution failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsRunning(false)
    }
  }

  // Save code
  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `swarm-code.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage}`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Code saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  // Reset code
  const resetCode = () => {
    setCode(codeTemplates[selectedLanguage] || '')
    setOutput('')
  }

  // Validate code (if part of a lesson)
  const validateCode = async () => {
    if (!lesson) return

    setIsLoading(true)
    try {
      const response = await codeAPI.validate(code, lesson.id)
      
      if (response.data.valid) {
        toast({
          title: 'Code validation passed!',
          description: response.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Code validation failed',
          description: response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      
      setOutput(response.data.feedback || '')
    } catch (error) {
      toast({
        title: 'Validation error',
        description: 'Failed to validate code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Card mb="4">
        <CardHeader pb="2">
          <Flex justify="space-between" align="center">
            <Heading size="md">Swarm Code Editor</Heading>
            
            <HStack spacing="3">
              <Select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                w="150px"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </Select>

              {/* Examples dropdown */}
              {exampleSnippets[selectedLanguage] && (
                <Select
                  placeholder="Load Example"
                  onChange={(e) => {
                    if (e.target.value) {
                      const snippet = exampleSnippets[selectedLanguage].find(s => s.name === e.target.value)
                      if (snippet) loadExample(snippet)
                    }
                  }}
                  w="150px"
                  variant="outline"
                >
                  {exampleSnippets[selectedLanguage].map((snippet) => (
                    <option key={snippet.name} value={snippet.name}>
                      {snippet.name}
                    </option>
                  ))}
                </Select>
              )}
              
              <Button
                leftIcon={<FiRefreshCw />}
                variant="outline"
                onClick={resetCode}
              >
                Reset
              </Button>
              
              <Button
                leftIcon={<FiSave />}
                variant="outline"
                onClick={saveCode}
              >
                Save
              </Button>
              
              {lesson && (
                <Button
                  colorScheme="purple"
                  onClick={validateCode}
                  isLoading={isLoading}
                >
                  Validate
                </Button>
              )}
              
              <Button
                leftIcon={<FiPlay />}
                colorScheme="green"
                onClick={runCode}
                isLoading={isRunning}
              >
                Run Code
              </Button>
            </HStack>
          </Flex>
        </CardHeader>
      </Card>

      {/* Main Editor Area */}
      <Flex flex="1" gap="4">
        {/* Code Editor */}
        <Card flex="1">
          <CardBody p="0" h="full">
            <Editor
              height="100%"
              language={selectedLanguage}
              value={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </CardBody>
        </Card>

        {/* Output Panel */}
        <Card w="400px">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="sm">Output</Heading>
              {executionStats && (
                <HStack spacing="2">
                  <Badge colorScheme="blue" variant="subtle">
                    {executionStats.executionTime}ms
                  </Badge>
                  <Badge colorScheme="green" variant="subtle">
                    {Math.round(executionStats.memoryUsed / 1024)}MB
                  </Badge>
                </HStack>
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing="3" align="stretch">
              {hasError && (
                <Alert status="error" size="sm">
                  <AlertIcon />
                  <AlertTitle fontSize="sm">Execution Error</AlertTitle>
                </Alert>
              )}
              
              {!hasError && executionStats && (
                <Alert status="success" size="sm">
                  <AlertIcon />
                  <AlertTitle fontSize="sm">Success!</AlertTitle>
                  <AlertDescription fontSize="xs">
                    Simulated execution completed
                  </AlertDescription>
                </Alert>
              )}
              
              <Textarea
                value={output}
                placeholder="Output will appear here..."
                isReadOnly
                h="300px"
                resize="none"
                fontFamily="monospace"
                fontSize="sm"
                bg={useColorModeValue('gray.50', 'gray.900')}
                borderColor={hasError ? 'red.300' : 'gray.200'}
              />
              
              {selectedLanguage && (
                <Text fontSize="xs" color="gray.500">
                  💡 This is a simulated execution environment for demonstration. 
                  Docker sandbox integration is planned for future releases.
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  )
}

export default CodeEditor