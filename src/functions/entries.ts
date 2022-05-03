import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {Entry} from "../entities/Entry";

const fetch = require("node-fetch");
const {XMLParser} = require("fast-xml-parser");

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const url = event.queryStringParameters?.url;
    const response = await fetch(url, {redirect: 'follow'});
    if (response.ok) {
        const text = await response.text();
        const result = parseResponseText(text);
        return {
            statusCode: 200, body: JSON.stringify({message: result}),
        };
    } else {
        return {
            statusCode: 204, body: JSON.stringify({message: []}),
        };
    }
}

function parseResponseText(text: string): Array<Entry> {
    const xmlParser = new XMLParser();
    const obj = xmlParser.parse(text);
    if ('feed' in obj) {
        return parseFeedEntries(obj);
    } else if ('rss' in obj) {
        return parseRssEntries(obj);
    } else {
        return [];
    }
}

function parseFeedEntries(xmlObject: any): Array<Entry> {
    const result = [];
    for (const e of xmlObject.feed.entry) {
        result.push({'id': e.id, 'title': e.title, 'updated': e.updated, 'link': e['link'], 'content': e.content});
    }
    return result;
}

function parseRssEntries(o: any): Array<Entry> {
    const result: Array<Entry> = [];
    const isIterable = (e: any) => typeof e[Symbol.iterator] === 'function';
    const entries = o.rss.channel.item;
    if (!entries) {
        return result;
    } else if (isIterable(o.rss.channel.item)) {
        for (const e of o.rss.channel.item) {
            result.push({
                'id': e.guid,
                'title': e.title,
                'updated': e.pubDate,
                'link': e.link,
                'content': e.description
            });
        }
    } else {
        result.push({
            'id': entries.guid,
            'title': entries.title,
            'updated': entries.pubDate,
            'link': entries.link,
            'content': entries.description
        });
    }
    return result;
}

module.exports = {
    handler: handler,
    parseResponseText: parseResponseText
}