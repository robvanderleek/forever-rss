const fs = require("fs");
const {XMLParser} = require("fast-xml-parser");


exports.handler = function (event, context) {
    const opml = fs.readFileSync(require.resolve('./my.opml'), 'utf8');
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