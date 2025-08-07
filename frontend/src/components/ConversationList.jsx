// src/components/ConversationList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ConversationList({
  selectedConversation,
  setSelectedConversation
}) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/messages');
        setConversations(data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    })();
  }, []);

  return (
    <div className="conversation-list">
      {conversations.map((c) => (
        <div
          key={c.wa_id}
          className={
            'conversation-item' +
            (c.wa_id === selectedConversation ? ' active' : '')
          }
          onClick={() => setSelectedConversation(c.wa_id)}
        >
          <div className="wa-id">{c.wa_id}</div>
          <div className="last-message">{c.lastMessage}</div>
        </div>
      ))}
    </div>
  );
}
