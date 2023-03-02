import {Feed} from "../src/entities/Feed";
import fetch from "node-fetch";
import {MongoDbService} from "../src/services/MongoDbService";
import {v4 as uuidv4} from 'uuid';
import {logger} from "../src/logger";
import {getSubject} from "../src/function-utils";
import {VercelRequest, VercelResponse} from "@vercel/node";

// const {XMLParser} = require("fast-xml-parser");

const guestUserFeeds: Array<Feed> = [
    {uuid: uuidv4(), title: 'Coding Horror', url: 'http://feeds.feedburner.com/codinghorror'},
    {uuid: uuidv4(), title: 'The Clean Code Blog', url: 'http://blog.cleancoder.com/atom.xml'},
    {uuid: uuidv4(), title: 'Code Ahoy - Articles', url: 'http://codeahoy.com/feed.xml'},
    {uuid: uuidv4(), title: 'DI Blog', url: 'http://www.dexterindustries.com/blog/feed/'},
    {uuid: uuidv4(), title: 'The Daily WTF', url: 'http://syndication.thedailywtf.com/TheDailyWtf'},
    {uuid: uuidv4(), title: 'The GitHub Blog', url: 'https://github.com/blog/all.atom'},
    {uuid: uuidv4(), title: 'Hacker News', url: 'https://news.ycombinator.com/rss'},
    {uuid: uuidv4(), title: 'iCulture.nl: Apple-nieuws met een bite!', url: 'https://feedpress.me/iculture'},
    {uuid: uuidv4(), title: 'existential type crisis', url: 'https://www.seancassidy.me/atom.xml'},
    {uuid: uuidv4(), title: 'Diomidis D. Spinellis Web Log', url: 'https://www.spinellis.gr/blog/dds-blog-rss.xml'},
    {
        uuid: uuidv4(),
        title: 'The GitHub Blog: Engineering News and Updates',
        url: 'https://githubengineering.com/atom.xml'
    },
    {uuid: uuidv4(), title: 'Google Open Source Blog', url: 'http://feeds.feedburner.com/GoogleOpenSourceBlog'},
    {uuid: uuidv4(), title: 'Yegor Bugayenko', url: 'https://www.yegor256.com/rss.xml'},
    {
        uuid: uuidv4(),
        title: 'Tweakers.net Nieuws',
        url: 'Tweakers.net Nieuwshttp://feeds.feedburner.com/tweakers/nieuws'
    },
    {uuid: uuidv4(), title: 'Los Techies', url: 'https://feeds.feedburner.com/LosTechies'},
    {uuid: uuidv4(), title: 'InfoQ', url: 'https://feed.infoq.com/'},
    {uuid: uuidv4(), title: 'The RISKS Digest', url: 'http://catless.ncl.ac.uk/risksatom.xml'},
    {uuid: uuidv4(), title: 'Blog – Snyk', url: 'https://snyk.io/blog/feed.xml'},
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const subject = await getSubject(req);
    if (!subject) {
        logger.info('Loading feeds for guest user');
        res.status(200).json(guestUserFeeds)
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