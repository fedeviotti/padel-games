import { and, eq, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { gameTable, tournamentTable } from '@/db/schema';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const tournamentId = parseInt(params.id);
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
      .where(eq(tournamentTable.id, tournamentId))
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const tournamentId = parseInt(params.id);

    // Check if there are any games associated with this tournament
    const gamesWithTournament = await db
      .select()
      .from(gameTable)
      .where(and(eq(gameTable.tournamentId, tournamentId), isNull(gameTable.deletedAt)));

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
      .where(eq(tournamentTable.id, tournamentId))
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
