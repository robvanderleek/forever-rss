import {parseFeedEntries} from "../src/feed-utils";
import {rssFetch} from "../src/function-utils";
import {VercelRequest, VercelResponse} from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    let url = req.query.url;
    if (Array.isArray(url)) {
        url = url[0]
    }
    if (!url) {
        return res.status(400);
    }
    const response = await rssFetch(url);
    if (response.ok) {
        const text = await response.text();
        const result = parseFeedEntries(text);
        return res.status(200).json({message: result});
    } else {
        return res.status(204).json({message: []});
    }
}