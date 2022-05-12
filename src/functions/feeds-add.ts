import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import Redis from "ioredis";

const fetch = require("node-fetch");

const handler: Handler = async function (event: HandlerEvent, context: HandlerContext) {
    if (!context.clientContext || !context.clientContext.user) {
        return {statusCode: 401};
    }
    const url = event.queryStringParameters?.url;
    const user = context.clientContext['user'];

    console.log(url);
    console.log(user);

    // const response = await fetch(url, {redirect: 'follow'});
    // if (response.ok) {
    //     const text = await response.text();
    //
    // const client = getRedisClient();
    // const feed =
    // const data = await client.lrange(`user:${user.sub}:feeds`, 0, -1);
    // const feeds = [];
    // for (const d of data) {
    //     feeds.push(JSON.parse(d));
    // }

    return {
        statusCode: 200,
        body: JSON.stringify([]),
    };
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