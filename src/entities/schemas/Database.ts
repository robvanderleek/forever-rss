import {FeedTable} from "@/entities/schemas/FeedTable";
import {SubscriptionTable} from "@/entities/schemas/SubscriptionTable";
import {FeedAccessTimeTable} from "@/entities/schemas/FeedAccessTimeTable";
import {KyselyMigrationTable} from "@/entities/schemas/KyselyMigrationTable";

export interface Database {
    feed: FeedTable;
    subscription: SubscriptionTable;
    feedAccessTime: FeedAccessTimeTable;
    kysely_migration: KyselyMigrationTable;
}