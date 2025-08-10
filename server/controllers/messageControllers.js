import ProcessedMessage from "../models/ProcessedMessage.js";
import { io, userSocketMap } from "../server.js";

export async function getMessagesByWaId(req, res) {
  try {
    const { wa_id } = req.params;
    const messages = await ProcessedMessage.find({ wa_id }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function saveMessage(req, res) {
  try {
    const { name,wa_id,  text, from, timestamp } = req.body;

    if (!wa_id || !name || !text || !from) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = await ProcessedMessage.create({
      wa_id,
      name: name || null,
      business_number: null,
      msg_id: null,
      meta_msg_id: null,
      from,
      text,
      type: "text",
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      status: "sent",
      raw: {},
    });

    // Emit to the recipient if online
    const recipientSocketId = userSocketMap[wa_id];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Server error" });
  }
}
