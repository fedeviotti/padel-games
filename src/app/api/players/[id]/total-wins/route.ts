import { and, count, eq, isNull, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { TEAM_1, TEAM_2 } from '@/constants/constants';
import { db } from '@/db/db';
import { gamesView } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const playerId = parseInt(id);

    console.log('API called with player ID for wins:', id, 'parsed as:', playerId);

    if (isNaN(playerId)) {
      console.log('Invalid player ID provided:', id);
      return NextResponse.json({ error: 'Invalid player ID' }, { status: 400 });
    }

    console.log('Fetching total wins for player ID:', playerId);

    // Count wins where player is in team 1 and team 1 won
    const team1Wins = await db
      .select({ wins: count() })
      .from(gamesView)
      .where(
        and(
          isNull(gamesView.deletedAt),
          eq(gamesView.userId, user.id),
          eq(gamesView.winner, TEAM_1),
          or(eq(gamesView.team1PlayerDx, playerId), eq(gamesView.team1PlayerSx, playerId))
        )
      );

    // Count wins where player is in team 2 and team 2 won
    const team2Wins = await db
      .select({ wins: count() })
      .from(gamesView)
      .where(
        and(
          isNull(gamesView.deletedAt),
          eq(gamesView.userId, user.id),
          eq(gamesView.winner, TEAM_2),
          or(eq(gamesView.team1PlayerDx, playerId), eq(gamesView.team2PlayerSx, playerId))
        )
      );

    const totalWins = (team1Wins[0]?.wins || 0) + (team2Wins[0]?.wins || 0);
    console.log('Team 1 wins:', team1Wins[0]?.wins || 0);
    console.log('Team 2 wins:', team2Wins[0]?.wins || 0);
    console.log('Total wins for player:', totalWins);

    return NextResponse.json({ totalWins });
  } catch (error) {
    console.error('Error fetching total wins:', error);
    return NextResponse.json({ error: 'Failed to fetch total wins' }, { status: 500 });
  }
}
