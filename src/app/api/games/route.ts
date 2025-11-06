import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gamesView, gameTable, playerTable, tournamentTable } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const games = await db
      .select()
      .from(gamesView)
      .where(and(isNull(gamesView.deletedAt), eq(gamesView.userId, user.id)))
      .orderBy(desc(gamesView.playedAt));

    // Fetch player names and tournament name for each game
    const gamesWithPlayers = await Promise.all(
      games.map(async (game) => {
        const [t1PlayerDx, t1PlayerSx, t2PlayerDx, t2PlayerSx, tournament] = await Promise.all([
          db
            .select()
            .from(playerTable)
            .where(and(eq(playerTable.id, game.team1PlayerDx), eq(playerTable.userId, user.id)))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(and(eq(playerTable.id, game.team1PlayerSx), eq(playerTable.userId, user.id)))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(and(eq(playerTable.id, game.team2PlayerDx), eq(playerTable.userId, user.id)))
            .then((r) => r[0]),
          db
            .select()
            .from(playerTable)
            .where(and(eq(playerTable.id, game.team2PlayerSx), eq(playerTable.userId, user.id)))
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

        const team1PlayerDxInitial = t1PlayerDx?.firstName?.charAt(0)?.toUpperCase();
        const team1PlayerSxInitial = t1PlayerSx?.firstName?.charAt(0)?.toUpperCase();
        const team2PlayerDxInitial = t2PlayerDx?.firstName?.charAt(0)?.toUpperCase();
        const team2PlayerSxInitial = t2PlayerSx?.firstName?.charAt(0)?.toUpperCase();

        const team1PlayerDxInitialWithDot = team1PlayerDxInitial ? `${team1PlayerDxInitial}.` : '';
        const team1PlayerSxInitialWithDot = team1PlayerSxInitial ? `${team1PlayerSxInitial}.` : '';
        const team2PlayerDxInitialWithDot = team2PlayerDxInitial ? `${team2PlayerDxInitial}.` : '';
        const team2PlayerSxInitialWithDot = team2PlayerSxInitial ? `${team2PlayerSxInitial}.` : '';

        return {
          ...game,
          team1PlayerDxName: `${t1PlayerDx?.lastName} ${team1PlayerDxInitialWithDot}` || 'Unknown',
          team1PlayerSxName: `${t1PlayerSx?.lastName} ${team1PlayerSxInitialWithDot}` || 'Unknown',
          team2PlayerDxName: `${t2PlayerDx?.lastName} ${team2PlayerDxInitialWithDot}` || 'Unknown',
          team2PlayerSxName: `${t2PlayerSx?.lastName} ${team2PlayerSxInitialWithDot}` || 'Unknown',
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
      team1PlayerDx,
      team1PlayerSx,
      team2PlayerDx,
      team2PlayerSx,
      team1Set1Score,
      team2Set1Score,
      team1Set2Score,
      team2Set2Score,
      team1Set3Score,
      team2Set3Score,
      tournamentId,
    } = body;

    if (!playedAt || !team1PlayerDx || !team1PlayerSx || !team2PlayerDx || !team2PlayerSx) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate that all players belong to the current user
    const playerIds = [team1PlayerDx, team1PlayerSx, team2PlayerDx, team2PlayerSx];
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
        team1PlayerDx,
        team1PlayerSx,
        team2PlayerDx,
        team2PlayerSx,
        team1Set1Score,
        team2Set1Score,
        team1Set2Score,
        team2Set2Score,
        team1Set3Score,
        team2Set3Score,
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
