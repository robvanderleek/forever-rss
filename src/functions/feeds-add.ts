import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import Redis from "ioredis";
import {parseFeed} from "../feed-utils";
import fetch from "node-fetch";

const handler: Handler = async function (event: HandlerEvent, context: HandlerContext) {
    if (!context.clientContext || !context.clientContext.user) {
        return {statusCode: 401};
    }
    if (!event.body) {
        return {statusCode: 400}
    }
    const {url} = JSON.parse(event.body);
    const user = context.clientContext['user'];
    const response = await fetch(url, {redirect: 'follow'});
    if (response.ok) {
        const text = await response.text();
        const feed = parseFeed(text);
        const client = getRedisClient();
        await client.rpush(`user:${user.sub}:feeds`, JSON.stringify(feed));
        return {
            statusCode: 200,
            body: JSON.stringify([]),
        };
    } else {
        return {statusCode: 400}
    }
}

function getRedisClient(): Redis {
    const env = process.env.FOREVER_RSS_REDIS;
    if (env) {
        return new Redis(env);
    } else {
        return new Redis();
    }
}

module.exports = {
    handler: handler
}