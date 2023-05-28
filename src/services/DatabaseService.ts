import {Feed} from "@/entities/Feed";
import {Kysely, PostgresDialect} from "kysely";
import {Database} from "@/entities/schemas/Database";
import {createKysely} from "@vercel/postgres-kysely";
import {Pool} from 'pg'

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
        }
        return this.db;
    }

    async getAllUserFeeds(userId: string): Promise<Array<Feed>> {
        const db = await this.getDatabase();
        const feeds = await db.selectFrom('feed')
            .innerJoin('subscription', 'subscription.feed_id', 'feed.id')
            .where('subscription.user', '=', userId)
            .select(['feed.id', 'feed.title', 'feed.url']).execute();
        return feeds as Array<Feed>;
    }

    async getFeed(feed_id: string): Promise<Feed | undefined> {
        const db = await this.getDatabase();
        return await db.selectFrom('feed')
            .where('feed.id', '=', feed_id)
            .select(['feed.id', 'feed.title', 'feed.url'])
            .executeTakeFirst();
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

    async addFeed(title: string, url: string): Promise<Feed> {
        const db = await this.getDatabase();
        return await db.insertInto('feed').values({title, url}).returningAll().executeTakeFirstOrThrow();
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