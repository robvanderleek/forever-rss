/**
 * @jest-environment node
 */
import {extractFeedUrlFromHtml, parseFeed, parseFeedEntries} from "./feed-utils";

test('parse XML RSS feed, single item', () => {
    const text = `
        <rss>
            <channel>
                <item>
                    <title>Hello world</title>
                    <description>This is a test</description>
                </item>
            </channel>
        </rss>
    `;

    const result = parseFeedEntries(text);

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Hello world');
});

test('parse XML RSS feed, two items', () => {
    const text = `
        <rss>
            <channel>
                <item>
                    <title>Article 1</title>
                    <description>Description 1</description>
                </item>
                <item>
                    <title>Article 2</title>
                    <description>Description 2</description>
                </item>
            </channel>
        </rss>
    `;

    const result = parseFeedEntries(text);

    expect(result.length).toBe(2);
});

test('parse empty feed', async () => {
    const result = parseFeedEntries('');

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
});

test('parse XML RSS feed with hero image', () => {
    const text = `
        <rss>
            <channel>
                <item>
                    <title>Hello world</title>
                    <description>This is a test</description>
                    <enclosure url="https://foo.jpg" length="0" type="image/jpeg"/>
                </item>
            </channel>
        </rss>
    `;

    const result = parseFeedEntries(text);

    expect(result.length).toBe(1);
    expect(result[0].heroImage).toBe('https://foo.jpg');
});

test('parse XML RSS feed with content', () => {
    const text = `
        <rss>
            <channel>
                <item>
                    <title>Hello world</title>
                    <description>This is a test</description>
                    <content:encoded><![CDATA[<h4>Issue #45 of Coffee Bytes</h4>]]></content:encoded>
                </item>
            </channel>
        </rss>
    `;

    const result = parseFeedEntries(text);

    expect(result.length).toBe(1);
    expect(result[0].content).toBe('<h4>Issue #45 of Coffee Bytes</h4>');
});

test('parse XML RSS feed without content', () => {
    const text = `
        <rss>
            <channel>
                <item>
                    <title>Hello world</title>
                    <description>This is a test</description>
                </item>
            </channel>
        </rss>
    `;

    const result = parseFeedEntries(text);

    expect(result.length).toBe(1);
    expect(result[0].content).toBe('This is a test');
});

test('parse XML RSS feed', () => {
    const text = `
        <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
            <channel>
                <title>Some site</title>
                <link>https://somesite.com/news.html</link>
                <description>Some site news</description>
                <language>nl</language>
                <copyright>Copyright (c) 2022</copyright>
                <pubDate>Thu, 12 May 2022 08:40:09 +0200</pubDate>
                <atom:link href="https://www.alphens.nl/rss/alphensnl-nieuws.rss" rel="self" type="application/rss+xml"/>
            </channel>
        </rss>
    `;

    const result = parseFeed(text);

    expect(result.title).toBe('Some site');
    expect(result.url).toBe('https://www.alphens.nl/rss/alphensnl-nieuws.rss');
});

test('parse XML feed with two atom links', () => {
    const text = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss xmlns:dc="http://purl.org/dc/elements/1.1/">
            <channel>
                <title><![CDATA[Better Programming - Medium]]></title>
                <atom:link href="https://betterprogramming.pub/feed" rel="self" type="application/rss+xml"/>
                <atom:link href="http://medium.superfeedr.com" rel="hub"/>
            </channel>
        </rss>
    `;

    const result = parseFeed(text);

    expect(result.title).toBe('Better Programming - Medium');
    expect(result.url).toBe('https://betterprogramming.pub/feed');
})

test('parse HTML', () => {
    const text = `
        <html>
            <head>
                <link rel="alternate" type="application/rss+xml" href="https://feeds.macrumors.com/MacRumors-All" title="All Mac Rumors Headlines" />
            </head>
            <body><h1>Hello world</h1></body>
        </rss>
    `;

    const result = extractFeedUrlFromHtml(text);

    expect(result).toBe('https://feeds.macrumors.com/MacRumors-All');
})