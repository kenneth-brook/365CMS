const express = require('express');
const router = express.Router();
const multer = require('multer');
const { checkJwt } = require('../middlewares/auth');
const { pool } = require('../db');

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to check JWT
router.use(checkJwt);

// Handle form submission
router.post('/', upload.array('imageFiles'), async (req, res) => {
    try {
        const {
            businessName,
            active,
            streetAddress,
            mailingAddress,
            city,
            state,
            zipCode,
            latitude,
            longitude,
            phone,
            email,
            website,
            socialMedia,
            description,
            chamberMember
        } = req.body;

        // Validate form data (you can add more validation as needed)
        if (!businessName || !streetAddress || !city || !state || !zipCode) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        // Parse social media data
        const socialMediaArray = JSON.parse(socialMedia);

        // Parse chamber member boolean
        const isChamberMember = chamberMember === 'true';

        // Parse active status boolean
        const isActive = active === 'true';

        // Collect image URLs
        const imageUrls = req.files.map(file => `https://your-storage-service-url/${file.originalname}`);

        // Start a transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert business data
            const businessResult = await client.query(
                `INSERT INTO businesses (active, name, street_address, mailing_address, city, state, zip, lat, long, phone, email, web, social_platforms, images, description, chamber_member)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id`,
                [isActive, businessName, streetAddress, mailingAddress, city, state, zipCode, latitude, longitude, phone, email, website, socialMediaArray, imageUrls, description, isChamberMember]
            );

            await client.query('COMMIT');
            res.status(201).json({ message: 'Business created successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error during transaction', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error processing form data', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
