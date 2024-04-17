const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require('cors');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const app = express();
app.use(cors());

// Initialize the SecretsManager client from AWS SDK v3
const secretsManager = new SecretsManagerClient({
    region: "us-east-1"
});

const input = {
    SecretId: "rds!db-85391d2e-b3ae-4a20-819b-473a66906068"
};

app.get('/', async (req, res) => {
    console.log("Request received, starting processing...");
    try {
        console.log("Retrieving secret...");
        const secretStartTime = Date.now();
        // Using the new AWS SDK v3 command pattern
        const command = new GetSecretValueCommand(input);
        const data = await secretsManager.send(command);
        console.log(`Secret retrieved in ${Date.now() - secretStartTime}ms`);
        console.log("Secret Data:", data);

        console.log("Sending response back to client...");
        res.status(200).json({ message: 'Secret retrieval successful', secret: data.SecretString });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Secret retrieval failed', error: error.message });
    }
});

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
