// // Sidebar.jsx
// import React from "react";

// export default function Sidebar({ conversations, selectedWaId, onSelect }) {

//   return (
//     <div className="sidebar" style={{ width: 300, borderRight: "1px solid #ddd" }}>
//       <h2>Chats</h2>
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {conversations.map(({ wa_id, name, lastMessage }, i) => (
//           <li
//             key={wa_id}
//             onClick={() => onSelect(wa_id)}
//             style={{
//               padding: "10px",
//               backgroundColor: wa_id === selectedWaId ? "#e6f7ff" : "transparent",
//               cursor: "pointer",
//               borderBottom: "1px solid #eee",
//             }}
//           >
//             <b>{name || wa_id}</b>
//             <br />
//             <small>{lastMessage?.text?.slice(0, 30) || "No messages yet"}</small>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



import React from "react";

export default function Sidebar({ conversations, selectedWaId, onSelect }) {
  return (
    <div
      className="sidebar"
      style={{
        width: "320px",
        height: "100vh",
        borderRight: "1px solid #ddd",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "15px 20px",
          fontWeight: "bold",
          fontSize: "1.5rem",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f5f5f5",
        }}
      >
        Chats
      </header>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        {conversations.map(({ wa_id, name, lastMessage }, i) => (
          <li
            key={wa_id}
            onClick={() => onSelect(wa_id)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 15px",
              backgroundColor: wa_id === selectedWaId ? "#ebf7ff" : "transparent",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f5faff")}
            onMouseLeave={e =>
              (e.currentTarget.style.backgroundColor = wa_id === selectedWaId ? "#ebf7ff" : "transparent")
            }
          >
            {/* Placeholder avatar */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#bbb",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 15,
                userSelect: "none",
              }}
            >
              {name ? name.charAt(0).toUpperCase() : wa_id.charAt(0)}
            </div>

            {/* Chat info */}
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontWeight: "600", fontSize: "1rem", color: "#222" }}>
                {name || wa_id}
              </div>
              {/* <div style={{ fontSize: "0.85rem", color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {lastMessage?.slice(0, 30) || "No messages yet"}
              </div> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
