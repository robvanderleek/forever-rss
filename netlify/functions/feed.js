const fetch = require("node-fetch");
const {XMLParser} = require("fast-xml-parser");

exports.handler = async function (event, context) {
    const url = event.queryStringParameters.url;
    const response = await fetch(url);
    let result;
    if (response.ok) {
        const text = await response.text();
        const xmlParser = new XMLParser();
        const obj = xmlParser.parse(text);
        if ('feed' in obj) {
            result = parseFeedEntries(obj);
        } else if ('rss' in obj) {
            result = parseRssEntries(obj);
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({message: result}),
    };
}

function parseFeedEntries(o) {
    const result = [];
    for (const e of o.feed.entry) {
        result.push({'id': e.id, 'title': e.title, 'updated': e.updated, 'content': e.content});
    }
    return result;
}

function parseRssEntries(o) {
    const result = [];
    for (const e of o.rss.channel.item) {
        result.push({'id': e.guid, 'title': e.title, 'updated': e.pubDate, 'content': e.description});
    }
    return result;
}