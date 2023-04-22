import {parseFeedEntries} from "@/feed-utils";
import {getSubject, rssFetch} from "@/function-utils";
import {VercelRequest, VercelResponse} from "@vercel/node";
import {MongoDbService} from "@/services/MongoDbService";
import {logger} from "@/logger";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    let url = req.query.url;
    if (Array.isArray(url)) {
        url = url[0]
    }
    if (!url) {
        return res.status(400);
    }
    const subject = await getSubject(req);
    if (subject) {
        const dbService = new MongoDbService();
        logger.info(`Updating access time for user: ${subject}, url: ${url}`);
        await dbService.updateAccessTime(subject, url);
    }
    const response = await rssFetch(url);
    if (response.ok) {
        const text = await response.text();
        const result = parseFeedEntries(text);
        return res.status(200).json({message: result});
    } else {
        return res.status(200).json({message: []});
    }
}