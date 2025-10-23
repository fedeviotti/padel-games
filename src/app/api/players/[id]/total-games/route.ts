import { and, count, eq, isNull, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const playerId = parseInt(id);

    console.log('API called with player ID:', id, 'parsed as:', playerId);

    if (isNaN(playerId)) {
      console.log('Invalid player ID provided:', id);
      return NextResponse.json({ error: 'Invalid player ID' }, { status: 400 });
    }

    console.log('Fetching total games for player ID:', playerId);

    const result = await db
      .select({ totalGames: count() })
      .from(gameTable)
      .where(
        and(
          isNull(gameTable.deletedAt),
          eq(gameTable.userId, user.id),
          or(
            eq(gameTable.team1Player1, playerId),
            eq(gameTable.team1Player2, playerId),
            eq(gameTable.team2Player1, playerId),
            eq(gameTable.team2Player2, playerId)
          )
        )
      );

    const totalGames = result[0]?.totalGames || 0;
    console.log('Total games found for player:', totalGames);

    return NextResponse.json({ totalGames });
  } catch (error) {
    console.error('Error fetching total games played:', error);
    return NextResponse.json({ error: 'Failed to fetch total games played' }, { status: 500 });
  }
}
