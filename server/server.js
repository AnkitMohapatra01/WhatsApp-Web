import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { ConnectDB } from "./config/db.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

//? Express App
const app = express();
const server = http.createServer(app);

//? Middlewares
app.use(express.json());
app.use(cors());

export const io = new Server(server, {
  cors: { origin: "*" } // allow frontend access
});

export const userSocketMap = {}; // { userId: socketId }

await ConnectDB();
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
  });
});

// Webhook endpoint
app.post("/webhook", async (req, res) => {
  const payload = req.body;
  const change = payload.metaData.entry[0].changes[0].value;

  // 📩 New message
  if (change.messages) {
    const contact = change.contacts?.[0] || {};
    const msg = change.messages[0];

    const savedMsg = await ProcessedMessage.create({
      wa_id: contact.wa_id,
      name: contact.profile?.name || null,
      business_number: change.metadata.display_phone_number,
      msg_id: msg.id,
      from: msg.from === contact.wa_id ? "user" : "api",
      text: msg.text?.body || "",
      type: msg.type,
      timestamp: new Date(Number(msg.timestamp) * 1000),
      raw: payload
    });

    io.emit("new_message", savedMsg); // 🚀 Send to all clients
    console.log(`💬 New message from ${contact.wa_id}`);
  }

  // 📌 Status update
  if (change.statuses) {
    const status = change.statuses[0];

    await ProcessedMessage.updateOne(
      { $or: [{ msg_id: status.id }, { meta_msg_id: status.meta_msg_id }] },
      { $set: { status: status.status } }
    );

    io.emit("status_update", {
      id: status.id,
      meta_msg_id: status.meta_msg_id,
      status: status.status
    });

    console.log(`✅ Status updated to ${status.status}`);
  }

  res.sendStatus(200);
});


//?Api EndPoint
app.get("/", (req, res) => {
  res.send("Server Running !!!");
});
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running at PORT:${PORT}`);
});
