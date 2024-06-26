const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const setupRoutes = require('./routes/setupRoutes');
const stateManagementRoutes = require('./routes/stateManagementRoutes');
const authRoutes = require('./routes/authRoutes');
const role = require('./routes/role');
const formSubmissionRoutes = require('./routes/formSubmissionRoutes');
const categoryTypeRoutes = require('./routes/categoryTypeRoutes');
const menuTypesRoutes = require('./routes/menuTypesRoutes');
const averageCostRoutes = require('./routes/averageCostRoutes');
const eatFormRoutes = require('./routes/eatFormRoutes');
const playFormRoutes = require('./routes/playFormRoutes');
const shopFormRoutes = require('./routes/shopFormRoutes');
const stayFormRoutes = require('./routes/stayFormRoutes');
const tableRoutes = require('./routes/tableRoutes');
const eventFormRoutes = require('./routes/eventFormRoutes'); // Add this line

const app = express();
app.use(cookieParser());

const corsOptions = {
  origin: (origin, callback) => {
    console.log(`Origin: ${origin}`);
    if (origin === 'https://douglas.365easyflow.com' || 
        origin === 'http://10.128.1.185:3000' ||
        origin === 'http://ec2-3-94-236-188.compute-1.amazonaws.com' ||
        !origin || 
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/10\.128\.1\.\d+:\d+$/.test(origin)) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/login', authRoutes);
app.use('/setup', setupRoutes);
app.use('/user-role', role);
app.use('/form-submission', formSubmissionRoutes);
app.use('/category-type', categoryTypeRoutes);
app.use('/menu-types', menuTypesRoutes);
app.use('/average-costs', averageCostRoutes);
app.use('/eat-form-submission', eatFormRoutes);
app.use('/play-form-submission', playFormRoutes);
app.use('/shop-form-submission', shopFormRoutes);
app.use('/stay-form-submission', stayFormRoutes);
app.use('/data', tableRoutes);
app.use('/event-form-submission', eventFormRoutes); // Add this line
app.use('/', stateManagementRoutes);

app.get('*', (req, res) => {
    res.status(200).send(`You hit path: ${req.path}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
