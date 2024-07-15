const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDbPool } = require('../db'); // Adjust path as necessary

const router = express.Router();

// POST endpoint for registration
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password must be provided');
    }

    try {
        const pool = await getDbPool();
        const client = await pool.connect();
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await client.query('INSERT INTO "user" (email, password) VALUES ($1, $2)', [email, hashedPassword]);
            res.status(201).send('User registered successfully');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Registration error');
    }
});

// POST endpoint for login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password must be provided');
    }

    try {
        const pool = await getDbPool();
        const client = await pool.connect();
        try {
            const userResult = await client.query('SELECT * FROM "user" WHERE email = $1', [email]);
            if (userResult.rows.length === 0) {
                return res.status(404).send('User not found');
            }

            const user = userResult.rows[0];
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send('Invalid password');
            }

            // Generate a token
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', {
                expiresIn: 86400 // 24 hours
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // Always true to support SameSite=None
                sameSite: 'None',
                maxAge: 86400000 // 24 hours in milliseconds
            });

            res.status(200).send('Login successful');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Login error');
    }
});

module.exports = router;
