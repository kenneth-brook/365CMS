const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middlewares/auth');
const { getDbPool } = require('../db');

// Middleware to check JWT
router.use(checkJwt);

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
    } catch (parseError) {
      console.error('Error parsing social media JSON:', parseError);
      return res.status(400).json({ error: 'Invalid JSON format for social media' });
    }

    // Parse chamber member boolean
    const isChamberMember = chamberMember === 'true';

    // Parse active status boolean
    const isActive = active === 'true';

    // Handle empty fields for arrays
    const logoUrlValue = logoUrl || null;
    const imageUrlsArray = imageUrls ? JSON.parse(imageUrls) : [];

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
        [isActive, businessName, streetAddress, mailingAddress, city, state, zipCode, latitude? parseFloat(latitude) : null, longitude ? parseFloat(longitude) : null, phone, email, website, JSON.stringify(socialMediaArray), imageUrlsArray.length ? imageUrlsArray : null, description, isChamberMember, logoUrlValue]
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

router.put('/:id', async (req, res) => {
  console.log('Request Body:', req.body);

  const pool = await getDbPool();
  const client = await pool.connect();
  try {
      const { businessId, menuTypes, averageCost, special_days } = req.body;

      // Debugging logs to check the received data
      console.log('businessId:', businessId);
      console.log('menuTypes:', menuTypes);
      console.log('averageCost:', averageCost);
      console.log('special_days:', special_days);

      // Update eat data
      await client.query(
          'UPDATE eat SET menu_types = $1, cost = $2, special_days = $3 WHERE business_id = $4',
          [JSON.stringify(JSON.parse(menuTypes)), averageCost, JSON.stringify(JSON.parse(special_days)), businessId]
      );

      res.status(200).json({ message: 'Eat form updated successfully' });
  } catch (error) {
      console.error('Error updating eat form:', error);
      res.status(500).json({ error: 'Error updating eat form' });
  } finally {
      client.release();
  }
});

router.put('/:id', async (req, res) => {
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

      const businessId = req.params.id;

      // Validate form data
      if (!businessName || !streetAddress || !city || !state || !zipCode) {
          return res.status(400).json({ error: 'Required fields are missing' });
      }

      // Parse social media data if present
      let socialMediaArray = [];
      try {
          socialMediaArray = socialMedia ? JSON.parse(socialMedia) : [];
      } catch (parseError) {
          console.error('Error parsing social media JSON:', parseError);
          return res.status(400).json({ error: 'Invalid JSON format for social media' });
      }

      // Parse chamber member boolean
      const isChamberMember = chamberMember === 'true';

      // Parse active status boolean
      const isActive = active === 'true';

      // Handle empty fields for arrays
      const logoUrlValue = logoUrl || null;
      const imageUrlsArray = imageUrls ? JSON.parse(imageUrls) : [];

      // Get database connection pool
      const pool = await getDbPool();

      // Start a transaction
      const client = await pool.connect();
      try {
          await client.query('BEGIN');

          // Update business data
          await client.query(
              `UPDATE businesses SET active = $1, name = $2, street_address = $3, mailing_address = $4, city = $5, state = $6, zip = $7, lat = $8, long = $9, phone = $10, email = $11, web = $12, social_platforms = $13, images = $14, description = $15, chamber_member = $16, logo = $17 WHERE id = $18`,
              [isActive, businessName, streetAddress, mailingAddress, city, state, zipCode, latitude ? parseFloat(latitude) : null, longitude ? parseFloat(longitude) : null, phone, email, website, JSON.stringify(socialMediaArray), imageUrlsArray.length ? imageUrlsArray : null, description, isChamberMember, logoUrlValue, businessId]
          );

          await client.query('COMMIT');
          res.status(200).json({ message: 'Business updated successfully', id: businessId });
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
