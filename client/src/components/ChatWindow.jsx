// ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ conversation, onSendMessage }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

    useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: 20 }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 10, display: "flex", flexDirection: "column" }}>
        {conversation?.messages?.length ? (
          conversation.messages.map((msg) => (
            <MessageBubble key={msg._id} message={msg} isOwn={msg.from !== "user"} />
          ))
        ) : (
          <div>No messages yet</div>
        )}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 20, border: "1px solid #ccc" }}
        />
        <button onClick={handleSend} style={{ marginLeft: 10, padding: "10px 20px", borderRadius: 20, cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
}
