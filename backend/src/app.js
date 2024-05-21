const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const setupRoutes = require('./routes/setupRoutes');
const stateManagementRoutes = require('./routes/stateManagementRoutes');
const authRoutes = require('./routes/authRoutes');
const role = require('./routes/role');
const formSubmissionRoutes = require('./routes/formSubmissionRoutes');
const categoryTypeRoutes = require('./routes/categoryTypeRoutes');

const app = express();
app.use(cookieParser());
const corsOptions = {
    origin: 'https://dev.365easyflow.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/login', authRoutes);
app.use('/setup', setupRoutes);
app.use('/user-role', role);
app.use('/form-submission', formSubmissionRoutes);
app.use('/category-type', categoryTypeRoutes);
app.use('/', stateManagementRoutes);

app.get('*', (req, res) => {
    res.status(200).send(`You hit path: ${req.path}`);
});

module.exports = app;
