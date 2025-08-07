// src/App.jsx
import React, { useState, useEffect } from 'react';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import './index.css';




export default function App() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);



  return (
    <div className="whatsapp-clone">
      <div className="sidebar">
        <div className="sidebar-header">Chats</div>
        <ConversationList
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>

      <div className="chat-window-container">
        <ChatWindow selectedConversation={selectedConversation} messages={messages} />
      </div>
    </div>
  );
}
