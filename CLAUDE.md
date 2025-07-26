# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rice Platform (智慧农业溯源系统) is a full-stack agricultural traceability system with separate frontend (Vue 3) and backend (Node.js/Express) applications. The system serves farmers, buyers, and administrators with role-based interfaces.

## Development Commands

### Frontend Development
```bash
cd frontend
pnpm install
pnpm run dev        # Start development server on http://localhost:3000
pnpm run build      # Build for production
pnpm run lint       # Run ESLint with auto-fix
pnpm run type-check # TypeScript type checking
```

### Backend Development  
```bash
cd backend
pnpm install
pnpm run dev        # Start development server on http://localhost:3001
pnpm run build      # Compile TypeScript to dist/
pnpm run start      # Run compiled JavaScript
pnpm run test       # Run Jest tests
pnpm run test:watch # Run tests in watch mode
```

### Docker Development
```bash
# Run full stack with Docker
docker-compose up --build
# Background mode
docker-compose up -d
```

## Architecture Overview

### Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS + Element Plus + Pinia
- **Backend**: Node.js + Express + TypeScript + MySQL + JWT
- **Tools**: pnpm, Docker, Jest

### Project Structure
```
rice-platform/
├── frontend/           # Vue 3 application
│   ├── src/
│   │   ├── components/ # Reusable Vue components
│   │   │   ├── common/ # Shared components (BaseButton, TopNav, etc.)
│   │   │   └── homepage/ # Homepage-specific components  
│   │   ├── views/      # Page components by role
│   │   │   ├── farmer/ # Farmer-specific pages
│   │   │   ├── buyer/  # Buyer-specific pages
│   │   │   └── admin/  # Admin-specific pages
│   │   ├── router/     # Vue Router configuration
│   │   ├── services/   # API service layer
│   │   └── styles/     # CSS organization
├── backend/            # Express API server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/     # Database models
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Auth, upload middleware
│   │   └── config/     # Database configuration
└── rice-platform-prototype/ # Original HTML prototypes
```

### Key Components Architecture

**Frontend Component System:**
- `components/common/` contains reusable components with TypeScript interfaces
- Role-based page organization in `views/farmer/`, `views/buyer/`, `views/admin/`
- CSS organized in `styles/` with variables, base, layout, and component styles
- Mobile-first responsive design with Tailwind CSS

**Backend API Architecture:**
- RESTful API structure with controllers handling business logic
- JWT-based authentication middleware
- MySQL database with models for User, Farmer, FarmerProfile
- File upload handling for avatar images in `uploads/avatars/`

## Important Development Guidelines

### Component Usage Rules
1. **No iOS Status Bar**: Never implement iOS status bars in components - start directly with TopNav
2. **Component Verification**: Always check actual component props in source code, don't rely on documentation
3. **Existing Components**: Use `LS` and `Read` tools to verify component existence and interfaces before usage

### Key Component Interfaces
- **TimelineItem**: Props are `date`, `title`, `description`, `image`, `tags`, `metadata`, `actions`
- **TopNav**: Props are `title`, `showBack` with `actions` slot
- **FormInput**: Props are `modelValue`, `label`, `placeholder`, `type`, `required`, etc.
- **BaseButton**: Props are `label`, `variant`, `size`, `disabled`, `loading`, `icon`

### API Integration
- Frontend uses `services/api.ts` for backend communication
- Backend API base URL: `http://localhost:3001/api/`
- JWT tokens required for authenticated endpoints
- File uploads use multipart/form-data with size limits

### Mobile-First Design
- Use CSS variables defined in `styles/variables.css`
- Implement elderly-friendly design (large fonts, high contrast, big buttons)
- Test across devices: mobile (375px), tablet (768px), desktop (1024px+)

### Database Schema
- `users` table: id, account, password, roles, status, timestamps  
- `farmer_profiles` table: user_id, name, phone, location, farm_info, avatar_url, timestamps

## Testing & Quality
- Backend has Jest tests configured with test database setup
- Frontend has ESLint and TypeScript checking
- Always run lint and type-check commands before committing
- Test responsive design across multiple device sizes

## Development Workflow
1. Use separate terminals for frontend and backend development servers
2. Frontend proxy configuration handles API routing to backend
3. Both services must run simultaneously for full functionality
4. Check `API_DOCUMENTATION.md` for backend endpoint specifications

## Styling System
- Uses Tailwind CSS with custom configuration
- PostCSS with px-to-rem conversion for mobile responsiveness  
- CSS variables for theme colors and sizing in `:root`
- Scoped styles in Vue components to prevent conflicts
- Media queries follow mobile-first approach with min-width breakpoints

## Development Configuration Memories

### Database Configuration
- MySQL Default Configurations:
  * Local Development Environment: 
    - Username: root
    - Password: root
    - Port: 3306
  * Docker Development Environment:
    - Username: root
    - Password: root
    - Port: 3307
  * Note: Default environment is local development unless explicitly specified