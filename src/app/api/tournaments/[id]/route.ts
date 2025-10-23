import { and, eq, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable, tournamentTable } from '@/db/schema';
import { stackServerApp } from '@/stack/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = (await params).id;
    const tournamentId = parseInt(id);

    const [tournament] = await db
      .select()
      .from(tournamentTable)
      .where(and(eq(tournamentTable.id, tournamentId), eq(tournamentTable.userId, user.id)));

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json({ error: 'Failed to fetch tournament' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = (await params).id;
    const tournamentId = parseInt(id);
    const body = await request.json();
    const { name, startDate, endDate } = body;

    if (!name || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [updatedTournament] = await db
      .update(tournamentTable)
      .set({
        name: name,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        updatedAt: new Date(),
      })
      .where(and(eq(tournamentTable.id, tournamentId), eq(tournamentTable.userId, user.id)))
      .returning();

    if (!updatedTournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTournament);
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = (await params).id;
    const tournamentId = parseInt(id);

    // Check if there are any games associated with this tournament
    const gamesWithTournament = await db
      .select()
      .from(gameTable)
      .where(
        and(
          eq(gameTable.tournamentId, tournamentId),
          isNull(gameTable.deletedAt),
          eq(gameTable.userId, user.id)
        )
      );

    if (gamesWithTournament.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tournament with associated games' },
        { status: 400 }
      );
    }

    // Soft delete the tournament
    const [deletedTournament] = await db
      .update(tournamentTable)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tournamentTable.id, tournamentId), eq(tournamentTable.userId, user.id)))
      .returning();

    if (!deletedTournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return NextResponse.json({ error: 'Failed to delete tournament' }, { status: 500 });
  }
}
