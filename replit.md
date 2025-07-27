# Dashboard Management System

## Overview

This is a modern full-stack web application built for dashboard management with Hebrew language support. It features a React frontend with shadcn/ui components, an Express.js backend, and uses Drizzle ORM for database operations. The application is designed to manage dashboard items and progress groups with full CRUD operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom gradient colors and CSS variables
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration and aliases

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful API with JSON responses
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

### Key Design Decisions
1. **Monorepo Structure**: Shared schema and types between client and server
2. **Type Safety**: Full TypeScript coverage with shared interfaces
3. **Component Library**: shadcn/ui for consistent, accessible UI components
4. **Right-to-Left Support**: Hebrew language interface with RTL layout
5. **Memory Storage Fallback**: In-memory storage implementation for development

## Key Components

### Database Schema (`shared/schema.ts`)
- **Users**: Basic user authentication with username/password
- **Dashboard Items**: Main entities with site, status, date, contact, and client information
- **Progress Groups**: Progress tracking with completion metrics

### API Routes (`server/routes.ts`)
- `GET /api/dashboard-items` - Fetch all dashboard items
- `POST /api/dashboard-items` - Create new dashboard item
- `PUT /api/dashboard-items/:id` - Update existing dashboard item
- `DELETE /api/dashboard-items/:id` - Delete dashboard item
- Similar CRUD operations for progress groups

### UI Components
- **GradientButton**: Custom button component with themed gradients
- **ProgressCard**: Visual progress tracking cards
- **DataTable**: Comprehensive table with edit functionality
- **shadcn/ui**: Complete set of accessible UI primitives

### Storage Layer (`server/storage.ts`)
- Interface-based storage abstraction (`IStorage`)
- Memory storage implementation with sample Hebrew data
- Database-ready architecture for easy PostgreSQL integration

## Data Flow

1. **Client Request**: React components use TanStack React Query hooks
2. **API Layer**: Express routes handle HTTP requests with validation
3. **Storage Layer**: Storage interface abstracts data persistence
4. **Database**: Drizzle ORM manages PostgreSQL operations
5. **Response**: JSON data flows back through the same path

### Request Lifecycle
```
React Component → useQuery Hook → API Request → Express Route → Storage Interface → Database → Response
```

## External Dependencies

### Core Technologies
- **Database**: Neon Database (serverless PostgreSQL)
- **UI Framework**: Radix UI primitives
- **Validation**: Zod for runtime type checking
- **Forms**: React Hook Form with resolvers
- **Styling**: Tailwind CSS with PostCSS

### Development Tools
- **Build**: Vite with React plugin
- **Database**: Drizzle Kit for migrations
- **Development**: tsx for TypeScript execution
- **Bundling**: esbuild for server bundling

## Deployment Strategy

### Development Mode
- Vite dev server for frontend with HMR
- tsx for backend TypeScript execution
- Environment variables for database configuration
- Replit-specific development tools integration

### Production Build
1. **Frontend**: Vite builds static assets to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `drizzle-kit push`
4. **Deployment**: Single Node.js process serving static files and API

### Configuration
- Environment variable `DATABASE_URL` required for PostgreSQL connection
- Build outputs to `dist/` directory for production deployment
- Static file serving integrated into Express server

### Key Features
- Hebrew language interface with RTL support
- Gradient-based visual design system
- Real-time progress tracking
- Comprehensive CRUD operations
- Type-safe API with validation
- Responsive design with mobile support
- **PostgreSQL Database Integration**: Persistent data storage with Drizzle ORM
  - Real-time data persistence across server restarts
  - Sample Hebrew data seeding
  - Optimized database queries and relationships
- **Advanced Element Inspector System**: Live element editing similar to browser dev tools
  - Real-time visual feedback with hover and selection overlays
  - Draggable inspector panel with visual effects
  - Element information display (tag name, classes)
  - Multi-element selection with Shift+click
  - Ctrl+click preserves original functionality
  - Organized editing interface with colorful gradients and tabs
  - Color picker, gradient selection, typography controls
  - Element movement and resizing capabilities
  - Reset and undo functionality

### Recent Updates (January 27, 2025)
- **Database Integration**: Migrated from memory storage to PostgreSQL with Drizzle ORM
- **Inspector Enhancement**: Added draggable panel functionality with elaborate gradient design
- **GitHub Repository**: Project available at https://github.com/ticnutai/office.git
- **Data Persistence**: All dashboard items and progress groups now saved permanently