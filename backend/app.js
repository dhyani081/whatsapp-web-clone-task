// backend/app.js
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import webHookRoute from './routes/webhook.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server (no need for socket.io)

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Route Handling
app.use('/webHook', webHookRoute);
app.use('/messages', messageRoutes);

// Start the server
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

export default app;
