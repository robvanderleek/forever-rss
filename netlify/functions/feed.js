const fetch = require("node-fetch");
const {XMLParser} = require("fast-xml-parser");

exports.handler = async function (event, context) {
    const response = await fetch('http://blog.cleancoder.com/atom.xml');
    const result = [];
    if (response.ok) {
        const text = await response.text();
        const xmlParser = new XMLParser();
        const obj = xmlParser.parse(text);
        for (const e of obj.feed.entry) {
            result.push({'id': e.id, 'title': e.title, 'updated': e.updated, 'content': e.content});
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({message: result}),
    };
}