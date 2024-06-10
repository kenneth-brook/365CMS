const express = require('express');
const { getDbPool } = require('../db');

const router = express.Router();

router.post('/eat-form-submission', async (req, res) => {
  const pool = await getDbPool();
  const client = await pool.connect();
  try {
    const { businessId, cost, name, phone, hours, special_days, email, web, social_platforms, images, description, logo, menuTypes } = req.body;
    
    // Insert into eat table
    const eatResult = await client.query(
      'INSERT INTO eat (business_id, cost, name, phone, hours, special_days, email, web, social_platforms, images, description, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
      [businessId, cost, name, phone, hours, special_days, email, web, social_platforms, images, description, logo]
    );
    const eatId = eatResult.rows[0].id;

    // Insert into eat_eat_type table
    const menuTypesArray = JSON.parse(menuTypes);
    for (const menuType of menuTypesArray) {
      await client.query('INSERT INTO eat_eat_type (eat_id, eat_type_id) VALUES ($1, $2)', [eatId, menuType.id]);
    }

    res.status(200).json({ eatFormId: eatId });
  } catch (error) {
    console.error('Error submitting eat form:', error);
    res.status(500).send('Error submitting eat form');
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
