const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./db');
const { PORT } = require('./config/keys');

const app = express();

// Connect to MongoDB
connectDB();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes call
app.use('/api', require('./routes'));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
