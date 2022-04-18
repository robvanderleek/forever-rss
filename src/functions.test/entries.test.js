import {parseResponseText} from "../functions/entries";

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

    const result = parseResponseText(text);

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

    const result = parseResponseText(text);

    expect(result.length).toBe(2);
});

test('parse empty feed', async () => {
    const result = parseResponseText('');

    expect(result).toBeDefined();
    expect(result.length).toBe(0);
});