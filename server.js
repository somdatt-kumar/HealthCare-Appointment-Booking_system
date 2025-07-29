// Fix EventEmitter warnings
require('events').EventEmitter.defaultMaxListeners = 20;

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const errorHandler = require('./middleware/error');

// Load env vars
require('dotenv').config();

// Create Express app
const app = express();

// Body parser
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB Connected'))
.catch(err => console.error('DB Connection Error:', err));

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handler middleware (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});

