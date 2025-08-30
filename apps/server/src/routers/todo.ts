import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { todo } from '../db/schema/todo';
import { protectedProcedure } from '../lib/orpc';

export const todoRouter = {
  getAll: protectedProcedure
    .route({ method: 'GET', path: '/todos' })
    .handler(async () => {
      return await db.select().from(todo);
    }),

  create: protectedProcedure
    .route({ method: 'POST', path: '/todos' })
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      return await db.insert(todo).values({
        text: input.text,
      });
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
      return await db
        .update(todo)
        .set({ completed: input.completed })
        .where(eq(todo.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      return await db.delete(todo).where(eq(todo.id, input.id));
    }),
};
