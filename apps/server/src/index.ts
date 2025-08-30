import { env } from 'cloudflare:workers';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { RPCHandler } from '@orpc/server/fetch';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { auth } from './lib/auth';
import { createContext } from './lib/context';
import { appRouter } from './routers/index';

// const generator = new OpenAPIGenerator({
//   schemaConverters: [new ZodToJsonSchemaConverter()],
// });
const app = new Hono();

app.use(logger());
app.use(
  '/*',
  cors({
    origin: env.CORS_ORIGIN || '',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Auth endpoints
app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

// RPC endpoints
const handler = new RPCHandler(appRouter);
app.use('/rpc/*', async (c, next) => {
  const context = await createContext({ context: c });
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: '/rpc',
    context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
});

// OpenAPI Handler for REST endpoints
const openApiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      docsProvider: 'scalar',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'Your API',
          version: '1.0.0',
        },
        servers: [
          {
            url: '/api',
          },
        ],
      },
    }),
  ],
});

// Handle REST API endpoints
app.use('/api/*', async (c, next) => {
  const context = await createContext({ context: c });
  const { matched, response } = await openApiHandler.handle(c.req.raw, {
    prefix: '/api',
    context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
});

// Handle docs endpoint
app.use('/docs/*', async (c, next) => {
  const context = await createContext({ context: c });
  const { matched, response } = await openApiHandler.handle(c.req.raw, {
    prefix: '/docs',
    context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
});

app.get('/', (c) => {
  return c.text('OK');
});

export default app;
