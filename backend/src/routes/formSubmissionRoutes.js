const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middlewares/auth');
const { getDbPool } = require('../db');

// Middleware to check JWT
router.use(checkJwt);

router.use((req, res, next) => {
    console.log('Incoming Request:');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Handle form submission
router.post('/', async (req, res) => {
  try {
    const {
      businessName,
      active,
      streetAddress,
      mailingAddress,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      phone,
      email,
      website,
      socialMedia,
      description,
      chamberMember,
      logoUrl,
      imageUrls
    } = req.body;

    // Validate form data
    if (!businessName || !streetAddress || !city || !state || !zipCode) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Parse social media data if present
    let socialMediaArray = [];
    try {
      socialMediaArray = socialMedia ? JSON.parse(socialMedia) : [];
      console.log('Parsed social media array:', socialMediaArray);
    } catch (parseError) {
      console.error('Error parsing social media JSON:', parseError);
      return res.status(400).json({ error: 'Invalid JSON format for social media' });
    }

    // Parse chamber member boolean
    const isChamberMember = chamberMember === 'true';

    // Parse active status boolean
    const isActive = active === 'true';

    // Get database connection pool
    const pool = await getDbPool();

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert business data
      const businessResult = await client.query(
        `INSERT INTO businesses (active, name, street_address, mailing_address, city, state, zip, lat, long, phone, email, web, social_platforms, images, description, chamber_member, logo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,
        [isActive, businessName, streetAddress, mailingAddress, city, state, zipCode, latitude, longitude, phone, email, website, JSON.stringify(socialMediaArray), imageUrls, description, isChamberMember, logoUrl]
      );

      await client.query('COMMIT');
      res.status(201).json({ message: 'Business created successfully', id: businessResult.rows[0].id });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during transaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
