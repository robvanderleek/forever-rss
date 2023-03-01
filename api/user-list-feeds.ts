import {Feed} from "../src/entities/Feed";
import fetch from "node-fetch";
import {MongoDbService} from "../src/services/MongoDbService";
import {v4 as uuidv4} from 'uuid';
import {logger} from "../src/logger";
import {getSubject} from "../src/function-utils";
import {VercelRequest, VercelResponse} from "@vercel/node";

// const {XMLParser} = require("fast-xml-parser");

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const subject = await getSubject(req);
    if (!subject) {
        logger.info('Loading feeds for guest user');
        const feed: Feed = {uuid: uuidv4(), title: 'Coding Horror', url: 'http://feeds.feedburner.com/codinghorror'};
        res.status(200).json([feed])
        return;
    }
    logger.info(`Loading feeds for: ${subject}`);
    const dbService = new MongoDbService();
    const feeds = await dbService.getAllUserFeeds(subject);
// const response = await fetch('https://raw.githubusercontent.com/robvanderleek/robvanderleek/main/my-awesome.opml');
// if (response.ok) {
//     const opml = await response.text();
//     const options = {ignoreAttributes: false};
//     const xmlParser = new XMLParser(options);
//     const obj = xmlParser.parse(opml);
//     const outlines = obj.opml.body.outline;
//     const filteredFeeds = outlines.filter((o: any) => '@_xmlUrl' in o);
//     const feeds = await Promise.all(filteredFeeds.map(outlineToFeed));
// for (const feed of feeds) {
//     client.lpush(`user:${user.sub}:feeds`, JSON.stringify(feed));
// }
    return {
        statusCode: 200,
        body: JSON.stringify(feeds),
    };
// } else {
//     return {
//         statusCode: 204,
//         body: JSON.stringify([]),
//     };
// }
}

async function outlineToFeed(o: any, withFavIcon = false): Promise<Feed> {
    if (withFavIcon) {
        return {
            uuid: uuidv4(),
            title: o['@_title'],
            url: o['@_xmlUrl'],
            favicon: await getFavIconUrl(o['@_htmlUrl'])
        };
    } else {
        return {
            uuid: uuidv4(),
            title: o['@_title'],
            url: o['@_xmlUrl']
        };
    }
}

async function getFavIconUrl(htmlUrl: string): Promise<string | undefined> {
    if (htmlUrl) {
        const url = new URL(htmlUrl);
        const prefix = 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&';
        const faviconUrl = `${prefix}url=${url.protocol}//${url.hostname}`;
        const response = await fetch(faviconUrl);
        if (response.ok) {
            return faviconUrl;
        }
    }
    return undefined;
}