import {Feed} from "../entities/Feed";
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

    async getAllFeeds(userId: string): Promise<Array<Feed>> {
        const db = await this.getDatabase();
        const collection = db.collection('feeds');
        const data = await collection.findOne({'user': userId});
        if (data) {
            return data.feeds;
        } else {
            return [];
        }
    }

    async addFeed(userId: string, feed: Feed): Promise<number> {
        const db = await this.getDatabase();
        const collection = db.collection('feeds');
        const result = await collection.updateOne({'user': userId}, {$push: {'feeds': feed}}, {upsert: true});
        return result.modifiedCount;
    }

    async removeFeed(userId: string, uuid: string) {
        const db = await this.getDatabase();
        const collection = db.collection('feeds');
        const result = await collection.updateOne({'user': userId}, {$pull: {'feeds': {'uuid': uuid}}});
        return result.modifiedCount;
    }

}