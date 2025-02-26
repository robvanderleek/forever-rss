import {FeedTable} from "./FeedTable";
import {SubscriptionTable} from "./SubscriptionTable";
import {FeedAccessTimeTable} from "./FeedAccessTimeTable";
import {KyselyMigrationTable} from "./KyselyMigrationTable";

export interface Database {
    feed: FeedTable;
    subscription: SubscriptionTable;
    feedAccessTime: FeedAccessTimeTable;
    kysely_migration: KyselyMigrationTable;
}