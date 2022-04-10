const fs = require("fs");
const {XMLParser} = require("fast-xml-parser");
const path = require("path");


exports.handler = function (event, context) {
    const opmlPath = path.join(__dirname, 'my.opml');
    const opml = fs.readFileSync(opmlPath, 'utf8');
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