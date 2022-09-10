import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {MongoDbService} from "../services/MongoDbService";
import {getSubject} from "../function-utils";

const handler: Handler = async function (event: HandlerEvent, context: HandlerContext) {
    const subject = await getSubject(event);
    if (!subject) {
        return {statusCode: 401};
    }
    if (!event.body) {
        return {statusCode: 400}
    }
    const {uuid} = JSON.parse(event.body);
    const dbService = new MongoDbService();
    await dbService.removeUserFeed(subject, uuid);
    return {statusCode: 200};
}

module.exports = {
    handler: handler
}