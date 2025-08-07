// routes/webhook.js

import express from 'express';
import saveMessage from '../controllers/messageController.js';  // Import the default controller function

const router = express.Router();

// Route for handling incoming webhook POST request
router.post('/', saveMessage);  // Use the saveMessage controller function

export default router;
