const awsServerlessExpress = require('aws-serverless-express');
const app = require('./src/app');

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => {
    console.log("Received event:", JSON.stringify(event));  // Logs the entire event object
    console.log("Path:", event.path);                        // Logs the path part of the event
    console.log("HTTP Method:", event.httpMethod);           // Logs the HTTP method of the request
    
    return awsServerlessExpress.proxy(server, event, context);
};
