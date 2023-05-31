import {Entry} from "./entities/Entry";
import {XMLParser} from "fast-xml-parser";
import {Feed} from "./entities/Feed";
import {v4 as uuidv4} from 'uuid';
import {parseValue} from "./utils";

export function parseFeed(url: string, text: string): Feed | undefined {
    const options = {ignoreAttributes: false};
    const xmlParser = new XMLParser(options);
    const obj = xmlParser.parse(text);
    if ('feed' in obj) {
        return {id: uuidv4(), title: parseXmlElementText(obj.feed.title), url: url}
    } else if ('rss' in obj) {
        const channel = obj.rss.channel;
        return {id: uuidv4(), title: channel.title, url: url};
    } else {
        return undefined;
    }
}

function parseRssChannelUrl(channel: any) {
    const links = channel['atom:link'];
    if (Array.isArray(links)) {
        for (const l of links) {
            if (l['@_type'] === 'application/rss+xml') {
                return l['@_href'];
            }
        }
    } else {
        return links['@_href'];
    }
    return undefined;
}

export function extractFeedUrlFromHtml(text: string): string | undefined {
    const linkPattern = /<link\s.*?\/>/gi;
    const linkMatches = Array.from(text.matchAll(linkPattern));
    for (const m of linkMatches) {
        const link = m[0];
        const type = parseValue('type', link);
        if (type && type.toLowerCase() === 'application/rss+xml') {
            return parseValue('href', link);
        }
    }
    return undefined;
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
    const feed = xmlObject.feed;
    if (feed) {
        if (Array.isArray(feed.entry)) {
            for (const e of feed.entry) {
                result.push(parseXmlEntry(e));
            }
        } else {
            result.push(parseXmlEntry(feed.entry))
        }
    }
    return result;
}

function parseXmlEntry(e: any): Entry {
    const id = e.id;
    const title = parseXmlElementText(e.title);
    const updated = e.updated;
    const link = parseXmlEntryLink(e);
    const content = e.content['#text']
    return {id, title, updated, link, content};
}

function parseXmlElementText(element: any): string {
    if (typeof element === 'object') {
        return element['#text'];
    } else {
        return element;
    }
}

function parseXmlEntryLink(e: any): string {
    const linkValue = e['link'];
    if (typeof linkValue === 'object') {
        return linkValue['@_href'];
    } else {
        return linkValue;
    }
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

export function decodeHTMLEntities(text: string) {
    const entities: { [key: string]: string } = {
        'amp': '&',
        'apos': '\'',
        '#x27': '\'',
        '#x2F': '/',
        '#39': '\'',
        '#47': '/',
        'lt': '<',
        'gt': '>',
        'nbsp': ' ',
        'quot': '"'
    }
    return text.replace(/&([^;]+);/gm, (match, entity) => entities[entity] || match)
}

function toEntry(obj: any): Entry {
    return {
        'id': obj['guid'],
        'title': decodeHTMLEntities(obj['title']),
        'updated': obj['pubDate'],
        'link': obj['link'],
        'content': obj['content'] || obj['content:encoded'] || obj['description'] || '',
        'heroImage': obj['enclosure']?.['@_url']
    }
}