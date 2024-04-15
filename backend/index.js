const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const cors = require('cors');
const { Client } = require('pg'); // PostgreSQL client library
const AWS = require('aws-sdk');

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
  try {
    // Create a Secrets Manager client
    const secretsManager = new AWS.SecretsManager();

    // Retrieve database credentials from AWS Secrets Manager
    const secretData = await secretsManager.getSecretValue({ SecretId: 'rds!db-85391d2e-b3ae-4a20-819b-473a66906068' }).promise();
    const secret = JSON.parse(secretData.SecretString);

    // Create a PostgreSQL client instance
    const client = new Client({
      user: secret.username,
      password: secret.password,
      host: 'easyflow-dev-demo-db.cx7nkm5j7v6b.us-east-1.rds.amazonaws.com', // Replace with your RDS endpoint
      database: 'easyflow-dev-demo-db', // Replace with your PostgreSQL database name
      port: 5432, // Default PostgreSQL port
      ssl: true // Set to true if your RDS instance requires SSL
    });

    // Connect to the PostgreSQL database
    await client.connect();

    // Close the database connection
    await client.end();

    // Return success response
    res.status(200).json({ message: 'Connection successful' });
  } catch (error) {
    console.error('Error:', error);
    // Return error response
    res.status(500).json({ message: 'Connection failed' });
  }
});

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
