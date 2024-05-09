const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDbPool } = require('../db'); // Adjust path as necessary

const router = express.Router();

// POST endpoint for login
router.post('/', async (req, res) => {
    console.log('Attempting to log in with body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password must be provided');
    }

    try {
        const pool = await getDbPool();
        const client = await pool.connect();
        try {
            const userResult = await client.query('SELECT * FROM login WHERE email = $1', [email]);
            if (userResult.rows.length === 0) {
                return res.status(404).send('User not found');
            }

            const user = userResult.rows[0];
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send('Invalid password');
            }

            // Generate a token (optional)
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', {
                expiresIn: 86400 // 24 hours
            });

            res.json({ message: 'Login successful', token });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Login error');
    }
});

module.exports = router;