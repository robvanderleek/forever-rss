import {Feed} from "@/entities/Feed";
import {Db, MongoClient} from "mongodb";

export class MongoDbService {
    client: MongoClient | undefined;
    connectionString: string | undefined;

    constructor(connectionString?: string) {
        this.connectionString = connectionString;
    }

    async getDatabase(): Promise<Db> {
        if (!this.client) {
            if (!this.connectionString) {
                this.connectionString = process.env.FOREVER_RSS_MONGODB;
            }
            if (!this.connectionString) {
                throw new Error('Environment variable FOREVER_RSS_MONGODB not set');
            } else {
                this.client = await MongoClient.connect(this.connectionString);
            }
        }
        return this.client.db('foreverrss');
    }

    async getAllUserFeeds(userId: string): Promise<Array<Feed>> {
        const db = await this.getDatabase();
        const collection = db.collection('user');
        const data = await collection.findOne({'user': userId});
        if (data) {
            return data.feeds;
        } else {
            return [];
        }
    }

    async getUserFeed(userId: string, uuid: string): Promise<Feed | undefined> {
        const db = await this.getDatabase();
        const collection = db.collection('user');
        const data = await collection.findOne({'user': userId});
        if (data) {
            return data.feeds.find((feed: Feed) => feed.uuid === uuid);
        }
    }

    async updateAccessTime(userId: string, url: string): Promise<number> {
        const db = await this.getDatabase();
        const collection = db.collection('user');
        const data = await collection.findOne({'user': userId});
        if (data) {
            const feeds: Array<Feed> = data.feeds;
            const feed = feeds.find(feed => feed.url === url);
            if (feed) {
                feed.accessTime = new Date();
                const result = await collection.updateOne({'user': userId}, {$set: {'feeds': feeds}}, {});
                return result.modifiedCount;
            }
        }
        return 0;
    }

    async addUserFeed(userId: string, feed: Feed): Promise<number> {
        const db = await this.getDatabase();
        const collection = db.collection('user');
        const result = await collection.updateOne({'user': userId}, {$push: {'feeds': feed}}, {upsert: true});
        return result.modifiedCount;
    }

    async removeUserFeed(userId: string, uuid: string): Promise<number> {
        const db = await this.getDatabase();
        const collection = db.collection('user');
        const result = await collection.updateOne({'user': userId}, {$pull: {'feeds': {'uuid': uuid}}});
        return result.modifiedCount;
    }

    disconnect() {
        this.client?.close();
    }
}