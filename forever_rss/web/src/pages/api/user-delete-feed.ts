import {DatabaseService} from "@/services/DatabaseService";
import {getSubject} from "@/function-utils";
import {VercelRequest, VercelResponse} from "@vercel/node";
import {logger} from "@/logger";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const subject = await getSubject(req);
    if (!subject) {
        return res.status(401).end();
    }
    if (!req.body) {
        return res.status(400).end();
    }
    const {uuid} = JSON.parse(req.body);
    const databaseService = new DatabaseService();
    logger.info(`Unsubscribing user ${subject} from feed ${uuid}`);
    await databaseService.unsubscribe(subject, uuid);
    return res.status(200).end();
}