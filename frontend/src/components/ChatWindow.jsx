// src/components/ChatWindow.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatWindow = ({ selectedConversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');  // State to handle the message input
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Fetch messages when conversation changes
  useEffect(() => {
    const fetch = async () => {
      if (!selectedConversation) return;

      try {
        const { data } = await axios.get(
          `http://localhost:5000/messages/${selectedConversation}`
        );
        setMessages(data);

        // Set contact name and number (from the first message)
        if (data.length > 0) {
          setContactName(data[0].contact_name);  // Get contact name from the first message
          setContactNumber(data[0].contact_number);  // Get contact number
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetch();
  }, [selectedConversation]);

  // Render status ticks
  const renderStatus = (status) => {
    if (status === 'sent') return '✓';
    if (status === 'delivered') return '✓✓';
    if (status === 'read') return '✓✓ (read)';
    return '';
  };

  // Handle message send (form submission)
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;  // Don't send empty messages

    // Generate a unique message_id using the current timestamp
    const messageId = `msg_${Date.now()}`;

    // Construct new message object
    const newMsg = {
      wa_id: selectedConversation,
      message: newMessage,
      status: 'sent',  // We assume the status is "sent" initially
      timestamp: new Date(),
      contact_name: contactName,  // Add contact name (from the first message)
      contact_number: contactNumber,  // Add contact number
      message_id: messageId,  // Set the unique message_id
    };

    // Save to MongoDB
    try {
      const { data } = await axios.post('http://localhost:5000/messages/send', newMsg);
      setMessages([...messages, data]);  // Update UI with the new message
      setNewMessage('');  // Clear the input field after sending
    } catch (err) {
      console.error('Error saving message:', err);
    }
  };

  // If no chat selected
  if (!selectedConversation) {
    return <div className="no-chat">Select a chat to start messaging</div>;
  }

  return (
    <div className="chat-window">
      {/* Header with contact name & number */}
      <header className="chat-header">
        <div className="contact-name">{contactName || selectedConversation}</div>
        <div className="contact-number">{contactNumber || selectedConversation}</div>
      </header>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg._id} className={`message ${msg.status}`}>
            <p className="message-text">{msg.message}</p>
            <div className="message-meta">
              <small className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </small>
              <small className="status-indicator">{renderStatus(msg.status)}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
