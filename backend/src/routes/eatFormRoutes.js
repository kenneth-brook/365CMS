const express = require('express');
const { getDbPool } = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Request Body:', req.body);

  const pool = await getDbPool();
  const client = await pool.connect();
  try {
    const { businessId, menuTypes, averageCost, special_days } = req.body;

    // No need to parse if already an object
    const parsedMenuTypes = typeof menuTypes === 'string' ? JSON.parse(menuTypes) : menuTypes;
    const parsedSpecialDays = typeof special_days === 'string' ? JSON.parse(special_days) : special_days;

    // Insert into eat table
    const eatResult = await client.query(
      'INSERT INTO eat (business_id, menu_types, cost, special_days) VALUES ($1, $2, $3, $4) RETURNING id',
      [businessId, JSON.stringify(parsedMenuTypes), averageCost, JSON.stringify(parsedSpecialDays)]
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

router.put('/:id', async (req, res) => {
  console.log('Request Body:', req.body);

  const pool = await getDbPool();
  const client = await pool.connect();
  try {
      const { businessId, menuTypes, averageCost, special_days } = req.body;

      // Debugging logs
      console.log('Received menuTypes:', menuTypes);

      // No need to parse if already an object
      const parsedMenuTypes = typeof menuTypes === 'string' ? JSON.parse(menuTypes) : menuTypes;
      const parsedSpecialDays = typeof special_days === 'string' ? JSON.parse(special_days) : special_days;

      // Additional debugging logs
      console.log('Parsed menuTypes:', parsedMenuTypes);

      // Update eat data
      await client.query(
          'UPDATE eat SET menu_types = $1, cost = $2, special_days = $3 WHERE business_id = $4',
          [JSON.stringify(parsedMenuTypes), averageCost, JSON.stringify(parsedSpecialDays), businessId]
      );

      res.status(200).json({ message: 'Eat form updated successfully' });
  } catch (error) {
      console.error('Error updating eat form:', error);
      res.status(500).json({ error: 'Error updating eat form' });
  } finally {
      client.release();
  }
});

module.exports = router;
