import { integer, pgTable, pgView, serial, text, timestamp } from 'drizzle-orm/pg-core';

// TODO: rename to playersTable
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

// TODO: rename to gamesTable
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

  // Detailed set scores (games won per set)
  //setDetails: json('set_details').$type<Array<{ team1Games: number; team2Games: number }>>(),

  team1Set1Score: integer('team1_set1_score'),
  team2Set1Score: integer('team2_set1_score'),

  team1Set2Score: integer('team1_set2_score'),
  team2Set2Score: integer('team2_set2_score'),

  team1Set3Score: integer('team1_set3_score'),
  team2Set3Score: integer('team2_set3_score'),

  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  tournamentId: integer('tournament_id').references(() => tournamentTable.id),
});
export type InsertGame = typeof gameTable.$inferInsert;
export type SelectGame = typeof gameTable.$inferSelect;

// TODO: rename to tournamentsTable
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

export const gamesView = pgView('games_view', {
  id: serial('id'),
  playedAt: timestamp('played_at'),
  team1PlayerDx: integer('team1_player_dx').notNull(),
  team1PlayerSx: integer('team1_player_sx').notNull(),
  team2PlayerDx: integer('team2_player_dx').notNull(),
  team2PlayerSx: integer('team2_player_sx').notNull(),
  team1Set1Score: integer('team1_set1_score'),
  team2Set1Score: integer('team2_set1_score'),
  team1Set2Score: integer('team1_set2_score'),
  team2Set2Score: integer('team2_set2_score'),
  team1Set3Score: integer('team1_set3_score'),
  team2Set3Score: integer('team2_set3_score'),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  deletedAt: timestamp('deleted_at'),
  tournamentId: integer('tournament_id'),
  team1SetsWon: integer('team1_sets_won'),
  team2SetsWon: integer('team2_sets_won'),
  finalSetsScore: integer('final_sets_score'),
  winner: text('winner'),
  setsScoresText: text('sets_scores_text'),
}).existing();

export type SelectGamesView = typeof gamesView.$inferSelect;
