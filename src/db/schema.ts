import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const playerTable = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  dob: timestamp('dob').notNull(),
  nickname: text('nickname'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type InsertPlayer = typeof playerTable.$inferInsert;
export type SelectPlayer = typeof playerTable.$inferSelect;