import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {parseFeed} from "../feed-utils";
import fetch from "node-fetch";
import {MongoDbService} from "../services/MongoDbService";
import {logger} from "../logger";
import {getSubject} from "../function-utils";

const handler: Handler = async function (event: HandlerEvent, context: HandlerContext) {
    const subject = await getSubject(event);
    if (!subject) {
        return {statusCode: 401};
    }
    if (!event.body) {
        return {statusCode: 400}
    }
    const {url} = JSON.parse(event.body);
    const dbService = new MongoDbService();
    const response = await fetch(url, {redirect: 'follow'});
    if (response.ok) {
        const text = await response.text();
        const feed = parseFeed(text);
        if (feed) {
            await dbService.addUserFeed(subject, feed);
        } else {
            logger.warn(`Could not find RSS feed for URL: ${url}`);
        }
        return {
            statusCode: 200,
            body: JSON.stringify(feed)
        };
    } else {
        return {statusCode: 400}
    }
}

module.exports = {
    handler: handler
}