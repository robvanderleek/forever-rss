import {Generated} from "kysely";

export interface FeedTable {
    id: Generated<string>;
    title: string;
    url: string;
}