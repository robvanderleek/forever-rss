import {Handler, HandlerEvent} from "@netlify/functions";
import {parseFeed} from "../feed-utils";
import fetch from "node-fetch";
import {MongoDbService} from "../services/MongoDbService";
import {logger} from "../logger";
import {getSubject} from "../function-utils";

const handler: Handler = async function (event: HandlerEvent) {
    const subject = await getSubject(event);
    if (!subject) {
        return {statusCode: 401};
    }
    if (!event.body) {
        return {statusCode: 400}
    }
    const {url} = JSON.parse(event.body);
    try {
        return await addUrl(url, subject);
    } catch (e) {
        console.log(e);
        return {statusCode: 422}
    }
}

async function addUrl(url: string, subject: string) {
    const response = await fetch(url, {redirect: 'follow'});
    if (response.ok) {
        const text = await response.text();
        console.log(text);
        const feed = parseFeed(text);
        if (feed) {
            const dbService = new MongoDbService();
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