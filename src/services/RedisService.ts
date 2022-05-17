import Redis from "ioredis";
import {Feed} from "../entities/Feed";

function getRedisClient(): Redis {
    const env = process.env.FOREVER_RSS_REDIS;
    if (env) {
        return new Redis(env);
    } else {
        return new Redis();
    }
}

export class RedisService {
    client: Redis;

    constructor() {
        this.client = getRedisClient();
    }

    async getAllFeeds(userId: string): Promise<Array<Feed>> {
        const data = await this.client.lrange(`user:${userId}:feeds`, 0, -1);
        const feeds = [];
        for (const d of data) {
            feeds.push(JSON.parse(d));
        }
        return feeds;
    }

    async addFeed(userId: string, feed: Feed): Promise<number> {
        return this.client.rpush(`user:${userId}:feeds`, JSON.stringify(feed));
    }

    async removeFeed(userId: string, feed: Feed) {
        await this.client.lrem(`user:${userId}:feeds`, 1, JSON.stringify(feed));
    }

}