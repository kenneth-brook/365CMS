const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middlewares/auth');
const { getDbPool } = require('../db');

// Middleware to check JWT
router.use(checkJwt);

router.post('/', async (req, res) => {
  let client;
  try {
    const {
      eventName,
      streetAddress,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
      phone,
      email,
      website,
      socialMediaPairs,
      logoUrl,
      imageUrls
    } = req.body;

    const pool = await getDbPool();
    client = await pool.connect();

    let socialMediaArray = [];
    try {
      socialMediaArray = socialMediaPairs ? JSON.parse(socialMediaPairs) : [];
    } catch (parseError) {
      console.error('Error parsing social media JSON:', parseError);
      return res.status(400).json({ error: 'Invalid JSON format for social media' });
    }

    const logoUrlValue = logoUrl || null;
    const imageUrlsArray = imageUrls ? JSON.parse(imageUrls) : [];

    // Insert into events table
    const eventResult = await client.query(
      `INSERT INTO events 
        (name, street_address, city, state, zip, lat, long, start_date, end_date, start_time, end_time, description, phone, email, web, social_platforms, logo, images) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
      RETURNING id`,
      [
        eventName,
        streetAddress,
        city,
        state,
        zipCode,
        latitude ? parseFloat(latitude) : null,
        longitude ? parseFloat(longitude) : null,
        startDate,
        endDate ? endDate : null,
        startTime ? startTime : null,
        endTime ? endTime : null,
        description,
        phone,
        email,
        website,
        JSON.stringify(socialMediaArray),
        logoUrlValue,
        imageUrlsArray.length ? imageUrlsArray : null
      ]
    );
    const eventId = eventResult.rows[0].id;

    res.status(200).json({ eventId });
  } catch (error) {
    console.error('Error submitting event form:', error);
    res.status(500).json({ error: 'Error submitting event form' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
