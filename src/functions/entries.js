const fetch = require("node-fetch");
const {XMLParser} = require("fast-xml-parser");

async function handler(event, context) {    
    const url = event.queryStringParameters.url;
    const response = await fetch(url, {redirect: 'follow'});
    let result = [];
    if (response.ok) {
        const text = await response.text();
        result = parseResponseText(text);
    }
    return {
        statusCode: 200, body: JSON.stringify({message: result}),
    };
}

function parseResponseText(text) {
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

function parseFeedEntries(o) {
    const result = [];
    for (const e of o.feed.entry) {
        result.push({'id': e.id, 'title': e.title, 'updated': e.updated, 'link': e['link'], 'content': e.content});
    }
    return result;
}

function parseRssEntries(o) {
    const result = [];
    const isIterable = e => typeof e[Symbol.iterator] === 'function';
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