import {Handler, HandlerContext, HandlerEvent} from "@netlify/functions";
import {parseFeedEntries} from "../feed-utils";
import {rssFetch} from "../function-utils";

const handler: Handler = async (event: HandlerEvent, _: HandlerContext) => {
    const url = event.queryStringParameters?.url;
    if (!url) {
        return {statusCode: 400};
    }
    const response = await rssFetch(url);
    if (response.ok) {
        const text = await response.text();
        const result = parseFeedEntries(text);
        return {
            statusCode: 200, body: JSON.stringify({message: result}),
        };
    } else {
        return {
            statusCode: 204, body: JSON.stringify({message: []}),
        };
    }
}

module.exports = {
    handler: handler
}