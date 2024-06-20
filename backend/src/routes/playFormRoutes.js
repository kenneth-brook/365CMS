const express = require('express');
const { getDbPool } = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Request Body:', req.body);

  const pool = await getDbPool();
  const client = await pool.connect();
  try {
    const { businessId, menuTypes, special_days } = req.body;

    // Debugging logs to check the received data
    console.log('businessId:', businessId);
    console.log('menuTypes:', menuTypes);
    console.log('special_days:', special_days);

    // Insert into eat table
    const eatResult = await client.query(
      'INSERT INTO play (business_id, play_types, special_days) VALUES ($1, $2, $3) RETURNING id',
      [businessId, JSON.stringify(JSON.parse(menuTypes)), JSON.stringify(JSON.parse(special_days))]
    );
    const eatId = eatResult.rows[0].id;

    res.status(200).json({ eatFormId: eatId });
  } catch (error) {
    console.error('Error submitting eat form:', error);
    res.status(500).json({ error: 'Error submitting eat form' });
  } finally {
    client.release();
  }
});

module.exports = router;