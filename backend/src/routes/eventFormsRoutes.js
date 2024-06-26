const express = require('express');
const multer = require('multer');
const { getDbPool } = require('../db');

const router = express.Router();
const upload = multer();

router.post('/', async (req, res) => {
  console.log('Request Body:', req.body);

  const pool = await getDbPool();
  const client = await pool.connect();
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
      socialMedia,
      logoUrl,
      imageUrls
    } = req.body;

    // Debugging logs to check the received data
    console.log('eventName:', eventName);
    console.log('streetAddress:', streetAddress);
    console.log('city:', city);
    console.log('state:', state);
    console.log('zipCode:', zipCode);
    console.log('latitude:', latitude);
    console.log('longitude:', longitude);
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    console.log('startTime:', startTime);
    console.log('endTime:', endTime);
    console.log('description:', description);
    console.log('phone:', phone);
    console.log('email:', email);
    console.log('website:', website);
    console.log('socialMedia:', socialMedia);
    console.log('logoUrl:', logoUrl);
    console.log('imageUrls:', imageUrls);

    // Insert into events table
    const eventResult = await client.query(
      `INSERT INTO events 
        (name, street_address, city, state, zip, lat, long, start_date, end_date, start_time, end_time, description, phone, email, web, social_platforms, logo, images) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
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
        endDate,
        startTime,
        endTime,
        description,
        phone,
        email,
        website,
        JSON.stringify(JSON.parse(socialMedia)),
        logoUrl,
        imageUrls.length ? JSON.stringify(JSON.parse(imageUrls)) : null
      ]
    );
    const eventId = eventResult.rows[0].id;

    res.status(200).json({ eventId });
  } catch (error) {
    console.error('Error submitting event form:', error);
    res.status(500).json({ error: 'Error submitting event form' });
  } finally {
    client.release();
  }
});

module.exports = router;
