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
    const queryText = `
    CREATE TABLE client (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        street_address VARCHAR(255),
        mailing_address VARCHAR(255),
        phone VARCHAR(20),
        city VARCHAR(100),
        state VARCHAR(100),
        zip VARCHAR(10),
        lat NUMERIC(9,6),
        long NUMERIC(9,6),
        hours JSONB,
        special_days JSONB,
        email VARCHAR(255),
        web VARCHAR(255),
        social JSONB
    );
    `;

    const queryStaff = `
    CREATE TABLE staff (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255),
        mailing_address VARCHAR(255),
        phone VARCHAR(20),
        city VARCHAR(100),
        state VARCHAR(100),
        zip VARCHAR(10),
        title VARCHAR(255),
        image_url VARCHAR(255),
        about TEXT
    );
    `;

    const queryLogin = `
    CREATE TABLE login (
        id SERIAL PRIMARY KEY,
        staff_id INTEGER NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
    );
    `;

    const queryClientSettings = `
    CREATE TABLE client_settings (
        id SERIAL PRIMARY KEY,
        mode VARCHAR(50),
        time_zone VARCHAR(50),
        ad_campaigns JSONB
    );
    `;

    const queryBusinesses = `
    CREATE TABLE businesses (
        id SERIAL PRIMARY KEY,
        active BOOLEAN DEFAULT false,
        name VARCHAR(255),
        street_address VARCHAR(255),
        mailing_address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        zip VARCHAR(10),
        lat NUMERIC(9,6),
        long NUMERIC(9,6),
        phone VARCHAR(20),
        hours JSONB,
        special_days JSONB,
        email VARCHAR(255),
        web VARCHAR(255),
        social_platforms JSONB,
        images TEXT[],  -- Array of image URLs
        ad_banner VARCHAR(255),  -- URL to image file
        description TEXT,
        chamber_member BOOLEAN DEFAULT false
    );
    `;

    const queryEat = `
    CREATE TABLE eat (
        id SERIAL PRIMARY KEY,
        business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        types TEXT[],
        breakfast BOOLEAN DEFAULT false,
        breakfast_hours VARCHAR(255),
        breakfast_cost JSONB,
        lunch BOOLEAN DEFAULT false,
        lunch_hours VARCHAR(255),
        lunch_cost JSONB,
        dinner BOOLEAN DEFAULT false,
        dinner_hours VARCHAR(255),
        dinner_cost JSONB,
        name VARCHAR(255),
        phone VARCHAR(20),
        hours JSONB,
        special_days JSONB,
        email VARCHAR(255),
        web VARCHAR(255),
        social_platforms JSONB,
        images TEXT[],
        ad_banner VARCHAR(255),
        description TEXT
    );
    `

    await client.query(queryText);
    console.log("Client table created.");
    await client.query(queryStaff);
    console.log("Staff table created.");
    await client.query(queryLogin);
    console.log("Login table created.");
    await client.query(queryClientSettings);
    console.log("Client settings table created.");
    await client.query(queryBusinesses);
    console.log("Businesses table created.");
    await client.query(queryEat);
    console.log("Eat table created.");
}


module.exports = { ensureDatabaseSchema };
