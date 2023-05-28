import {NextApiRequest, NextApiResponse} from 'next';
import {createKysely} from '@vercel/postgres-kysely';
import {Kysely, sql} from "kysely";
import {Database} from "@/entities/schemas/Database";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const db = createKysely<any>();
    await setupDatabase(db);
    return response.status(200).json('Schema created');
}

export async function setupDatabase(db: Kysely<Database>) {
    await db.schema
        .createTable('feed')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('title', 'varchar', (col) => col.notNull())
        .addColumn('url', 'varchar', (col) => col.notNull())
        .execute();

    await db.schema
        .createTable('subscription')
        .addColumn('user', 'varchar')
        .addColumn('feed_id', 'uuid', (col) => col.references('feed.id').notNull())
        .execute();

    await db.schema
        .createTable('feedAccessTime')
        .addColumn('user', 'varchar')
        .addColumn('feed_id', 'uuid', (col) => col.references('feed.id').notNull())
        .addColumn('date', 'timestamp')
        .addPrimaryKeyConstraint('pk1', ['user', 'feed_id'])
        .execute();
}