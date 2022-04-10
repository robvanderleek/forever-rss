const {XMLParser} = require("fast-xml-parser");
const fetch = require("node-fetch");


exports.handler = async function (event, context) {
    const response = await fetch('https://raw.githubusercontent.com/robvanderleek/robvanderleek/main/my-awesome.opml');
    if (response.ok) {
        const opml = await response.text();
        const options = {ignoreAttributes: false};
        const xmlParser = new XMLParser(options);
        const obj = xmlParser.parse(opml);
        const outlines = obj.opml.body.outline;
        const feeds = outlines.filter(o => '@_xmlUrl' in o).map(o => ({title: o['@_title'], url: o['@_xmlUrl']}));
        return {
            statusCode: 200,
            body: JSON.stringify(feeds),
        };
    }
}