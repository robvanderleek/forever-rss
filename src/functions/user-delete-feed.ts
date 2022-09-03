import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {MongoDbService} from "../services/MongoDbService";

const handler: Handler = async function (event: HandlerEvent, context: HandlerContext) {
    if (!context.clientContext || !context.clientContext.user) {
        return {statusCode: 401};
    }
    if (!event.body) {
        return {statusCode: 400}
    }
    const {uuid} = JSON.parse(event.body);
    const user = context.clientContext['user'];
    const dbService = new MongoDbService();
    await dbService.removeUserFeed(user.sub, uuid);
    return {statusCode: 200};
}

module.exports = {
    handler: handler
}