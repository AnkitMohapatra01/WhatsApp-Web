import fs from "fs";
import "dotenv/config";
import path from "path";
import mongoose from "mongoose";
import ProcessedMessage from "../models/ProcessedMessage.js";

// === 1. Connect to MongoDB ===
await mongoose.connect(process.env.MONGODB_URI, { dbName: "whatsapp" });
console.log("✅ MongoDB connected");

// === 2. Read payloads folder ===
const payloadFolder = "./payloads"; // put your JSON files here
const files = fs.readdirSync(payloadFolder);

for (const file of files) {
  const filePath = path.join(payloadFolder, file);
  const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (payload.metaData?.entry?.[0]?.changes?.[0]?.value?.messages) {
    // 📥 Insert message
    const msg = payload.metaData.entry[0].changes[0].value.messages[0];
    const contact = payload.metaData.entry[0].changes[0].value.contacts?.[0];

    await ProcessedMessage.create({
      wa_id: contact?.wa_id,
      name: contact?.profile?.name,
      business_number: payload.metaData.entry[0].changes[0].value.metadata.display_phone_number,
      msg_id: msg.id,
      from: msg.from === contact?.wa_id ? "user" : "api",
      text: msg.text?.body || "",
      type: msg.type,
      timestamp: new Date(Number(msg.timestamp) * 1000),
      raw: payload
    });

    console.log(`✅ Inserted message: ${msg.id}`);

  } else if (payload.metaData?.entry?.[0]?.changes?.[0]?.value?.statuses) {
    // 🔄 Update message status
    const status = payload.metaData.entry[0].changes[0].value.statuses[0];

    const updateResult = await ProcessedMessage.updateOne(
      { $or: [{ msg_id: status.id }, { meta_msg_id: status.meta_msg_id }] },
      { $set: { status: status.status, conversation_id: status.conversation?.id } }
    );

    console.log(`🔄 Updated status for ${status.id} → ${status.status} (${updateResult.modifiedCount} updated)`);
  }
}

mongoose.connection.close();
console.log("🚪 Done & MongoDB connection closed");
