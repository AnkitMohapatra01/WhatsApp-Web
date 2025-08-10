// // MessageBubble.jsx
// import React from "react";

// export default function MessageBubble({ message, isOwn }) {
//   return (
//     <div
//       style={{
//         maxWidth: "70%",
//         margin: "5px 0",
//         padding: 10,
//         borderRadius: 15,
//         backgroundColor: isOwn ? "#DCF8C6" : "#FFF",
//         alignSelf: isOwn ? "flex-end" : "flex-start",
//         boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
//       }}
//     >
//       <div>{message.text}</div>
//       <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>
//         {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//         {" "}
//         {isOwn && <small>{message.status}</small>}
//       </div>
//     </div>
//   );
// }


import React from "react";

export default function MessageBubble({ message, isOwn }) {
  return (
    <div
      style={{
        maxWidth: "70%",
        margin: "8px 0",
        padding: 12,
        borderRadius: 15,
        backgroundColor: isOwn ? "#DCF8C6" : "#FFF",
        alignSelf: isOwn ? "flex-end" : "flex-start",
        boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
        color: isOwn ? "#000" : "#333",
        wordBreak: "break-word",
      }}
    >
      <div>{message.text}</div>
      <div
        style={{
          fontSize: 10,
          color: "#555",
          marginTop: 6,
          display: "flex",
          justifyContent: isOwn ? "flex-end" : "flex-start",
          gap: 6,
        }}
      >
        <span>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isOwn && <small style={{ textTransform: "capitalize" }}>{message.status}</small>}
      </div>
    </div>
  );
}
