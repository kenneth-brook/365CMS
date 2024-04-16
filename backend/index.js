const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const AWS = require('aws-sdk');

const app = express();
app.use(cors());

const secretsManager = new AWS.SecretsManager({
    region: "us-east-1",
    apiVersion: '2017-10-17'
});

let dbPool;

app.get('/', async (req, res) => {
    console.log("Request received, starting processing...");
    try {
        if (!dbPool) {
            console.log("Database pool not initialized, retrieving secret...");
            const secretStartTime = Date.now();
            const data = await secretsManager.getSecretValue({ SecretId: "rds!db-85391d2e-b3ae-4a20-819b-473a66906068" }).promise();
            console.log(`Secret retrieved in ${Date.now() - secretStartTime}ms`);

            console.log("Parsing secret and initializing database pool...");
            const secret = JSON.parse(data.SecretString);
            dbPool = new Pool({
                user: secret.username,
                password: secret.password,
                host: 'easyflow-dev-demo-db.cx7nkm5j7v6b.us-east-1.rds.amazonaws.com',
                database: 'easyflow_dev_demo',
                port: 5432,
                ssl: { rejectUnauthorized: false } // for demo purposes only; specify CA in production
            });
            console.log("Database pool initialized.");
        }

        console.log("Connecting to database...");
        const dbConnectStartTime = Date.now();
        const client = await dbPool.connect();
        console.log(`Database connected in ${Date.now() - dbConnectStartTime}ms`);

        console.log("Executing query...");
        const queryStartTime = Date.now();
        await client.query('SELECT NOW()'); // simple query to test connectivity
        console.log(`Query executed in ${Date.now() - queryStartTime}ms`);
        client.release();

        console.log("Sending response back to client...");
        res.status(200).json({ message: 'Connection successful' });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Connection failed', error: error.message });
    }
});

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
