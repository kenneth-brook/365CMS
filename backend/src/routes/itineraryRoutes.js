const express = require('express');
const { getDbPool } = require('../db');
const router = express.Router();

// Route to save an itinerary
router.post('/save', async (req, res) => {
    const { userId, itineraryName, itineraryData } = req.body;
    if (!userId || !itineraryData) {
        return res.status(400).send('User ID and itinerary data must be provided');
    }

    try {
        const pool = await getDbPool();
        const client = await pool.connect();
        try {
            const result = await client.query(
                'INSERT INTO itinerary (user_id, itinerary_name, itinerary_data) VALUES ($1, $2, $3) RETURNING id',
                [userId, itineraryName, itineraryData]
            );
            res.status(201).json({ message: 'Itinerary saved successfully', itineraryId: result.rows[0].id });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error saving itinerary:', error);
        res.status(500).send('Error saving itinerary');
    }
});

// Route to retrieve itineraries for a user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).send('User ID must be provided');
    }

    try {
        const pool = await getDbPool();
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM itinerary WHERE user_id = $1', [userId]);
            res.status(200).json(result.rows);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error retrieving itineraries:', error);
        res.status(500).send('Error retrieving itineraries');
    }
});

router.put('/update/:itineraryId', async (req, res) => {
    const { itineraryId } = req.params;
    const { itineraryData, itineraryName } = req.body;

    try {
        const pool = await getDbPool();
        const client = await pool.connect();
        try {
            let query = 'UPDATE itinerary SET ';
            const values = [];
            let valueIndex = 1;

            if (itineraryData) {
                query += `itinerary_data = $${valueIndex}, `;
                values.push(itineraryData);
                valueIndex++;
            }
            
            if (itineraryName) {
                query += `itinerary_name = $${valueIndex}, `;
                values.push(itineraryName);
                valueIndex++;
            }

            // Remove the trailing comma and space
            query = query.slice(0, -2);

            query += ` WHERE id = $${valueIndex} RETURNING *`;
            values.push(itineraryId);

            const result = await client.query(query, values);
            res.json(result.rows[0]);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error updating itinerary:', error);
        res.status(500).send('Error updating itinerary');
    }
});


module.exports = router;
