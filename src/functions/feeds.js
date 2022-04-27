const {XMLParser} = require("fast-xml-parser");
const fetch = require("node-fetch");


exports.handler = async function (event, context) {
    const { identity, user } = context.clientContext;
    const response = await fetch('https://raw.githubusercontent.com/robvanderleek/robvanderleek/main/my-awesome.opml');
    if (response.ok) {
        const opml = await response.text();
        const options = {ignoreAttributes: false};
        const xmlParser = new XMLParser(options);
        const obj = xmlParser.parse(opml);
        const outlines = obj.opml.body.outline;
        const filteredFeeds = outlines.filter(o => '@_xmlUrl' in o);
        const feeds = await Promise.all(filteredFeeds.map(outlineToFeed));
        return {
            statusCode: 200,
            body: JSON.stringify(feeds),
        };
    }
}

async function outlineToFeed(o) {
    return {
        title: o['@_title'],
        url: o['@_xmlUrl'],
        favicon: await getFavIconUrl(o['@_htmlUrl'])
    };
}

async function getFavIconUrl(htmlUrl) {
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