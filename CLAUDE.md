# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `bun install` - Install all dependencies
- `bun dev` - Start all applications (web on :3001, server on :3000)
- `bun dev:web` - Start only the web application
- `bun dev:server` - Start only the server
- `bun build` - Build all applications
- `bun check-types` - Type check across all apps

### Database Management
- `bun db:push` - Push schema changes to database
- `bun db:generate` - Generate database migrations
- `bun db:studio` - Open database studio UI (from apps/server)

### Code Quality
- `bun lint` - Run Ultracite linter across project
- `bun format` - Auto-format code with Ultracite
- `bun check` - Run Biome checks with auto-fix

### Deployment (Alchemy)
- `bun deploy` - Deploy to Cloudflare
- `bun destroy` - Destroy deployment
- Alchemy handles D1 database migrations automatically during deployment

## Architecture Overview

This is a **full-stack TypeScript monorepo** using modern tools for end-to-end type safety and performance.

### Core Stack
- **Monorepo**: Turborepo for build orchestration
- **Runtime**: Bun for package management and script execution
- **Deployment**: Alchemy for Cloudflare Workers deployment
- **Database**: Drizzle ORM with SQLite/D1, auto-migration via Alchemy
- **Authentication**: Better-Auth with session-based auth
- **API**: oRPC for type-safe RPC and OpenAPI REST endpoints

### Application Structure

#### Backend (`apps/server/`)
- **Framework**: Hono on Cloudflare Workers
- **API Layer**: Dual RPC + REST via oRPC
  - RPC endpoints: `POST /rpc/*` (type-safe procedure calls)
  - REST endpoints: `GET|POST /api/*` (OpenAPI-compliant)
  - Authentication: `/api/auth/**` (Better-Auth handlers)
- **Database**: Drizzle ORM with D1 (SQLite)
- **Procedures**: 
  - `publicProcedure` - No auth required
  - `protectedProcedure` - Requires authenticated session

#### Frontend (`apps/web/`)
- **Framework**: TanStack Start (SSR React framework)
- **Router**: TanStack Router with file-based routing
- **Styling**: TailwindCSS v4 with shadcn/ui components
- **State**: TanStack Query for server state
- **Forms**: TanStack Form with Zod validation
- **Client**: oRPC client with automatic type inference

### Key Integration Points

#### Type Safety Chain
1. Database schema (`apps/server/src/db/schema/`) defines data models
2. oRPC procedures (`apps/server/src/routers/`) define API contracts
3. Router exports (`AppRouter` type) provide client-side types
4. Frontend imports router types for end-to-end type safety

#### Authentication Flow
1. Better-Auth handles session management with secure cookies
2. `createContext()` extracts session from request headers
3. `protectedProcedure` middleware enforces authentication
4. Frontend routes use `authClient.useSession()` for auth checks
5. Protected routes redirect to `/login` if unauthenticated

#### oRPC Dual API Pattern
- **Same procedures** serve both RPC and REST clients
- RPC calls: `POST /rpc/todo.getAll` with JSON body
- REST calls: `GET /api/todos` with standard HTTP semantics
- OpenAPI documentation auto-generated at `/docs` (Scalar UI)

### Development Patterns

#### Adding New Features
1. Define database schema in `apps/server/src/db/schema/`
2. Run `bun db:generate && bun db:push` to apply changes
3. Create oRPC procedures in `apps/server/src/routers/`
4. Export from main router to update type definitions
5. Frontend automatically gets typed client via oRPC utils

#### Authentication Requirements
- Use `protectedProcedure` for routes requiring auth
- Frontend routes should check session with `useEffect` + redirect pattern
- Include `credentials: 'include'` for cookie-based authentication

#### Code Quality Standards
- Project uses **Ultracite** (Biome-based) for formatting and linting
- Enforces strict accessibility standards and TypeScript rules
- CSS files may show linting warnings for Tailwind directives (expected)
- Run `bun format` to auto-fix formatting issues

### Environment Configuration
- Web app: Port 3001
- Server API: Port 3000
- Environment variables managed via Alchemy configuration
- D1 database provisioned and configured automatically