import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable, playerTable, tournamentTable } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const games = await db
      .select()
      .from(gameTable)
      .where(and(isNull(gameTable.deletedAt), eq(gameTable.userId, user.id)))
      .orderBy(desc(gameTable.playedAt));

    // Fetch player names and tournament name for each game
    const gamesWithPlayers = await Promise.all(
      games.map(async (game) => {
        const [t1p1, t1p2, t2p1, t2p2, tournament] = await Promise.all([
          db
            .select()
            .from(playerTable)
            .where(and(eq(playerTable.id, game.team1Player1), eq(playerTable.userId, user.id)))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(and(eq(playerTable.id, game.team1Player2), eq(playerTable.userId, user.id)))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(and(eq(playerTable.id, game.team2Player1), eq(playerTable.userId, user.id)))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(and(eq(playerTable.id, game.team2Player2), eq(playerTable.userId, user.id)))
            .then((r) => r[0]),
          game.tournamentId
            ? db
                .select()
                .from(tournamentTable)
                .where(
                  and(
                    eq(tournamentTable.id, game.tournamentId),
                    eq(tournamentTable.userId, user.id)
                  )
                )
                .then((r) => r[0])
            : null,
        ]);

        const team1Player1Initial = t1p1?.firstName?.charAt(0)?.toUpperCase();
        const team1Player2Initial = t1p2?.firstName?.charAt(0)?.toUpperCase();
        const team2Player1Initial = t2p1?.firstName?.charAt(0)?.toUpperCase();
        const team2Player2Initial = t2p2?.firstName?.charAt(0)?.toUpperCase();

        const team1Player1InitialWithDot = team1Player1Initial ? `${team1Player1Initial}.` : '';
        const team1Player2InitialWithDot = team1Player2Initial ? `${team1Player2Initial}.` : '';
        const team2Player1InitialWithDot = team2Player1Initial ? `${team2Player1Initial}.` : '';
        const team2Player2InitialWithDot = team2Player2Initial ? `${team2Player2Initial}.` : '';

        return {
          ...game,
          team1Player1Name: `${team1Player1InitialWithDot} ${t1p1?.lastName}` || 'Unknown',
          team1Player2Name: `${team1Player2InitialWithDot} ${t1p2?.lastName}` || 'Unknown',
          team2Player1Name: `${team2Player1InitialWithDot} ${t2p1?.lastName}` || 'Unknown',
          team2Player2Name: `${team2Player2InitialWithDot} ${t2p2?.lastName}` || 'Unknown',
          tournamentName: tournament?.name || null,
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
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      tournamentId,
    } = body;

    if (
      !playedAt ||
      !team1Player1 ||
      !team1Player2 ||
      !team2Player1 ||
      !team2Player2 ||
      team1SetScore === undefined ||
      team2SetScore === undefined ||
      winningTeam === undefined ||
      totalGamesDifference === undefined
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate that all players belong to the current user
    const playerIds = [team1Player1, team1Player2, team2Player1, team2Player2];
    const players = await db
      .select()
      .from(playerTable)
      .where(and(eq(playerTable.userId, user.id), inArray(playerTable.id, playerIds)));

    if (players.length !== 4) {
      return NextResponse.json(
        { error: 'One or more players not found or not owned by user' },
        { status: 400 }
      );
    }

    // Validate tournament ownership if provided
    if (tournamentId) {
      const tournament = await db
        .select()
        .from(tournamentTable)
        .where(and(eq(tournamentTable.id, tournamentId), eq(tournamentTable.userId, user.id)));

      if (tournament.length === 0) {
        return NextResponse.json(
          { error: 'Tournament not found or not owned by user' },
          { status: 400 }
        );
      }
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
        tournamentId: tournamentId || null,
        userId: user.id,
      })
      .returning();

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
