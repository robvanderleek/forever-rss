import {MongoDbService} from "../src/services/MongoDbService";
import {getSubject} from "../src/function-utils";
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
    const dbService = new MongoDbService();
    await dbService.removeUserFeed(subject, uuid);
    return res.status(200);
}