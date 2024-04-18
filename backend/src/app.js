const express = require('express');
const cors = require('cors');
const setupRoutes = require('./routes/setupRoutes');
const stateManagementRoutes = require('./routes/stateManagementRoutes');

const app = express();
app.use(cors());
app.use('/', stateManagementRoutes);
app.use('/setup', setupRoutes);

module.exports = app;
