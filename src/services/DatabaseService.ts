import {Feed} from "@/entities/Feed";
import {Kysely, Migration, Migrator, PostgresDialect} from "kysely";
import {Database} from "@/entities/schemas/Database";
import {createKysely} from "@vercel/postgres-kysely";
import {Pool} from 'pg'
import {migrations} from "@/services/migrations";
import {logger} from "@/logger";

export class DatabaseService {
    db: Kysely<Database> | undefined;
    connectionString: string | undefined;

    constructor(connectionString?: string) {
        this.connectionString = connectionString;
    }

    async getDatabase(): Promise<Kysely<Database>> {
        if (!this.db) {
            if (this.connectionString) {
                this.db = new Kysely<Database>({
                    dialect: new PostgresDialect({
                        pool: new Pool({connectionString: this.connectionString})
                    })
                });
            } else {
                this.db = createKysely<Database>();
            }
            logger.info('Running database migrations');
            await this.runMigrationsHandRolled(this.db);
        }
        return this.db;
    }

    async runMigrationsHandRolled(db: Kysely<Database>) {
        await db.schema
            .createTable('kysely_migration')
            .ifNotExists()
            .addColumn('name', 'varchar', (col) => col.primaryKey())
            .addColumn('timestamp', 'varchar', (col) => col.notNull())
            .execute();
        for (const key of Object.keys(migrations).sort()) {
            const dbMigration = await db.selectFrom('kysely_migration')
                .where('kysely_migration.name', '=', key)
                .executeTakeFirst();
            if (!dbMigration) {
                logger.info(`Applying database migration: ${key} ...`);
                const migration = migrations[key];
                await migration.up(db);
                await db.insertInto("kysely_migration").values({
                    name: key,
                    timestamp: `${new Date()}`
                }).execute();
            }
        }
    }

    /**
     * @TODO
     * Transactions are not yet supported by Neon
     * Also see: https://vercel.com/docs/errors/vercel-postgres-error-codes#kysely_transactions_not_supported
     */
    async runMigrations(db: Kysely<Database>) {
        const migrator = new Migrator({
            db: db, provider: {
                async getMigrations(): Promise<Record<string, Migration>> {
                    return migrations;
                }
            }
        });
        await migrator.migrateToLatest();
    }

    async getAllUserFeeds(userId: string): Promise<Array<Feed>> {
        const db = await this.getDatabase();
        const feeds = await db.selectFrom('feed')
            .innerJoin('subscription', 'subscription.feed_id', 'feed.id')
            .leftJoin('feedAccessTime', 'feedAccessTime.feed_id', 'feed.id')
            .where('subscription.user', '=', userId)
            .select(['feed.id', 'feed.title', 'feed.url', 'feedAccessTime.date as userAccessTime']).execute();
        return feeds as Array<Feed>;
    }

    async deleteFeed(feed_id: string): Promise<void> {
        const db = await this.getDatabase();
        await db.deleteFrom('feed')
            .where('feed.id', '=', feed_id)
            .execute();
    }

    async getAccessTime(user: string, feed_id: string): Promise<Date | undefined> {
        const db = await this.getDatabase();
        const result = await db.selectFrom('feedAccessTime')
            .where('feedAccessTime.user', '=', user)
            .where('feedAccessTime.feed_id', '=', feed_id)
            .select(['date'])
            .executeTakeFirst();
        return result?.date;
    }

    async updateAccessTime(user: string, feed_id: string): Promise<void> {
        const db = await this.getDatabase();
        await db.insertInto('feedAccessTime').values({
            user,
            feed_id,
            date: new Date()
        }).onConflict(oc => oc.columns(['user', 'feed_id']).doUpdateSet({date: new Date()})).execute();
    }

    async setUpdateTime(feed_id: string, date: Date): Promise<void> {
        const db = await this.getDatabase();
        await db.updateTable('feed').set({latest_update: date}).where('feed.id', '=', feed_id).execute();
    }

    async addFeed(title: string, url: string): Promise<Feed> {
        const db = await this.getDatabase();
        return await db.insertInto('feed').values({title, url}).returningAll().executeTakeFirstOrThrow();
    }

    async getFeedById(feed_id: string): Promise<Feed | undefined> {
        const db = await this.getDatabase();
        return await db.selectFrom('feed')
            .where('feed.id', '=', feed_id)
            .select(['feed.id', 'feed.title', 'feed.url', 'feed.latest_update as latestUpdate'])
            .executeTakeFirst();
    }

    async getFeedByUrl(url: string): Promise<Feed | undefined> {
        const db = await this.getDatabase();
        return await db.selectFrom('feed')
            .where('feed.url', '=', url)
            .select(['feed.id', 'feed.title', 'feed.url', 'feed.latest_update as latestUpdate'])
            .executeTakeFirst();
    }

    async subscribe(user: string, feed_id: string): Promise<void> {
        const db = await this.getDatabase();
        await db.insertInto('subscription').values({user, feed_id}).execute();
    }

    async unsubscribe(user: string, feed_id: string): Promise<void> {
        const db = await this.getDatabase();
        await db.deleteFrom('subscription')
            .where('subscription.user', '=', user)
            .where('subscription.feed_id', '=', feed_id)
            .execute();
    }

    disconnect() {
        this.db?.destroy();
    }
}