const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { checkJwt } = require('../middlewares/auth');
const { pool } = require('../db');

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: 'logo', maxCount: 1 }, 
  { name: 'imageFiles', maxCount: 10 }
]);

// Middleware to check JWT
router.use(checkJwt);

// Handle form submission
router.post('/', upload, async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

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

        // Function to upload a file to the PHP server
        const uploadFile = async (file) => {
            const form = new FormData();
            form.append('image', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype
            });

            const response = await axios.post('http://dev.365easyflow.com/easyflow-images/upload.php', form, {
                headers: {
                    ...form.getHeaders()
                }
            });

            if (response.data.message.includes("uploaded")) {
                return `http://dev.365easyflow.com/easyflow-images/uploads/${file.originalname}`;
            } else {
                throw new Error('Failed to upload image');
            }
        };

        // Collect logo URL
        let logoUrl = null;
        if (req.files['logo'] && req.files['logo'][0]) {
            logoUrl = await uploadFile(req.files['logo'][0]);
        }

        // Collect image URLs
        const imageUrls = [];
        if (req.files['imageFiles']) {
            for (const file of req.files['imageFiles']) {
                const url = await uploadFile(file);
                imageUrls.push(url);
            }
        }

        // Start a transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert business data
            const businessResult = await client.query(
                `INSERT INTO businesses (active, name, street_address, mailing_address, city, state, zip, lat, long, phone, email, web, social_platforms, images, description, chamber_member, logo)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,
                [isActive, businessName, streetAddress, mailingAddress, city, state, zipCode, latitude, longitude, phone, email, website, socialMediaArray, imageUrls, description, isChamberMember, logoUrl]
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
