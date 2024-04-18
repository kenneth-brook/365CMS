const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secretsManager = new SecretsManagerClient({
    region: "us-east-1"
});

async function getDatabaseCredentials() {
    const command = new GetSecretValueCommand({ SecretId: "rds!db-165b602b-f5aa-4eb3-a079-7f73c4b4e840" });
    const data = await secretsManager.send(command);
    return JSON.parse(data.SecretString);
}

module.exports = { getDatabaseCredentials };
