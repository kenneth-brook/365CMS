const express = require('express');
const { getDbPool } = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Request Body:', req.body);

  const pool = await getDbPool();
  const client = await pool.connect();
  try {
    const { businessId, menuTypes, special_days, hours } = req.body;


    // Insert into play table
    const eatResult = await client.query(
      'INSERT INTO play (business_id, play_types, special_days, hours) VALUES ($1, $2, $3, $4) RETURNING id',
      [businessId, JSON.stringify(JSON.parse(menuTypes)), JSON.stringify(JSON.parse(special_days)), JSON.stringify(JSON.parse(hours))]
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