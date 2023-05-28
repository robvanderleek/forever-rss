import {DatabaseService} from "@/services/DatabaseService";
import {getSubject} from "@/function-utils";
import {VercelRequest, VercelResponse} from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const subject = await getSubject(req);
    if (!subject) {
        return res.status(401);
    }
    if (!req.body) {
        return res.status(400);
    }
    const {uuid} = JSON.parse(req.body);
    const databaseService = new DatabaseService();
    await databaseService.unsubscribe(subject, uuid);
    return res.status(200);
}