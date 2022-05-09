import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {Entry} from "../entities/Entry";

const fetch = require("node-fetch");
const {XMLParser} = require("fast-xml-parser");

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const url = event.queryStringParameters?.url;
    const response = await fetch(url, {redirect: 'follow'});
    if (response.ok) {
        const text = await response.text();
        console.log(text);
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
    const options = {ignoreAttributes: false};
    const xmlParser = new XMLParser(options);
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
            result.push(toEntry(e));
        }
    } else {
        result.push(toEntry(entries));
    }
    return result;
}

function toEntry(obj: any): Entry {
    return {
        'id': obj['guid'],
        'title': obj['title'],
        'updated': obj['pubDate'],
        'link': obj['link'],
        'content': obj['description'],
        'heroImage': obj['enclosure']?.['@_url']
    }
}

module.exports = {
    handler: handler,
    parseResponseText: parseResponseText
}