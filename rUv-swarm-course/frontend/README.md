# rUv Swarm Course Platform - Frontend

React-based frontend for the rUv Swarm Course Platform built with Vite and Chakra UI.

## Features

- **Modern React 19** with Vite for fast development
- **Chakra UI v2** for consistent and accessible UI components
- **React Router** for client-side routing
- **Zustand** for lightweight state management
- **Monaco Editor** for code editing with syntax highlighting
- **Axios** for API communication
- **React Icons** for consistent iconography

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Layout components (Header, Sidebar, Layout)
│   ├── Dashboard/       # Dashboard components
│   ├── LessonViewer/    # Lesson viewing components
│   ├── CodeEditor/      # Code editor with Monaco
│   └── Quiz/           # Quiz components
├── pages/              # Page components
├── store/              # Zustand store
├── services/           # API services
├── hooks/              # Custom React hooks
└── utils/              # Utility functions and constants
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Components

### Layout System
- **Layout**: Main layout wrapper with sidebar and header
- **Header**: Top navigation with user menu and notifications
- **Sidebar**: Navigation sidebar with course progress

### Dashboard
- **Dashboard**: Main dashboard with course progress and quick actions

### Learning Components
- **LessonViewer**: Video and text lesson viewer with progress tracking
- **CodeEditor**: Monaco-based code editor with syntax highlighting
- **Quiz**: Interactive quiz system with multiple question types

### State Management

Uses Zustand for state management with the following stores:
- User authentication state
- Course and lesson data
- Progress tracking
- UI state (sidebar, loading, errors)

### API Integration

Axios-based API client with:
- Authentication token handling
- Request/response interceptors
- Error handling
- Automatic token refresh

## Environment Variables

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=rUv Swarm Course Platform
VITE_APP_VERSION=1.0.0
VITE_ENABLE_CODE_EXECUTION=true
VITE_ENABLE_SWARM_LAB=true
```

## Development Notes

- The app uses Chakra UI v2 for consistent styling
- Color mode support is built-in
- All API calls go through the centralized API service
- Components are organized by feature
- State management is kept minimal with Zustand

## Building and Deployment

The app builds to a static site that can be deployed to any static hosting service:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- GitHub Pages

Make sure to set the correct API URL in the environment variables for production.
