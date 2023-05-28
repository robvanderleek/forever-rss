import {NextApiRequest, NextApiResponse} from 'next';
import {createKysely} from '@vercel/postgres-kysely';
import {Database} from "@/entities/schemas/Database";


export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const db = createKysely<Database>();

    const feedId = await db
        .insertInto('feed')
        .values({title: 'Coding Horror', url: 'https://blog.codinghorror.com/rss/'})
        .returning('id')
        .execute();

    console.log(`New feed, ID: ${feedId}`);
    return response.status(200).json({feedId});
}