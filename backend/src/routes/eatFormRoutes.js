const express = require('express');
const { getDbPool } = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  const pool = await getDbPool();
  const client = await pool.connect();
  try {
    const { businessId, menuTypes, averageCost, special_days } = req.body;
    
    // Insert into eat table
    const eatResult = await client.query(
      'INSERT INTO eat (business_id, menu_types, cost, special_days) VALUES ($1, $2, $3, $4) RETURNING id',
      [businessId, JSON.stringify(JSON.parse(menuTypes)), averageCost, JSON.parse(special_days)]
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

router.post('/eat-eat-type', async (req, res) => {
  const pool = await getDbPool();
  const client = await pool.connect();
  try {
    const { eatId, typeId } = req.body;

    await client.query('INSERT INTO eat_eat_type (eat_id, eat_type_id) VALUES ($1, $2)', [eatId, typeId]);

    res.status(200).json({ message: 'Eat type inserted successfully' });
  } catch (error) {
    console.error('Error inserting eat type:', error);
    res.status(500).send('Error inserting eat type');
  } finally {
    client.release();
  }
});

module.exports = router;
