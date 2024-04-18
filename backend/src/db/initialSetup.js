const { getDbPool } = require('./index');

async function ensureDatabaseSchema() {
    const client = await getDbPool().connect();
    try {
        const result = await client.query("SELECT to_regclass('public.users');");
        if (result.rows[0].to_regclass === null) {
            console.log("Database schema is not set up. Initializing...");
            await setupDatabaseSchema(client);
        } else {
            console.log("Database schema already set up.");
        }
    } finally {
        client.release();
    }
}

async function setupDatabaseSchema(client) {
    const queryText = `...`; // Same as previously defined
    await client.query(queryText);
    console.log("Database schema setup completed.");
}

module.exports = { ensureDatabaseSchema };
