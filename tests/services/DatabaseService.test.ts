/**
 * @jest-environment node
 */

import {DatabaseService} from "../../src/services/DatabaseService";
import {PostgreSqlContainer, StartedPostgreSqlContainer} from "testcontainers";
import {setupDatabase} from "../../src/pages/api/setupdb";

let container: StartedPostgreSqlContainer;
let service: DatabaseService;

beforeEach(async () => {
    container = await new PostgreSqlContainer().start();
    service = new DatabaseService(container.getConnectionUri());
    await setupDatabase(await service.getDatabase());
});

afterEach(async () => {
    if (service) {
        service.disconnect();
    }
    if (container) {
        await container.stop();
    }
});

test('subscribe', async () => {
    let result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(0);

    const title = 'aap';
    const url = 'noot';
    const feed = await service.addFeed(title, url);
    await service.subscribe('robvanderleek', feed.id);

    result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(1);

    const resultFeed = result[0];

    expect(resultFeed.title).toBe('aap');
    expect(resultFeed.url).toBe('noot');
});

test('remove feed', async () => {
    let result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(0);

    const aapFeed = await service.addFeed('aap', 'noot');
    const nootFeed = await service.addFeed('mies', 'wim');
    await service.subscribe('robvanderleek', aapFeed.id);
    await service.subscribe('robvanderleek', nootFeed.id);

    result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(2);

    await service.unsubscribe('robvanderleek', aapFeed.id);

    result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(1);
});

test('get user feed', async () => {
    const feed = await service.addFeed('aap', 'https://aap');
    const otherFeed = await service.addFeed('noot', 'https://noot');
    await service.deleteFeed(otherFeed.id);

    let result = await service.getFeed(feed.id);

    expect(result?.url).toBe('https://aap');

    result = await service.getFeed(otherFeed.id);

    expect(result).toBeUndefined();
});

test('Update access time feed', async () => {
    const feed = await service.addFeed('aap', 'https://aap');
    await service.updateAccessTime('robvanderleek', feed.id);
    const updatedTime = await service.getAccessTime('robvanderleek', feed.id);

    expect(updatedTime).toBeDefined();

    if (updatedTime) {
        const result = (new Date().getTime() - updatedTime.getTime()) / 1000;

        expect(result).toBeLessThan(5);
    }
});

export {}