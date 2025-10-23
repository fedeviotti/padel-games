import { and, eq, inArray } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable, playerTable, tournamentTable } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = (await params).id;
    const gameId = parseInt(id);

    const [game] = await db
      .select()
      .from(gameTable)
      .where(and(eq(gameTable.id, gameId), eq(gameTable.userId, user.id)));

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const id = (await params).id;
    const gameId = parseInt(id);

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

    const [updatedGame] = await db
      .update(gameTable)
      .set({
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
        updatedAt: new Date(),
      })
      .where(and(eq(gameTable.id, gameId), eq(gameTable.userId, user.id)))
      .returning();

    if (!updatedGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = (await params).id;
    const gameId = parseInt(id);

    const [deletedGame] = await db
      .update(gameTable)
      .set({
        deletedAt: new Date(),
      })
      .where(and(eq(gameTable.id, gameId), eq(gameTable.userId, user.id)))
      .returning();

    if (!deletedGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}
