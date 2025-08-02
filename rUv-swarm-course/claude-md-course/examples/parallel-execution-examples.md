# Parallel Execution Examples

## Example 1: Web Application Development

### ❌ WRONG: Sequential Approach
```
Message 1: Create project structure
Message 2: Setup frontend
Message 3: Setup backend
Message 4: Configure database
Message 5: Write tests
Message 6: Deploy application
```

### ✅ CORRECT: Parallel Approach
```javascript
[BatchTool - Message 1]:
  // Create ALL project structure at once
  Bash("mkdir -p webapp/{frontend,backend,database,tests,docs}")
  Bash("mkdir -p webapp/frontend/{src,public,components}")
  Bash("mkdir -p webapp/backend/{routes,models,middleware}")
  
  // Write ALL configuration files at once
  Write("webapp/package.json", packageConfig)
  Write("webapp/frontend/package.json", frontendConfig)
  Write("webapp/backend/package.json", backendConfig)
  Write("webapp/docker-compose.yml", dockerConfig)
  Write("webapp/.env.example", envConfig)
  
  // Update ALL todos at once
  TodoWrite { todos: [
    { id: "structure", content: "Project structure", status: "completed", priority: "high" },
    { id: "frontend", content: "Frontend setup", status: "in_progress", priority: "high" },
    { id: "backend", content: "Backend API", status: "pending", priority: "high" },
    { id: "database", content: "Database schema", status: "pending", priority: "high" },
    { id: "auth", content: "Authentication", status: "pending", priority: "medium" },
    { id: "tests", content: "Test suite", status: "pending", priority: "medium" },
    { id: "deployment", content: "Deployment setup", status: "pending", priority: "low" },
    { id: "docs", content: "Documentation", status: "pending", priority: "low" }
  ]}

[BatchTool - Message 2]:
  // Install ALL dependencies at once
  Bash("cd webapp/frontend && npm install")
  Bash("cd webapp/backend && npm install")
  Bash("cd webapp && docker-compose up -d database")
  
  // Run ALL initial checks at once
  Bash("cd webapp/frontend && npm run lint")
  Bash("cd webapp/backend && npm run lint")
  Bash("cd webapp && docker-compose logs database")
```

## Example 2: Data Processing Pipeline

### ❌ WRONG: Sequential Approach
```
Message 1: Download data
Message 2: Clean data
Message 3: Process data
Message 4: Analyze results
Message 5: Generate reports
```

### ✅ CORRECT: Parallel Approach
```javascript
[BatchTool - Message 1]:
  // Setup ALL directories and configs
  Bash("mkdir -p pipeline/{raw,cleaned,processed,reports,scripts}")
  Write("pipeline/config.yaml", pipelineConfig)
  Write("pipeline/requirements.txt", dependencies)
  Write("pipeline/scripts/download.py", downloadScript)
  Write("pipeline/scripts/clean.py", cleanScript)
  Write("pipeline/scripts/process.py", processScript)
  Write("pipeline/scripts/analyze.py", analyzeScript)
  
  // Install dependencies and download data
  Bash("cd pipeline && pip install -r requirements.txt")
  Bash("cd pipeline && python scripts/download.py")
  
  // Update ALL todos
  TodoWrite { todos: [
    { id: "setup", content: "Pipeline setup", status: "completed", priority: "high" },
    { id: "download", content: "Data download", status: "completed", priority: "high" },
    { id: "clean", content: "Data cleaning", status: "in_progress", priority: "high" },
    { id: "process", content: "Data processing", status: "pending", priority: "high" },
    { id: "analyze", content: "Analysis", status: "pending", priority: "medium" },
    { id: "report", content: "Report generation", status: "pending", priority: "medium" }
  ]}
```

## Example 3: Machine Learning Model Development

### ❌ WRONG: Sequential Approach
```
Message 1: Prepare dataset
Message 2: Build model
Message 3: Train model
Message 4: Evaluate model
Message 5: Deploy model
```

### ✅ CORRECT: Parallel Approach
```javascript
[BatchTool - Message 1]:
  // Setup complete ML project structure
  Bash("mkdir -p ml-project/{data,models,notebooks,scripts,tests,deployment}")
  Bash("mkdir -p ml-project/data/{raw,processed,features}")
  Bash("mkdir -p ml-project/models/{training,saved,experiments}")
  
  // Create ALL core files
  Write("ml-project/requirements.txt", mlDependencies)
  Write("ml-project/config.yaml", mlConfig)
  Write("ml-project/scripts/preprocess.py", preprocessScript)
  Write("ml-project/scripts/train.py", trainScript)
  Write("ml-project/scripts/evaluate.py", evaluateScript)
  Write("ml-project/scripts/deploy.py", deployScript)
  Write("ml-project/notebooks/exploration.ipynb", explorationNotebook)
  
  // Setup environment and data
  Bash("cd ml-project && pip install -r requirements.txt")
  Bash("cd ml-project && python scripts/download_data.py")
  
  // Comprehensive todo tracking
  TodoWrite { todos: [
    { id: "env", content: "Environment setup", status: "completed", priority: "high" },
    { id: "data", content: "Data preparation", status: "in_progress", priority: "high" },
    { id: "features", content: "Feature engineering", status: "pending", priority: "high" },
    { id: "model", content: "Model development", status: "pending", priority: "high" },
    { id: "training", content: "Model training", status: "pending", priority: "high" },
    { id: "validation", content: "Model validation", status: "pending", priority: "medium" },
    { id: "tuning", content: "Hyperparameter tuning", status: "pending", priority: "medium" },
    { id: "testing", content: "Model testing", status: "pending", priority: "medium" },
    { id: "deployment", content: "Model deployment", status: "pending", priority: "low" },
    { id: "monitoring", content: "Performance monitoring", status: "pending", priority: "low" }
  ]}
```

## Key Principles Demonstrated

### 1. Batch File Operations
- Create ALL directories in one command
- Write ALL files in one message
- Install ALL dependencies together

### 2. Comprehensive Todo Management
- Include ALL project phases in one TodoWrite
- Mix status levels (completed, in_progress, pending)
- Balance priority levels (high, medium, low)
- Minimum 5-10 todos per batch

### 3. Logical Grouping
- Group related operations together
- Separate setup from execution
- Batch by operation type (file creation, commands, todos)

### 4. Performance Benefits
- 6x faster execution
- Better resource utilization
- Improved coordination
- Reduced context switching

## Anti-Patterns to Avoid

### ❌ One Todo at a Time
```javascript
// DON'T DO THIS
Message 1: TodoWrite { todos: [{ id: "1", content: "Setup", ... }] }
Message 2: TodoWrite { todos: [{ id: "2", content: "Build", ... }] }
Message 3: TodoWrite { todos: [{ id: "3", content: "Test", ... }] }
```

### ❌ Sequential File Operations
```javascript
// DON'T DO THIS
Message 1: Write("file1.js", content1)
Message 2: Write("file2.js", content2)
Message 3: Write("file3.js", content3)
```

### ❌ Individual Commands
```javascript
// DON'T DO THIS
Message 1: Bash("mkdir src")
Message 2: Bash("mkdir tests")
Message 3: Bash("npm install")
```

## Performance Comparison

| Approach | Messages | Time | Coordination | Scalability |
|----------|----------|------|--------------|-------------|
| Sequential | 10+ | 100% | Poor | Limited |
| Parallel | 1-3 | 17% | Excellent | Unlimited |

**Result**: 83% time reduction with proper parallel execution!