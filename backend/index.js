const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Use pg Pool for connection pooling
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const app = express();
app.use(cors());

// Initialize database connection pool outside of the Lambda handler for connection reuse
let dbPool;

app.get('/', async (req, res) => {
  try {
    if (!dbPool) {
      const client = new SecretsManagerClient({ region: "us-east-1" });
      const secretResponse = await client.send(new GetSecretValueCommand({ SecretId: "rds!db-85391d2e-b3ae-4a20-819b-473a66906068" }));
      const secret = JSON.parse(secretResponse.SecretString);
      dbPool = new Pool({
        user: secret.username,
        password: secret.password,
        host: 'easyflow-dev-demo-db.cx7nkm5j7v6b.us-east-1.rds.amazonaws.com',
        database: 'easyflow_dev_demo',
        port: 5432,
        ssl: { rejectUnauthorized: false } // for demo purposes only; in production specify CA
      });
    }

    // Connect and check the connection
    const client = await dbPool.connect();
    await client.query('SELECT NOW()'); // simple query to test connectivity
    client.release();

    res.status(200).json({ message: 'Connection successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Connection failed', error: error.message });
  }
});

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);

