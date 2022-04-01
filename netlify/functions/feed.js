const fetch = require("node-fetch");
const {XMLParser} = require("fast-xml-parser");

exports.handler = async function(event, context) {
    console.log('HERE');
    const result = await fetch('http://blog.cleancoder.com/atom.xml');
    let message = "Hello World";
    if (result.ok) {
        const text = await result.text();
        const xmlParser = new XMLParser();
        message = xmlParser.parse(text);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: message }),
    };
}
