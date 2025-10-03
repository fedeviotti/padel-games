import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const playerTable = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  yearOfBirth: text('year_of_birth'),
  nickname: text('nickname'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
export type InsertPlayer = typeof playerTable.$inferInsert;
export type SelectPlayer = typeof playerTable.$inferSelect;

export const gameTable = pgTable('games', {
  id: serial('id').primaryKey(),
  playedAt: timestamp('played_at').notNull(),

  // Players of Team 1
  team1Player1: integer('team1_player1')
    .notNull()
    .references(() => playerTable.id),
  team1Player2: integer('team1_player2')
    .notNull()
    .references(() => playerTable.id),

  // Players of Team 2
  team2Player1: integer('team2_player1')
    .notNull()
    .references(() => playerTable.id),
  team2Player2: integer('team2_player2')
    .notNull()
    .references(() => playerTable.id),

  // Set scored by each team
  team1SetScore: integer('team1_set_score').notNull(),
  team2SetScore: integer('team2_set_score').notNull(),

  // Result
  winningTeam: integer('winning_team').notNull(), // 1 or 2
  totalGamesDifference: integer('total_games_difference').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
export type InsertGame = typeof gameTable.$inferInsert;
export type SelectGame = typeof gameTable.$inferSelect;
