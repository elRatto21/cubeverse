// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/database';

const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});