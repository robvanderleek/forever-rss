/**
 * @jest-environment node
 */
import {decodeHTMLEntities, extractFeedUrlFromHtml, parseFeed, parseFeedEntries} from "./feed-utils";
import {Feed} from "./entities/Feed";

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

    const result = parseFeed('https://www.alphens.nl/rss/alphensnl-nieuws.rss', text) as Feed;


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

    const result = parseFeed('https://betterprogramming.pub/feed', text) as Feed;

    expect(result.title).toBe('Better Programming - Medium');
    expect(result.url).toBe('https://betterprogramming.pub/feed');
});

test('extract feed from HTML', () => {
    const text = `
        <html lang="en">
            <head>
                <title>Some title</title>
                <link rel="alternate" type="application/rss+xml" href="https://feeds.macrumors.com/MacRumors-All" title="All Mac Rumors Headlines" />
            </head>
            <body><h1>Hello world</h1></body>
        </rss>
    `;

    const result = extractFeedUrlFromHtml(text);

    expect(result).toBe('https://feeds.macrumors.com/MacRumors-All');
});

test('parse XML feed with single entry', () => {
    const text = `
        <feed>
            <entry>
                <title>Hello world</title>
                <content type="html"><![CDATA[<h4>This is content</h4>]]></content>
            </entry>
        </feed>
    `;

    const result = parseFeedEntries(text);

    expect(result.length).toBe(1);
    expect(result[0].content).toBe('<h4>This is content</h4>');
});

test('parse XML feed with attributes', () => {
    const text = `
        <feed>
           <title type="text">Hello world</title>
        </feed>
    `;

    const result = parseFeed('https://example.com', text);

    expect(result?.url).toBe('https://example.com');
    expect(result?.title).toBe('Hello world');
});

test('parse XML feed with two entries', () => {
    const text = `
        <feed>
            <entry>
                <title>Hello world</title>
                <content type="html"><![CDATA[<h4>This is content</h4>]]></content>
            </entry>
            <entry>
                <title>Hello world</title>
                <content type="html"><![CDATA[<h4>This is content</h4>]]></content>
            </entry>
        </feed>
    `;

    const result = parseFeedEntries(text);

    expect(result.length).toBe(2);
    expect(result[0].content).toBe('<h4>This is content</h4>');
});

test('parse XML feed with text title', () => {
    const text = `
        <feed>
            <entry>
                <title type="text">This is the title</title>
                <content type="html"><![CDATA[<h4>This is content</h4>]]></content>
            </entry>
        </feed>
    `;

    const result = parseFeedEntries(text);

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('This is the title');
});

test('parse XML feed with link tag', () => {
    const text = `
        <feed>
            <entry>
                <title>Hello world</title>
                <content type="html"><![CDATA[<h4>This is content</h4>]]></content>
                <link rel="alternate" type="text/html" href="https://github.blog/" />
            </entry>
        </feed>
    `;

    const result = parseFeedEntries(text);
    const entry = result[0];

    expect(entry.title).toBe('Hello world');
    expect(entry.link).toBe('https://github.blog/');
});

test('decode HTML entities', () => {
    expect(decodeHTMLEntities('hello world')).toBe('hello world');
    expect(decodeHTMLEntities('hello &#x2F; world')).toBe('hello / world');
});