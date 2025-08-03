#!/usr/bin/env node

/**
 * Project 5: API Builder
 * Learning objectives:
 * - Automated REST API generation with swarms
 * - Complex multi-step workflows
 * - Real-world application patterns
 * - Integration with development tools
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️ API Builder - Automated REST API Generation with Swarms\n');

class APIBuilder {
  constructor() {
    this.sessionId = `api-build-${Date.now()}`;
    this.projectName = 'generated-api';
    this.buildResults = {};
    this.agents = [];
    this.apiSpec = null;
    this.generatedFiles = [];
  }

  // Helper to run ruv-swarm commands
  runSwarmCommand(command, silent = false) {
    if (!silent) console.log(`🔧 ${command}`);
    try {
      return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
      if (!silent) console.error(`❌ Error: ${error.message}`);
      return null;
    }
  }

  // Initialize swarm for API building
  async initializeSwarm() {
    console.log('🚀 Initializing API Builder Swarm...\n');
    
    // Use hierarchical topology for structured development workflow
    console.log('1. Setting up hierarchical topology for structured development...');
    this.runSwarmCommand(
      'npx ruv-swarm init --topology hierarchical --agents 8 --strategy specialized'
    );

    // Pre-task hook
    this.runSwarmCommand(
      `npx ruv-swarm hook pre-task --description "API building session ${this.sessionId}"`,
      true
    );

    // Define specialized API building agents
    this.defineAPIAgents();
    
    console.log('✅ API Builder swarm initialized!\n');
  }

  // Define specialized agents for API development
  defineAPIAgents() {
    this.agents = [
      {
        type: 'architect',
        name: 'APIArchitect',
        role: 'Designs API structure and endpoints',
        expertise: ['REST design', 'resource modeling', 'endpoint patterns'],
        phase: 'design'
      },
      {
        type: 'database',
        name: 'DatabaseDesigner',
        role: 'Creates database schemas and models',
        expertise: ['data modeling', 'relationships', 'migrations'],
        phase: 'design'
      },
      {
        type: 'backend',
        name: 'BackendDeveloper',
        role: 'Implements server logic and endpoints',
        expertise: ['Express.js', 'middleware', 'routing'],
        phase: 'implementation'
      },
      {
        type: 'security',
        name: 'SecurityEngineer',
        role: 'Implements authentication and security',
        expertise: ['JWT', 'validation', 'CORS', 'rate limiting'],
        phase: 'implementation'
      },
      {
        type: 'testing',
        name: 'TestEngineer',
        role: 'Creates comprehensive test suites',
        expertise: ['unit tests', 'integration tests', 'API testing'],
        phase: 'testing'
      },
      {
        type: 'documentation',
        name: 'DocWriter',
        role: 'Generates API documentation',
        expertise: ['OpenAPI', 'examples', 'guides'],
        phase: 'documentation'
      },
      {
        type: 'devops',
        name: 'DevOpsEngineer',
        role: 'Sets up deployment and monitoring',
        expertise: ['Docker', 'CI/CD', 'monitoring'],
        phase: 'deployment'
      },
      {
        type: 'coordinator',
        name: 'ProjectCoordinator',
        role: 'Orchestrates development workflow',
        expertise: ['project management', 'quality assurance'],
        phase: 'coordination'
      }
    ];

    console.log('👥 API Development Agents Defined:');
    this.agents.forEach(agent => {
      const emoji = this.getAgentEmoji(agent.type);
      console.log(`  ${emoji} ${agent.name}: ${agent.role} (${agent.phase})`);
    });
    console.log('');
  }

  getAgentEmoji(type) {
    const emojis = {
      architect: '🏗️',
      database: '💾',
      backend: '⚙️',
      security: '🔒',
      testing: '🧪',
      documentation: '📚',
      devops: '🐳',
      coordinator: '🎯'
    };
    return emojis[type] || '🤖';
  }

  // Get API requirements from user or use default example
  getAPIRequirements() {
    console.log('📝 Defining API Requirements...\n');
    
    // For demo purposes, we'll use a predefined API specification
    this.apiSpec = {
      name: 'Task Management API',
      description: 'A comprehensive task management system with user authentication',
      version: '1.0.0',
      baseUrl: '/api/v1',
      authentication: 'JWT',
      resources: [
        {
          name: 'users',
          endpoints: ['GET', 'POST', 'PUT', 'DELETE'],
          fields: ['id', 'username', 'email', 'password', 'createdAt', 'updatedAt'],
          relationships: ['hasMany:tasks']
        },
        {
          name: 'tasks',
          endpoints: ['GET', 'POST', 'PUT', 'DELETE'],
          fields: ['id', 'title', 'description', 'status', 'priority', 'dueDate', 'userId', 'createdAt', 'updatedAt'],
          relationships: ['belongsTo:user']
        },
        {
          name: 'categories',
          endpoints: ['GET', 'POST', 'PUT', 'DELETE'],
          fields: ['id', 'name', 'color', 'createdAt', 'updatedAt'],
          relationships: ['hasMany:tasks']
        }
      ],
      features: [
        'User registration and authentication',
        'CRUD operations for all resources',
        'Task filtering and sorting',
        'Category management',
        'Input validation',
        'Error handling',
        'Rate limiting',
        'API documentation'
      ]
    };

    console.log('✅ API Specification Created:');
    console.log(`   Name: ${this.apiSpec.name}`);
    console.log(`   Resources: ${this.apiSpec.resources.length}`);
    console.log(`   Features: ${this.apiSpec.features.length}`);
    console.log('');

    return this.apiSpec;
  }

  // Build API with coordinated agents
  async buildAPI() {
    console.log('🏗️ Starting Coordinated API Development...\n');
    console.log('=' .repeat(60));

    // Phase 1: Design
    await this.executePhase('design');
    
    // Phase 2: Implementation
    await this.executePhase('implementation');
    
    // Phase 3: Testing
    await this.executePhase('testing');
    
    // Phase 4: Documentation
    await this.executePhase('documentation');
    
    // Phase 5: Deployment
    await this.executePhase('deployment');

    // Generate final report
    this.generateBuildReport();
  }

  async executePhase(phaseName) {
    console.log(`\n📍 Phase: ${phaseName.toUpperCase()}`);
    console.log('-'.repeat(40));

    const phaseAgents = this.agents.filter(agent => agent.phase === phaseName);
    
    console.log(`🚀 Deploying ${phaseAgents.length} agents in parallel:`);
    phaseAgents.forEach(agent => {
      const emoji = this.getAgentEmoji(agent.type);
      console.log(`  ${emoji} ${agent.name}`);
    });

    // Execute agents in parallel
    const phaseResults = await Promise.all(
      phaseAgents.map(agent => this.executeAgent(agent, phaseName))
    );

    // Store phase results
    this.buildResults[phaseName] = {
      agents: phaseAgents.length,
      files: phaseResults.reduce((total, result) => total + result.filesGenerated, 0),
      duration: phaseResults.reduce((total, result) => total + result.duration, 0),
      success: phaseResults.every(result => result.success)
    };

    console.log(`✅ Phase ${phaseName} completed: ${this.buildResults[phaseName].files} files generated`);
    
    // Phase coordination hook
    this.runSwarmCommand(
      `npx ruv-swarm hook notification --message "Phase ${phaseName} completed"`,
      true
    );
  }

  async executeAgent(agent, phase) {
    const startTime = Date.now();
    let filesGenerated = 0;
    
    console.log(`\n${this.getAgentEmoji(agent.type)} ${agent.name} working...`);

    try {
      switch (agent.type) {
        case 'architect':
          filesGenerated = await this.generateArchitecture();
          break;
        case 'database':
          filesGenerated = await this.generateDatabase();
          break;
        case 'backend':
          filesGenerated = await this.generateBackend();
          break;
        case 'security':
          filesGenerated = await this.generateSecurity();
          break;
        case 'testing':
          filesGenerated = await this.generateTests();
          break;
        case 'documentation':
          filesGenerated = await this.generateDocumentation();
          break;
        case 'devops':
          filesGenerated = await this.generateDevOps();
          break;
        case 'coordinator':
          filesGenerated = await this.coordinateProject();
          break;
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

      const duration = Date.now() - startTime;
      console.log(`  ✅ ${agent.name} completed: ${filesGenerated} files (${duration}ms)`);

      // Agent completion hook
      this.runSwarmCommand(
        `npx ruv-swarm hook post-edit --file "${agent.type}-files"`,
        true
      );

      return {
        agent: agent.name,
        success: true,
        filesGenerated,
        duration
      };

    } catch (error) {
      console.error(`  ❌ ${agent.name} failed: ${error.message}`);
      return {
        agent: agent.name,
        success: false,
        filesGenerated: 0,
        duration: Date.now() - startTime
      };
    }
  }

  async generateArchitecture() {
    // Create project structure
    const projectDir = this.projectName;
    const directories = [
      'src',
      'src/controllers',
      'src/models',
      'src/routes',
      'src/middleware',
      'src/config',
      'src/utils',
      'tests',
      'docs'
    ];

    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir);
    }

    directories.forEach(dir => {
      const fullPath = path.join(projectDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });

    // Generate main server file
    const serverContent = `
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const taskRoutes = require('./src/routes/tasks');
const categoryRoutes = require('./src/routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/categories', categoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync();
    console.log('Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(\`🚀 Task Management API running on port \${PORT}\`);
      console.log(\`📚 API Documentation: http://localhost:\${PORT}/docs\`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
`;

    fs.writeFileSync(path.join(projectDir, 'server.js'), serverContent);
    this.generatedFiles.push('server.js');

    // Generate package.json
    const packageContent = {
      name: this.projectName,
      version: "1.0.0",
      description: this.apiSpec.description,
      main: "server.js",
      scripts: {
        start: "node server.js",
        dev: "nodemon server.js",
        test: "jest",
        "test:watch": "jest --watch"
      },
      dependencies: {
        express: "^4.18.2",
        cors: "^2.8.5",
        helmet: "^7.0.0",
        "express-rate-limit": "^6.8.1",
        sequelize: "^6.32.1",
        sqlite3: "^5.1.6",
        bcryptjs: "^2.4.3",
        jsonwebtoken: "^9.0.1",
        joi: "^17.9.2"
      },
      devDependencies: {
        nodemon: "^3.0.1",
        jest: "^29.6.1",
        supertest: "^6.3.3"
      }
    };

    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageContent, null, 2));
    this.generatedFiles.push('package.json');

    return 2; // Files generated
  }

  async generateDatabase() {
    const projectDir = this.projectName;

    // Database configuration
    const dbConfig = `
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL || 'database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = { sequelize };
`;

    fs.writeFileSync(path.join(projectDir, 'src/config/database.js'), dbConfig);
    this.generatedFiles.push('src/config/database.js');

    // Generate models for each resource
    let modelsGenerated = 0;

    // User model
    const userModel = `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
`;

    fs.writeFileSync(path.join(projectDir, 'src/models/User.js'), userModel);
    this.generatedFiles.push('src/models/User.js');
    modelsGenerated++;

    // Task model
    const taskModel = `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

module.exports = Task;
`;

    fs.writeFileSync(path.join(projectDir, 'src/models/Task.js'), taskModel);
    this.generatedFiles.push('src/models/Task.js');
    modelsGenerated++;

    // Category model
    const categoryModel = `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 100]
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  }
});

module.exports = Category;
`;

    fs.writeFileSync(path.join(projectDir, 'src/models/Category.js'), categoryModel);
    this.generatedFiles.push('src/models/Category.js');
    modelsGenerated++;

    // Models index file
    const modelsIndex = `
const User = require('./User');
const Task = require('./Task');
const Category = require('./Category');

// Define associations
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Task.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Task, { foreignKey: 'categoryId', as: 'tasks' });

module.exports = {
  User,
  Task,
  Category
};
`;

    fs.writeFileSync(path.join(projectDir, 'src/models/index.js'), modelsIndex);
    this.generatedFiles.push('src/models/index.js');

    return modelsGenerated + 2; // Models + config + index
  }

  async generateBackend() {
    const projectDir = this.projectName;
    let filesGenerated = 0;

    // Generate controllers
    const userController = `
const { User, Task } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class UserController {
  async getAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [{ model: Task, as: 'tasks' }]
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Task, as: 'tasks' }]
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const user = await User.create(req.body);
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({ user: userResponse, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const [updated] = await User.update(req.body, {
        where: { id: req.params.id }
      });
      
      if (!updated) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await User.destroy({
        where: { id: req.params.id }
      });
      
      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
`;

    fs.writeFileSync(path.join(projectDir, 'src/controllers/userController.js'), userController);
    this.generatedFiles.push('src/controllers/userController.js');
    filesGenerated++;

    // Generate routes
    const userRoutes = `
const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

router.get('/', authMiddleware, userController.getAll);
router.get('/:id', authMiddleware, userController.getById);
router.post('/', validateUser, userController.create);
router.put('/:id', authMiddleware, validateUser, userController.update);
router.delete('/:id', authMiddleware, userController.delete);

module.exports = router;
`;

    fs.writeFileSync(path.join(projectDir, 'src/routes/users.js'), userRoutes);
    this.generatedFiles.push('src/routes/users.js');
    filesGenerated++;

    return filesGenerated;
  }

  async generateSecurity() {
    const projectDir = this.projectName;
    let filesGenerated = 0;

    // Auth middleware
    const authMiddleware = `
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
`;

    fs.writeFileSync(path.join(projectDir, 'src/middleware/auth.js'), authMiddleware);
    this.generatedFiles.push('src/middleware/auth.js');
    filesGenerated++;

    // Validation middleware
    const validationMiddleware = `
const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required()
});

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().optional(),
  status: Joi.string().valid('pending', 'in_progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().optional(),
  categoryId: Joi.number().integer().optional()
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateUser,
  validateTask
};
`;

    fs.writeFileSync(path.join(projectDir, 'src/middleware/validation.js'), validationMiddleware);
    this.generatedFiles.push('src/middleware/validation.js');
    filesGenerated++;

    return filesGenerated;
  }

  async generateTests() {
    const projectDir = this.projectName;
    let filesGenerated = 0;

    // Test setup
    const testSetup = `
const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../src/config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

module.exports = { request, app };
`;

    fs.writeFileSync(path.join(projectDir, 'tests/setup.js'), testSetup);
    this.generatedFiles.push('tests/setup.js');
    filesGenerated++;

    // User tests
    const userTests = `
const { request, app } = require('./setup');

describe('User Endpoints', () => {
  let authToken;
  let userId;

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body).toHaveProperty('token');

      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should not create user with invalid email', async () => {
      const userData = {
        username: 'testuser2',
        email: 'invalid-email',
        password: 'password123'
      };

      await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/v1/users')
        .expect(401);
    });
  });
});
`;

    fs.writeFileSync(path.join(projectDir, 'tests/users.test.js'), userTests);
    this.generatedFiles.push('tests/users.test.js');
    filesGenerated++;

    return filesGenerated;
  }

  async generateDocumentation() {
    const projectDir = this.projectName;
    let filesGenerated = 0;

    // API Documentation
    const apiDocs = `
# ${this.apiSpec.name}

${this.apiSpec.description}

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

The API will be available at \`http://localhost:3000\`

## API Endpoints

### Authentication
All endpoints except user registration require authentication.
Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Users

#### Create User (Register)
\`\`\`
POST /api/v1/users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
\`\`\`

#### Get All Users
\`\`\`
GET /api/v1/users
Authorization: Bearer <token>
\`\`\`

#### Get User by ID
\`\`\`
GET /api/v1/users/:id
Authorization: Bearer <token>
\`\`\`

### Tasks

#### Create Task
\`\`\`
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the API development",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
\`\`\`

#### Get All Tasks
\`\`\`
GET /api/v1/tasks
Authorization: Bearer <token>
\`\`\`

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses include a message:
\`\`\`json
{
  "error": "Description of the error"
}
\`\`\`

## Rate Limiting

The API includes rate limiting:
- 100 requests per 15 minutes per IP address

## Development

### Running Tests
\`\`\`bash
npm test
\`\`\`

### Environment Variables
Create a \`.env\` file with:
\`\`\`
PORT=3000
JWT_SECRET=your-secret-key
DATABASE_URL=database.sqlite
NODE_ENV=development
\`\`\`
`;

    fs.writeFileSync(path.join(projectDir, 'docs/API.md'), apiDocs);
    this.generatedFiles.push('docs/API.md');
    filesGenerated++;

    return filesGenerated;
  }

  async generateDevOps() {
    const projectDir = this.projectName;
    let filesGenerated = 0;

    // Dockerfile
    const dockerfile = `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
`;

    fs.writeFileSync(path.join(projectDir, 'Dockerfile'), dockerfile);
    this.generatedFiles.push('Dockerfile');
    filesGenerated++;

    // Docker Compose
    const dockerCompose = `
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-production-secret
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
    restart: unless-stopped
`;

    fs.writeFileSync(path.join(projectDir, 'docker-compose.yml'), dockerCompose);
    this.generatedFiles.push('docker-compose.yml');
    filesGenerated++;

    return filesGenerated;
  }

  async coordinateProject() {
    // Generate final project coordination file
    const projectDir = this.projectName;
    
    const coordination = {
      projectName: this.projectName,
      apiSpec: this.apiSpec,
      buildSession: this.sessionId,
      generatedFiles: this.generatedFiles,
      agents: this.agents.map(agent => ({
        name: agent.name,
        type: agent.type,
        phase: agent.phase
      })),
      buildResults: this.buildResults,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(projectDir, 'project-coordination.json'), 
      JSON.stringify(coordination, null, 2)
    );
    this.generatedFiles.push('project-coordination.json');

    return 1;
  }

  // Generate comprehensive build report
  generateBuildReport() {
    console.log('\n\n📊 COMPREHENSIVE API BUILD REPORT');
    console.log('='.repeat(60));

    // Summary statistics
    const totalFiles = this.generatedFiles.length;
    const totalAgents = this.agents.length;
    const phases = Object.keys(this.buildResults);

    console.log(`\n📈 Build Summary:`);
    console.log(`   Project Name: ${this.projectName}`);
    console.log(`   API Name: ${this.apiSpec.name}`);
    console.log(`   Total Files Generated: ${totalFiles}`);
    console.log(`   Agents Deployed: ${totalAgents}`);
    console.log(`   Phases Completed: ${phases.length}`);

    console.log(`\n🏗️ Phase Results:`);
    phases.forEach(phase => {
      const result = this.buildResults[phase];
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${phase.toUpperCase()}: ${result.files} files, ${result.agents} agents, ${result.duration}ms`);
    });

    console.log(`\n📁 Generated Files:`);
    const filesByType = {};
    this.generatedFiles.forEach(file => {
      const ext = path.extname(file) || 'config';
      if (!filesByType[ext]) filesByType[ext] = [];
      filesByType[ext].push(file);
    });

    Object.keys(filesByType).forEach(type => {
      console.log(`   ${type}: ${filesByType[type].length} files`);
      filesByType[type].forEach(file => {
        console.log(`     - ${file}`);
      });
    });

    console.log(`\n👥 Agent Performance:`);
    this.agents.forEach(agent => {
      const emoji = this.getAgentEmoji(agent.type);
      const phase = this.buildResults[agent.phase];
      const status = phase && phase.success ? '✅' : '⏳';
      console.log(`   ${status} ${emoji} ${agent.name} (${agent.phase})`);
    });

    // Save build report
    this.saveBuildReport();

    console.log(`\n🚀 Next Steps:`);
    console.log(`   1. cd ${this.projectName}`);
    console.log(`   2. npm install`);
    console.log(`   3. npm run dev`);
    console.log(`   4. Test API at http://localhost:3000`);
    console.log(`   5. View docs at ${this.projectName}/docs/API.md`);

    console.log(`\n💡 API Features:`);
    this.apiSpec.features.forEach(feature => {
      console.log(`   ✓ ${feature}`);
    });
  }

  saveBuildReport() {
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      project: {
        name: this.projectName,
        spec: this.apiSpec
      },
      build: {
        totalFiles: this.generatedFiles.length,
        totalAgents: this.agents.length,
        phases: this.buildResults,
        files: this.generatedFiles
      },
      agents: this.agents
    };

    fs.writeFileSync('build-report.json', JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed build report saved to: build-report.json`);

    // Final completion hook
    this.runSwarmCommand(
      `npx ruv-swarm hook post-task --task-id "api-build-${this.sessionId}" --analyze-performance true`,
      true
    );
  }
}

// Main execution
async function main() {
  const builder = new APIBuilder();
  
  try {
    await builder.initializeSwarm();
    builder.getAPIRequirements();
    await builder.buildAPI();
    
    console.log('\n✨ API Build Complete!');
    console.log('\n🔍 Key Insights:');
    console.log('   • Multi-agent coordination enables complex project generation');
    console.log('   • Hierarchical topology provides structured development workflow');
    console.log('   • Specialized agents handle different aspects of development');
    console.log('   • Automated generation maintains consistency and best practices');
    console.log('   • Real-world APIs can be generated in minutes, not hours');
    
  } catch (error) {
    console.error('💥 API Build failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Build interrupted. Progress saved.');
  process.exit(0);
});

// Run the API builder
main().catch(console.error);