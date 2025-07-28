# rUv-Swarm Learning Platform

A comprehensive learning platform for SWARM (Scalable WebAssembly AI Resource Management) built with React, FastAPI, and modern AI technologies.

## 🚀 Project Overview

The rUv-Swarm Learning Platform is an educational system designed to teach and demonstrate SWARM concepts through interactive modules, real-time simulations, and hands-on exercises. It leverages WebAssembly for high-performance computing, AI-driven content generation, and distributed agent coordination.

### Key Features

- **Interactive Learning Modules**: Step-by-step tutorials on SWARM concepts
- **Real-time Agent Simulation**: Visualize swarm behavior and coordination
- **AI-Powered Assistance**: Claude-based tutoring and code generation
- **Performance Analytics**: Track learning progress and system performance
- **Distributed Computing**: Experience WebAssembly-powered distributed tasks

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Zustand** for state management
- **WebAssembly** integration

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy** ORM
- **Alembic** for database migrations
- **Celery** for async tasks
- **Redis** for caching and message broker
- **PostgreSQL** database

### Infrastructure
- **Docker** & **Docker Compose**
- **Nginx** as reverse proxy
- **GitHub Actions** for CI/CD
- **Prometheus** & **Grafana** for monitoring

## 📁 Project Structure

```
ruv-swarm-platform/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   ├── assets/        # Images and styles
│   │   └── context/       # React context providers
│   ├── public/            # Static assets
│   └── tests/             # Frontend tests
├── backend/               # FastAPI backend application
│   ├── app/
│   │   ├── api/          # API routes and endpoints
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   └── db/          # Database configuration
│   ├── tests/           # Backend tests
│   └── alembic/         # Database migrations
├── database/            # Database related files
│   ├── migrations/      # SQL migration scripts
│   ├── seeds/          # Seed data
│   └── backups/        # Database backups
├── docker/             # Docker configuration
│   ├── nginx/          # Nginx configuration
│   └── postgres/       # PostgreSQL configuration
├── docs/               # Documentation
│   ├── api/           # API documentation
│   ├── user-guide/    # User guides
│   └── architecture/  # Architecture documentation
└── tests/             # End-to-end tests
    ├── unit/          # Unit tests
    ├── integration/   # Integration tests
    └── e2e/          # End-to-end tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ruv-swarm-platform.git
   cd ruv-swarm-platform
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy example env files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit the .env files with your configuration
   ```

5. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Development

#### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

#### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Setup

1. **Run migrations**
   ```bash
   cd backend
   alembic upgrade head
   ```

2. **Seed initial data**
   ```bash
   python scripts/seed_data.py
   ```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
pytest
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run E2E Tests
```bash
npm run test:e2e
```

## 📚 Documentation

- **API Documentation**: Available at `http://localhost:8000/docs` when running
- **User Guide**: See `/docs/user-guide/`
- **Architecture**: See `/docs/architecture/`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Claude AI for intelligent tutoring capabilities
- The SWARM community for distributed computing concepts
- WebAssembly contributors for high-performance browser computing

## 📞 Support

- **Documentation**: [https://docs.ruv-swarm.io](https://docs.ruv-swarm.io)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ruv-swarm-platform/issues)
- **Discord**: [Join our community](https://discord.gg/ruv-swarm)