const express = require('express');
const { getDbPool } = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Request Body:', req.body);

  const pool = await getDbPool();
  const client = await pool.connect();
  try {
    const { businessId, menuTypes, averageCost } = req.body;


    // Insert into play table
    const eatResult = await client.query(
      'INSERT INTO stay (business_id, stay_types, cost) VALUES ($1, $2, $3) RETURNING id',
      [businessId, JSON.stringify(JSON.parse(menuTypes)), averageCost]
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