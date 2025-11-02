import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const playerTable = pgTable('players', {
  id: serial('id').primaryKey(),
  firstName: text('first_name'),
  lastName: text('last_name').notNull().default(''),
  yearOfBirth: text('year_of_birth'),
  nickname: text('nickname'),
  userId: text('user_id').notNull(),
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
  team1PlayerDx: integer('team1_player_dx')
    .notNull()
    .references(() => playerTable.id),
  team1PlayerSx: integer('team1_player_sx')
    .notNull()
    .references(() => playerTable.id),

  // Players of Team 2
  team2PlayerDx: integer('team2_player_dx')
    .notNull()
    .references(() => playerTable.id),
  team2PlayerSx: integer('team2_player_sx')
    .notNull()
    .references(() => playerTable.id),

  // Set scored by each team
  team1SetScore: integer('team1_set_score').notNull(),
  team2SetScore: integer('team2_set_score').notNull(),

  // Result
  winningTeam: integer('winning_team').notNull(), // 1 or 2
  totalGamesDifference: integer('total_games_difference').notNull(),

  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  tournamentId: integer('tournament_id').references(() => tournamentTable.id),
});
export type InsertGame = typeof gameTable.$inferInsert;
export type SelectGame = typeof gameTable.$inferSelect;

export const tournamentTable = pgTable('tournaments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
export type InsertTournament = typeof tournamentTable.$inferInsert;
export type SelectTournament = typeof tournamentTable.$inferSelect;
