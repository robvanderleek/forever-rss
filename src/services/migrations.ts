import {Kysely, Migration, sql} from "kysely";

export const migrations: Record<string, Migration> = {
    '20230528': {
        async up(db: Kysely<any>): Promise<void> {
            await db.schema
                .createTable('feed')
                .ifNotExists()
                .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
                .addColumn('title', 'varchar', (col) => col.notNull())
                .addColumn('url', 'varchar', (col) => col.unique().notNull())
                .execute();

            await db.schema
                .createTable('subscription')
                .ifNotExists()
                .addColumn('user', 'varchar')
                .addColumn('feed_id', 'uuid', (col) => col.references('feed.id').notNull())
                .execute();

            await db.schema
                .createTable('feedAccessTime')
                .ifNotExists()
                .addColumn('user', 'varchar')
                .addColumn('feed_id', 'uuid', (col) => col.references('feed.id').notNull())
                .addColumn('date', 'timestamp')
                .addPrimaryKeyConstraint('pk1', ['user', 'feed_id'])
                .execute();
        },
        async down(db: Kysely<any>): Promise<void> {
            await db.schema.dropTable('feedAccessTime');
            await db.schema.dropTable('subscription');
            await db.schema.dropTable('feed');
        }
    }
}