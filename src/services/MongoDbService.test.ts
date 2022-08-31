/**
 * @jest-environment node
 */

import {MongoMemoryServer} from "mongodb-memory-server";
import {MongoDbService} from "./MongoDbService";

let mongoServer: MongoMemoryServer;

beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
});

afterEach(async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }
});

test('Add feed', async () => {
    const service = new MongoDbService(mongoServer.getUri());

    let result = await service.getAllFeeds('robvanderleek');

    expect(result.length).toBe(0);

    const feed = {uuid: 'abcd1234', title: 'aap', url: 'noot'}
    await service.addFeed('robvanderleek', feed);

    result = await service.getAllFeeds('robvanderleek');

    expect(result.length).toBe(1);
});

test('Remove feed', async () => {
    const service = new MongoDbService(mongoServer.getUri());

    let result = await service.getAllFeeds('robvanderleek');

    expect(result.length).toBe(0);

    let feed = {uuid: 'abcd1234', title: 'aap', url: 'noot'}
    await service.addFeed('robvanderleek', feed);
    feed = {uuid: '1234abcd', title: 'mies', url: 'wim'}
    await service.addFeed('robvanderleek', feed);

    result = await service.getAllFeeds('robvanderleek');

    expect(result.length).toBe(2);

    await service.removeFeed('robvanderleek', 'abcd1234');

    result = await service.getAllFeeds('robvanderleek');

    expect(result.length).toBe(1);
});

export {}