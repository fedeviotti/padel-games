import { and, count, eq, isNull, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; opponentId: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, opponentId } = await params;
    const playerId = parseInt(id);
    const opponentPlayerId = parseInt(opponentId);

    console.log('API called with player ID:', id, 'and opponent ID:', opponentId);

    if (isNaN(playerId)) {
      console.log('Invalid player ID provided:', id);
      return NextResponse.json({ error: 'Invalid player ID' }, { status: 400 });
    }

    if (isNaN(opponentPlayerId)) {
      console.log('Invalid opponent ID provided:', opponentId);
      return NextResponse.json({ error: 'Invalid opponent ID' }, { status: 400 });
    }

    console.log(
      'Fetching total wins for player ID:',
      playerId,
      'against opponent ID:',
      opponentPlayerId
    );

    // Count wins where player is on team1 and team1 won, and opponent is on team2
    const playerTeam1Wins = await db
      .select({ wins: count() })
      .from(gameTable)
      .where(
        and(
          isNull(gameTable.deletedAt),
          eq(gameTable.userId, user.id),
          eq(gameTable.winningTeam, 1),
          or(eq(gameTable.team1PlayerDx, playerId), eq(gameTable.team1PlayerSx, playerId)),
          or(
            eq(gameTable.team2PlayerDx, opponentPlayerId),
            eq(gameTable.team2PlayerSx, opponentPlayerId)
          )
        )
      );

    // Count wins where player is on team2 and team2 won, and opponent is on team1
    const playerTeam2Wins = await db
      .select({ wins: count() })
      .from(gameTable)
      .where(
        and(
          isNull(gameTable.deletedAt),
          eq(gameTable.userId, user.id),
          eq(gameTable.winningTeam, 2),
          or(eq(gameTable.team2PlayerDx, playerId), eq(gameTable.team2PlayerSx, playerId)),
          or(
            eq(gameTable.team1PlayerDx, opponentPlayerId),
            eq(gameTable.team1PlayerSx, opponentPlayerId)
          )
        )
      );

    const totalWins = (playerTeam1Wins[0]?.wins || 0) + (playerTeam2Wins[0]?.wins || 0);
    console.log('Player team 1 wins against opponent:', playerTeam1Wins[0]?.wins || 0);
    console.log('Player team 2 wins against opponent:', playerTeam2Wins[0]?.wins || 0);
    console.log('Total wins for player against opponent:', totalWins);

    return NextResponse.json({ totalWins });
  } catch (error) {
    console.error('Error fetching total wins between players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total wins between players' },
      { status: 500 }
    );
  }
}
