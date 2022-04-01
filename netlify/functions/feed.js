const fetch = require("node-fetch");

exports.handler = async function(event, context) {
    console.log('HERE');
    const result = await fetch('http://blog.cleancoder.com/atom.xml');
    let message = "Hello World";
    if (result.ok) {
        message = await result.text();
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: message }),
    };
}
