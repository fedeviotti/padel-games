import { SelectGamesView } from '@/db/schema';

export type GameWithPlayers = SelectGamesView & {
  team1PlayerDxName: string;
  team1PlayerSxName: string;
  team2PlayerDxName: string;
  team2PlayerSxName: string;
  tournamentName: string | null;
};
