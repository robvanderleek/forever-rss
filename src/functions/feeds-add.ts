import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {parseFeed} from "../feed-utils";
import fetch from "node-fetch";
import {MongoDbService} from "../services/MongoDbService";

const handler: Handler = async function (event: HandlerEvent, context: HandlerContext) {
    if (!context.clientContext || !context.clientContext.user) {
        return {statusCode: 401};
    }
    if (!event.body) {
        return {statusCode: 400}
    }
    const {url} = JSON.parse(event.body);
    const user = context.clientContext['user'];
    const redisService = new MongoDbService();
    const response = await fetch(url, {redirect: 'follow'});
    if (response.ok) {
        const text = await response.text();
        const feed = parseFeed(text);
        if (feed) {
            await redisService.addFeed(user.sub, feed);
        }
        return {
            statusCode: 200,
            body: JSON.stringify([]),
        };
    } else {
        return {statusCode: 400}
    }
}

module.exports = {
    handler: handler
}