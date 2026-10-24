const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Set JWT_SECRET in server/.env to a randomly generated value of at least 32 characters.');
}

const connectDB = require('./config/db');
const { fetchAndSyncMetalRates } = require('./services/metalRateService');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const metalRoutes = require('./routes/metalRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const supportRoutes = require('./routes/supportRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Synchronize metal rates on server launch
fetchAndSyncMetalRates();

// API Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'LuxeLoom API Server',
    time: new Date(),
  });
});

// API Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/metals', metalRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);

// Serve static React client build if available
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`[LuxeLoom Backend] Serving static frontend build from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[LuxeLoom Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[LuxeLoom Backend] Base URL: http://localhost:${PORT}`);
});
