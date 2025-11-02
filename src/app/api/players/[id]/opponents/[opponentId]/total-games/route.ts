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
      'Fetching total games between player ID:',
      playerId,
      'and opponent ID:',
      opponentPlayerId
    );

    // Count games where both players are on opposite teams
    // Player can be on team1 (player1 or player2) and opponent on team2 (player1 or player2)
    // OR player can be on team2 (player1 or player2) and opponent on team1 (player1 or player2)
    const result = await db
      .select({ totalGames: count() })
      .from(gameTable)
      .where(
        and(
          isNull(gameTable.deletedAt),
          eq(gameTable.userId, user.id),
          or(
            // Player on team1, opponent on team2
            and(
              or(eq(gameTable.team1PlayerDx, playerId), eq(gameTable.team1PlayerSx, playerId)),
              or(
                eq(gameTable.team2PlayerDx, opponentPlayerId),
                eq(gameTable.team2PlayerSx, opponentPlayerId)
              )
            ),
            // Player on team2, opponent on team1
            and(
              or(eq(gameTable.team2PlayerDx, playerId), eq(gameTable.team2PlayerSx, playerId)),
              or(
                eq(gameTable.team1PlayerDx, opponentPlayerId),
                eq(gameTable.team1PlayerSx, opponentPlayerId)
              )
            )
          )
        )
      );

    const totalGames = result[0]?.totalGames || 0;
    console.log('Total games found between players:', totalGames);

    return NextResponse.json({ totalGames });
  } catch (error) {
    console.error('Error fetching total games between players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total games between players' },
      { status: 500 }
    );
  }
}
