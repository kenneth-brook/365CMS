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

const app = express();
app.use(cookieParser());

const corsOptions = {
  origin: (origin, callback) => {
      console.log(`Origin: ${origin}`);
      if (origin === 'https://douglas.365easyflow.com' || !origin) {
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
app.use('/', stateManagementRoutes);

app.get('*', (req, res) => {
    res.status(200).send(`You hit path: ${req.path}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
