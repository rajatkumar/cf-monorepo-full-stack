# cf-monorepo-full-stack

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Start, Hono, ORPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **workers** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **SQLite** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses SQLite with Drizzle ORM.

1. Start the local SQLite database:
   D1 local development and migrations are handled automatically by Alchemy during dev and deploy.

2. Update your `.env` file in the `apps/server` directory with the appropriate connection details if needed.

3. Apply the schema to your database:

```bash
bun db:push
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## API Endpoints

This application provides both RPC and REST API endpoints through oRPC with OpenAPI integration.

### 🔗 API Documentation

- **OpenAPI Docs**: [http://localhost:3000/docs](http://localhost:3000/docs) - Interactive Scalar UI documentation
- **OpenAPI Spec**: [http://localhost:3000/docs/spec.json](http://localhost:3000/docs/spec.json) - OpenAPI specification

### 🚀 RPC Endpoints

All RPC endpoints use POST method and are available at `/rpc/*`:

#### Health & Auth

- `POST /rpc/healthCheck` - Health check endpoint (public)
- `POST /rpc/privateData` - Protected endpoint (requires authentication)

#### Todo Management 🔒

All todo endpoints require authentication:

- `POST /rpc/todo.getAll` - Get all todos (protected)
- `POST /rpc/todo.create` - Create a new todo (protected)
  ```json
  { "text": "Todo item text" }
  ```
- `POST /rpc/todo.toggle` - Toggle todo completion status (protected)
  ```json
  { "id": 1, "completed": true }
  ```
- `POST /rpc/todo.delete` - Delete a todo (protected)
  ```json
  { "id": 1 }
  ```

### 🌐 REST Endpoints

REST endpoints are available at `/api/*`:

#### Todo Management (REST) 🔒

All todo REST endpoints require authentication:

- `GET /api/todos` - Get all todos (protected)
- `POST /api/todos` - Create a new todo (protected)
  ```json
  { "text": "Todo item text" }
  ```

#### Authentication

- `POST /api/auth/sign-in` - User sign in
- `POST /api/auth/sign-up` - User registration
- `GET /api/auth/session` - Get current session

### 📝 Usage Examples

#### RPC Call (using oRPC client):

```javascript
// Note: Authentication is handled automatically by the oRPC client
// if session/cookies are present
const todos = await client.todo.getAll();
const newTodo = await client.todo.create({ text: 'New task' });
```

#### REST Call (using fetch):

```javascript
// Note: Include authentication cookies/headers for protected endpoints
const response = await fetch('/api/todos', {
  credentials: 'include', // Include session cookies
});
const todos = await response.json();
```

#### Authentication Flow:

```javascript
// Sign up new user
await fetch('/api/auth/sign-up', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  }),
});

// Sign in existing user
await fetch('/api/auth/sign-in', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123',
  }),
});
```

## Deployment (Alchemy)

- Dev: bun dev
- Deploy: bun deploy
- Destroy: bun destroy

## Project Structure

```
cf-monorepo-full-stack/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Start)
│   └── server/      # Backend API (Hono, ORPC)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI
- `cd apps/server && bun db:local`: Start the local SQLite database
