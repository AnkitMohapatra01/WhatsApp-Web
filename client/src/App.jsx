// App.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { fetchConversations, fetchMessages, sendMessage } from "./api/api";
import { io } from "socket.io-client";

export default function App() {
  const [conversations, setConversations] = useState([
    { wa_id: "919937320320", name: "Ravi Kumar", lastMessage: "Hi!" },
  { wa_id: "918888888888", name: "Ankit", lastMessage: "Hello!" }
  ]);
  const [selectedWaId, setSelectedWaId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [messages, setMessages] = useState([]);
  const YOUR_USER_ID = "919937320320"; // dynamically set this from auth or context

  useEffect(() => {
    async function loadConversations() {
      const convos = await fetchConversations();
      setConversations(convos);
      if (convos.length) setSelectedWaId(convos[0].wa_id);
    }
    loadConversations();
  }, []);
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: { userId: YOUR_USER_ID },
    });

    socket.on("newMessage", (message) => {
      console.log("Real-time new message:", message);
      setMessages((prev) => [...prev, message]); // append new message to state
    });

    return () => {
      socket.disconnect(); // cleanup on unmount
    };
  }, [YOUR_USER_ID]);

  useEffect(() => {
    if (!selectedWaId) return;
    async function loadMessages() {
      const msgs = await fetchMessages(selectedWaId);
      setMessages(msgs);
    }
    loadMessages();
  }, [selectedWaId]);

  const handleSendMessage = async (text) => {
    const messageData = {
    wa_id: selectedWaId,
    name: selectedUserName, // pass the user’s name here
    text,
    from: "me",
    timestamp: new Date().toISOString(),
  };
  console.log(messageData);
  
    await sendMessage(messageData);
    setMessages((prev) => [...prev, messageData]);
  };

  const enrichedConversations = conversations.map((c) => {
    return {
      ...c,
      lastMessage: messages.find((m) => m.wa_id === c.wa_id) || null,
    };
  });
  function handleSelectChat(wa_id) {
  setSelectedWaId(wa_id);
  
  // Find name from conversations
  const user = conversations.find(c => c.wa_id === wa_id);
  console.log(user);
  
  setSelectedUserName(user?.name || wa_id); // fallback to wa_id if name missing
}


  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        conversations={enrichedConversations}
        selectedWaId={selectedWaId}
        onSelect={handleSelectChat}
      />
      <ChatWindow
        conversation={{ messages }}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
