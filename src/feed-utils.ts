import {Entry} from "./entities/Entry";
import {XMLParser} from "fast-xml-parser";
import {Feed} from "./entities/Feed";
import { v4 as uuidv4 } from 'uuid';

export function parseFeed(text: string): Feed | undefined {
    const options = {ignoreAttributes: false};
    const xmlParser = new XMLParser(options);
    const obj = xmlParser.parse(text);
    if ('feed' in obj) {
        return {uuid: uuidv4(), title: 'aaa', url: 'bbb'}
    } else if ('rss' in obj) {
        const channel = obj.rss.channel;
        return {uuid: uuidv4(), title: channel.title, url: channel['atom:link']['@_href']};
    } else {
        return undefined;
    }
}

export function parseFeedEntries(text: string): Array<Entry> {
    const options = {ignoreAttributes: false};
    const xmlParser = new XMLParser(options);
    const obj = xmlParser.parse(text);
    if ('feed' in obj) {
        return parseXmlEntries(obj);
    } else if ('rss' in obj) {
        return parseRssEntries(obj);
    } else {
        return [];
    }
}

function parseXmlEntries(xmlObject: any): Array<Entry> {
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