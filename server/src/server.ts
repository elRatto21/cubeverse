// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/database';

const PORT = parseInt(process.env.PORT as string) || 8000;

// Connect to Database
connectDB();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});