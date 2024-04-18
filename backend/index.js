const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const app = express();
app.use(cors());

// Initialize the SecretsManager client from AWS SDK v3
const secretsManager = new SecretsManagerClient({
    region: "us-east-1"
});

let dbPool;

app.get('/', async (req, res) => {
    console.log("Request received, starting processing...");
    try {
        if (!dbPool) {
            const command = new GetSecretValueCommand({ SecretId: "rds!db-165b602b-f5aa-4eb3-a079-7f73c4b4e840" });
            const data = await secretsManager.send(command);
            const secret = JSON.parse(data.SecretString);
            dbPool = new Pool({
                user: secret.username,
                password: secret.password,
                host: 'easyflow-pgdb-dev-demo.cx7nkm5j7v6b.us-east-1.rds.amazonaws.com',
                database: 'easyflow_dev_demo',
                port: 5432,
                ssl: { rejectUnauthorized: false } // for demo purposes only; specify CA in production
            });
        }
        const dbConnectStartTime = Date.now();
        const client = await dbPool.connect();
        await client.query('SELECT NOW()');
        client.release();
        res.status(200).json({ message: 'Connection successful' });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Connection failed', error: error.message });
    }
});

app.get('/setup', async (req, res) => {
    try {
        await ensureDatabaseSchema();
        res.status(200).json({ message: 'Setup completed successfully' });
    } catch (error) {
        console.error('Setup failed:', error);
        res.status(500).json({ message: 'Setup failed', error: error.message });
    }
});

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
