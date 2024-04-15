const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require('cors'); // Import the cors middleware

const app = express();

// Use the cors middleware to enable CORS
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Connection good');
});

// Instead of app.listen
const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);

