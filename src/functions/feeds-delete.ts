import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {RedisService} from "../services/RedisService";

const handler: Handler = async function (event: HandlerEvent, context: HandlerContext) {
    if (!context.clientContext || !context.clientContext.user) {
        return {statusCode: 401};
    }
    if (!event.body) {
        return {statusCode: 400}
    }
    const {uuid} = JSON.parse(event.body);
    const user = context.clientContext['user'];
    const redisService = new RedisService();
    const feeds = await redisService.getAllFeeds(user.sub);
    const feed = feeds.find(f => f.uuid === uuid);
    if (feed) {
        await redisService.removeFeed(user.sub, feed);
    }
    return {statusCode: 200};
}

module.exports = {
    handler: handler
}