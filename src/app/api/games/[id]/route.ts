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
      team1PlayerDx,
      team1PlayerSx,
      team2PlayerDx,
      team2PlayerSx,
      // team1SetScore,
      //team2SetScore,
      //winningTeam,
      team1Set1Score,
      team2Set1Score,
      team1Set2Score,
      team2Set2Score,
      team1Set3Score,
      team2Set3Score,
      tournamentId,
    } = body;
    const id = (await params).id;
    const gameId = parseInt(id);

    if (
      !playedAt ||
      !team1PlayerDx ||
      !team1PlayerSx ||
      !team2PlayerDx ||
      !team2PlayerSx //||
      // team1SetScore === undefined ||
      // team2SetScore === undefined ||
      //winningTeam === undefined
    ) {
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

    const [updatedGame] = await db
      .update(gameTable)
      .set({
        playedAt: new Date(playedAt),
        team1PlayerDx,
        team1PlayerSx,
        team2PlayerDx,
        team2PlayerSx,
        //team1SetScore,
        // team2SetScore,
        //winningTeam,
        team1Set1Score,
        team2Set1Score,
        team1Set2Score,
        team2Set2Score,
        team1Set3Score,
        team2Set3Score,
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
