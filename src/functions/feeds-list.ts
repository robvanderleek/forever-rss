import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {Feed} from "../entities/Feed";
import fetch from "node-fetch";
import {MongoDbService} from "../services/MongoDbService";
import { v4 as uuidv4 } from 'uuid';

// const {XMLParser} = require("fast-xml-parser");

const handler: Handler = async function (event: HandlerEvent, context: HandlerContext) {
    if (!context.clientContext || !context.clientContext.user) {
        const feed: Feed = {uuid: uuidv4(), title: 'Coding Horror', url: 'http://feeds.feedburner.com/codinghorror'};
        return {
            statusCode: 200,
            body: JSON.stringify([feed])
        };
    }
    const user = context.clientContext['user'];
    const redisService = new MongoDbService();
    const feeds = await redisService.getAllFeeds(user.sub);
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

module.exports = {
    handler: handler
}