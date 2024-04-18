const express = require('express');
const router = express.Router();
const { getDbPool } = require('../db');

router.get('/', async (req, res) => {
    const client = await getDbPool().connect();
    try {
        const users = await client.query('SELECT * FROM users');
        const posts = await client.query('SELECT * FROM posts');
        client.release();
        res.status(200).json({ users: users.rows, posts: posts.rows });
    } catch (error) {
        client.release();
        console.error('Error fetching state:', error);
        res.status(500).json({ message: 'Error fetching state', error: error.message });
    }
});

module.exports = router;
