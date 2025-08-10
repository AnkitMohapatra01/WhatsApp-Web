import mongoose from "mongoose";

const ProcessedMessageSchema = new mongoose.Schema(
  {
    wa_id: { type: String, required: true, index: true },
    name: { type: String, default: null },
    business_number: { type: String, default: null },
    msg_id: { type: String, index: true },
    meta_msg_id: { type: String, index: true },
    from: { type: String, enum: ["user", "api", "me"], required: true },
    text: { type: String, default: "" },
    type: { type: String, default: "text" },
    conversation_id: { type: String, default: null },
    status: { type: String, enum: ["created", "sent", "delivered", "read"], default: "sent" },
    timestamp: { type: Date, required: true },
    raw: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("ProcessedMessage", ProcessedMessageSchema);
