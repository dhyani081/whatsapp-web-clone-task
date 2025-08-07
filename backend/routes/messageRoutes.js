import express from 'express';
import Message from '../models/message.js';

const router = express.Router();

// GET /messages - Get all conversations
router.get('/', async (req, res) => {
  try {
    const convos = await Message.aggregate([
      { $sort: { timestamp: 1 } },
      { $group: {
          _id: '$wa_id',
          lastMessage: { $last: '$message' },
          lastTimestamp: { $last: '$timestamp' }
        }
      },
      { $project: { wa_id: '$_id', lastMessage: 1, lastTimestamp: 1, _id: 0 } },
      { $sort: { lastTimestamp: -1 } }
    ]);
    res.json(convos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /messages/:wa_id - Get all messages for a particular conversation (wa_id)
router.get('/:wa_id', async (req, res) => {
  try {
    const msgs = await Message.find({ wa_id: req.params.wa_id }).sort('timestamp');
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /messages/send - Send a new message
router.post('/send', async (req, res) => {
  const { wa_id, message, status, timestamp, contact_name, contact_number, message_id } = req.body;

  try {
    // Check if all required fields are present
    if (!message_id || !wa_id || !message || !status || !timestamp || !contact_name || !contact_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new message
    const newMessage = new Message({
      wa_id,
      message,
      status,
      timestamp,
      contact_name,
      contact_number,
      message_id  // Ensure message_id is saved
    });

    // Save to MongoDB
    const savedMessage = await newMessage.save();
    
    // Return the saved message as the response
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message', message: err.message });
  }
});


export default router;
