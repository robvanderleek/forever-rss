/**
 * @jest-environment node
 */

import {DatabaseService} from "../../src/services/DatabaseService";
import {PostgreSqlContainer, StartedPostgreSqlContainer} from "testcontainers";

let container: StartedPostgreSqlContainer;
let databaseService: DatabaseService;

beforeEach(async () => {
    container = await new PostgreSqlContainer().start();
    databaseService = new DatabaseService(container.getConnectionUri());
});

afterEach(async () => {
    if (databaseService) {
        databaseService.disconnect();
    }
    if (container) {
        await container.stop();
    }
});

test('subscribe', async () => {
    let result = await databaseService.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(0);

    const title = 'aap';
    const url = 'noot';
    const feed = await databaseService.addFeed(title, url);
    await databaseService.subscribe('robvanderleek', feed.id);

    result = await databaseService.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(1);

    const resultFeed = result[0];

    expect(resultFeed.title).toBe('aap');
    expect(resultFeed.url).toBe('noot');
});

test('remove feed', async () => {
    let result = await databaseService.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(0);

    const aapFeed = await databaseService.addFeed('aap', 'noot');
    const nootFeed = await databaseService.addFeed('mies', 'wim');
    await databaseService.subscribe('robvanderleek', aapFeed.id);
    await databaseService.subscribe('robvanderleek', nootFeed.id);

    result = await databaseService.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(2);

    await databaseService.unsubscribe('robvanderleek', aapFeed.id);

    result = await databaseService.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(1);
});

test('get all user feeds', async () => {
    const aapFeed = await databaseService.addFeed('aap', 'noot');
    await databaseService.subscribe('robvanderleek', aapFeed.id);

    let result = await databaseService.getAllUserFeeds('robvanderleek');

    expect(result[0].userAccessTime).toBeNull();

    await databaseService.updateAccessTime('robvanderleek', aapFeed.id);

    result = await databaseService.getAllUserFeeds('robvanderleek');

    expect(result[0].userAccessTime).toBeDefined();

    if (result[0].userAccessTime) {
        const diffSeconds = (new Date().getTime() - result[0].userAccessTime.getTime()) / 1000;

        expect(diffSeconds).toBeLessThan(5);
    }
});

test('get user feed', async () => {
    const feed = await databaseService.addFeed('aap', 'https://aap');
    const otherFeed = await databaseService.addFeed('noot', 'https://noot');
    await databaseService.deleteFeed(otherFeed.id);

    let result = await databaseService.getFeedById(feed.id);

    expect(result?.url).toBe('https://aap');

    result = await databaseService.getFeedById(otherFeed.id);

    expect(result).toBeUndefined();
});

test('update access time feed', async () => {
    const feed = await databaseService.addFeed('aap', 'https://aap');
    await databaseService.updateAccessTime('robvanderleek', feed.id);
    const updatedTime = await databaseService.getAccessTime('robvanderleek', feed.id);

    expect(updatedTime).toBeDefined();

    if (updatedTime) {
        const result = (new Date().getTime() - updatedTime.getTime()) / 1000;

        expect(result).toBeLessThan(5);
    }
});

test('set feed update time', async () => {
    const feed = await databaseService.addFeed('aap', 'https://aap');

    expect(feed.latestUpdate).toBeUndefined();

    await databaseService.setUpdateTime(feed.id, new Date());

    const updatedFeed = await databaseService.getFeedById(feed.id);

    expect(updatedFeed?.latestUpdate).toBeDefined();

    if (updatedFeed?.latestUpdate) {
        expect((new Date().getTime() - updatedFeed?.latestUpdate.getTime()) / 1000).toBeLessThan(5);
    }
});

test('add duplicate feed should throw error', async () => {
    await databaseService.addFeed('aap', 'https://aap');
    const f = async () => await databaseService.addFeed('aap', 'https://aap');
    await expect(f).rejects.toThrowError();
});

export {}