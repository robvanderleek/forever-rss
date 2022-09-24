import {Handler, HandlerEvent} from "@netlify/functions";
import {extractFeedUrlFromHtml, parseFeed} from "../feed-utils";
import fetch from "node-fetch";
import {MongoDbService} from "../services/MongoDbService";
import {logger} from "../logger";
import {getSubject, rssFetch} from "../function-utils";

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
    try {
        const response = await rssFetch(url);
        if (response.ok) {
            const text = await response.text();
            let feed = parseFeed(text);
            if (!feed) {
                logger.info('RSS feed not found at URL, trying HTML parsing...');
                const htmlFeedUrl = extractFeedUrlFromHtml(text);
                if (htmlFeedUrl) {
                    const response = await fetch(htmlFeedUrl, {redirect: 'follow'});
                    if (response.ok) {
                        const text = await response.text();
                        feed = parseFeed(text);
                    }
                }
            }
            if (feed) {
                const dbService = new MongoDbService();
                await dbService.addUserFeed(subject, feed);
            } else {
                logger.warn(`Could not find RSS feed for URL: ${url}`);
                return {
                    statusCode: 422,
                    body: `Could not find RSS feed for URL: ${url}`
                }
            }
            return {
                statusCode: 200,
                body: JSON.stringify(feed)
            };
        } else {
            return {statusCode: 400}
        }
    } catch ({message}) {
        const stringMessage = String(message);
        return {
            statusCode: 422,
            body: stringMessage
        };
    }

}

module.exports = {
    handler: handler
}