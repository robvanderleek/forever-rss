import {extractFeedUrlFromHtml, parseFeed} from "@/feed-utils";
import fetch from "node-fetch";
import {DatabaseService} from "@/services/DatabaseService";
import {logger} from "@/logger";
import {getSubject, rssFetch} from "@/function-utils";
import {VercelRequest, VercelResponse} from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const subject = await getSubject(req);
    if (!subject) {
        return res.status(401);
    }
    if (!req.body) {
        return res.status(400);
    }
    const {url} = JSON.parse(req.body);
    try {
        return await addUrl(url, subject);
    } catch (e) {
        console.log(e);
        return res.status(422);
    }
}

async function addUrl(url: string, subject: string) {
    logger.info(`Adding new feed: ${url}`);
    try {
        const response = await rssFetch(url);
        if (response.ok) {
            const text = await response.text();
            let feed = parseFeed(url, text);
            if (!feed) {
                logger.info('RSS feed not found at URL, trying HTML parsing...');
                const htmlFeedUrl = extractFeedUrlFromHtml(text);
                if (htmlFeedUrl) {
                    const response = await fetch(htmlFeedUrl, {redirect: 'follow'});
                    if (response.ok) {
                        const text = await response.text();
                        feed = parseFeed(htmlFeedUrl, text);
                    }
                }
            }
            if (feed) {
                const dbService = new DatabaseService();
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