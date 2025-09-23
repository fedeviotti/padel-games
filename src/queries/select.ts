import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { SelectPlayer, playerTable } from '../db/schema';

export async function getPlayerById(id: SelectPlayer['id']): Promise<
  Array<{
    id: number;
    name: string;
    dob: Date;
    email: string;
  }>
> {
  return db.select().from(playerTable).where(eq(playerTable.id, id));
}

export async function getPlayers(): Promise<
  Array<{
    id: number;
    name: string;
    dob: Date;
    email: string;
  }>
> {
  return db.select().from(playerTable);
}
