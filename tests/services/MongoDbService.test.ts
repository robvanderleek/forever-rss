/**
 * @jest-environment node
 */

import {MongoMemoryServer} from "mongodb-memory-server";
import {MongoDbService} from "../../src/services/MongoDbService";

let mongoServer: MongoMemoryServer;
let service: MongoDbService;

beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    service = new MongoDbService(mongoServer.getUri());
});

afterEach(async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }
    if (service) {
        service.disconnect();
    }
});

test('add feed', async () => {
    let result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(0);

    const feed = {uuid: 'abcd1234', title: 'aap', url: 'noot'}
    await service.addUserFeed('robvanderleek', feed);

    result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(1);
});

test('remove feed', async () => {
    let result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(0);

    let feed = {uuid: 'abcd1234', title: 'aap', url: 'noot'}
    await service.addUserFeed('robvanderleek', feed);
    feed = {uuid: '1234abcd', title: 'mies', url: 'wim'}
    await service.addUserFeed('robvanderleek', feed);

    result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(2);

    await service.removeUserFeed('robvanderleek', 'abcd1234');

    result = await service.getAllUserFeeds('robvanderleek');

    expect(result.length).toBe(1);
});

test('get user feed', async () => {
    let feed = {uuid: 'abcd1234', title: 'aap', url: 'https://noot'}
    await service.addUserFeed('robvanderleek', feed);

    let result = await service.getUserFeed('robvanderleek', 'abcd1234');

    expect(result?.url).toBe('https://noot');

    result = await service.getUserFeed('robvanderleek', 'efgh5678');

    expect(result).toBeUndefined();
});

test('Update access time feed', async () => {
    let feed = {uuid: 'abcd1234', title: 'aap', url: 'https://noot'}
    await service.addUserFeed('robvanderleek', feed);

    await service.updateAccessTime('robvanderleek', 'https://noot');
    const updatedFeed = await service.getUserFeed('robvanderleek', 'abcd1234');
    const updatedTime = updatedFeed?.accessTime?.getTime();

    expect(updatedTime).toBeDefined();

    if (updatedTime) {
        const result = (new Date().getTime() - updatedTime) / 1000;

        expect(result).toBeLessThan(5);
    }
});

export {}