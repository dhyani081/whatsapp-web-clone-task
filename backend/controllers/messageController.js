// controllers/messageController.js

import Message from '../models/message.js';  // Import the Message model

// Controller function to handle the webhook data and save to MongoDB
const saveMessage = async (req, res) => {
  try {
    const payload = req.body;  // Get the webhook data sent in the request

    // Extract necessary fields from the incoming payload
    const { wa_id, message, status } = {
      wa_id: payload.metaData.entry[0].changes[0].value.contacts[0].wa_id,  // WhatsApp ID
      message: payload.metaData.entry[0].changes[0].value.messages[0].text.body,  // Message body
      status: 'sent',  // Default status 'sent' (you can change this based on the data)
    };

    // Create a new Message object using the extracted data
    const newMessage = new Message({
      wa_id,
      message,
      status,
    });

    // Save the new message to the database
    await newMessage.save();

    // Respond with a success message
    res.status(201).json({ success: true, message: 'Message processed and saved' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Export the controller function using `export default`
export default saveMessage;
