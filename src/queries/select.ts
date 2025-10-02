import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { SelectPlayer, playerTable } from '@/db/schema';

export async function getPlayerById(id: SelectPlayer['id']): Promise<SelectPlayer[]> {
  return db.select().from(playerTable).where(eq(playerTable.id, id));
}

export async function getPlayers(): Promise<SelectPlayer[]> {
  return db.select().from(playerTable);
}
