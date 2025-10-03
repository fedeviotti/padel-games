import { desc, eq, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable, playerTable } from '@/db/schema';

export async function GET() {
  try {
    const games = await db
      .select()
      .from(gameTable)
      .where(isNull(gameTable.deletedAt))
      .orderBy(desc(gameTable.playedAt));

    // Fetch player names for each game
    const gamesWithPlayers = await Promise.all(
      games.map(async (game) => {
        const [t1p1, t1p2, t2p1, t2p2] = await Promise.all([
          db
            .select()
            .from(playerTable)
            .where(eq(playerTable.id, game.team1Player1))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(eq(playerTable.id, game.team1Player2))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(eq(playerTable.id, game.team2Player1))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(eq(playerTable.id, game.team2Player2))
            .then((r) => r[0]),
        ]);

        return {
          ...game,
          team1Player1Name: t1p1?.name || 'Unknown',
          team1Player2Name: t1p2?.name || 'Unknown',
          team2Player1Name: t2p1?.name || 'Unknown',
          team2Player2Name: t2p2?.name || 'Unknown',
        };
      })
    );

    return NextResponse.json(gamesWithPlayers);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      playedAt,
      team1Player1,
      team1Player2,
      team2Player1,
      team2Player2,
      team1SetScore,
      team2SetScore,
      winningTeam,
      totalGamesDifference,
    } = body;

    if (
      !playedAt ||
      !team1Player1 ||
      !team1Player2 ||
      !team2Player1 ||
      !team2Player2 ||
      team1SetScore === undefined ||
      team2SetScore === undefined ||
      !winningTeam ||
      totalGamesDifference === undefined
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newGame] = await db
      .insert(gameTable)
      .values({
        playedAt: new Date(playedAt),
        team1Player1,
        team1Player2,
        team2Player1,
        team2Player2,
        team1SetScore,
        team2SetScore,
        winningTeam,
        totalGamesDifference,
      })
      .returning();

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
