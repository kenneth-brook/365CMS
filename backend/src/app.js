const express = require('express');
const cors = require('cors');
const setupRoutes = require('./routes/setupRoutes');
const stateManagementRoutes = require('./routes/stateManagementRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());

app.use('/login', authRoutes);
app.use('/setup', setupRoutes);
app.use('/', stateManagementRoutes);

app.get('*', (req, res) => {
    res.status(200).send(`You hit path: ${req.path}`);
});

module.exports = app;
