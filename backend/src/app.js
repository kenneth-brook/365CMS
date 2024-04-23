const express = require('express');
const cors = require('cors');
const setupRoutes = require('./routes/setupRoutes');
const stateManagementRoutes = require('./routes/stateManagementRoutes');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/setup', async (req, res) => {
    console.log("Received request at /setup");
    try {
        setupRoutes;
        res.status(200).json({ message: 'Setup completed successfully' });
    } catch (error) {
        console.error('Setup failed:', error);
        res.status(500).json({ message: 'Setup failed', error: error.message });
    }
});

//app.use('/setup', setupRoutes);

app.get('/', (req, res) => {
    console.log('Handling root');
    res.send('Root route');
});

app.get('*', (req, res) => {
    res.status(200).send(`You hit path: ${req.path}`);
});

//app.use('/', stateManagementRoutes);

module.exports = app;
