const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/tickets');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Support CRM server is running' });
});

// Routes
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});