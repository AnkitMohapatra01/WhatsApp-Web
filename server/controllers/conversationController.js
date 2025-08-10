import ProcessedMessage from "../models/ProcessedMessage.js";

export async function getConversations(req, res) {
  try {
    // Aggregate distinct conversations by wa_id
    const conversations = await ProcessedMessage.aggregate([
      // Sort by timestamp descending (latest messages first)
      { $sort: { timestamp: -1 } },
      // Group by wa_id, pick first (latest) message info
      {
        $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          lastMessage: { $first: "$text" },
          lastTimestamp: { $first: "$timestamp" },
        },
      },
      // Sort by lastTimestamp descending
      { $sort: { lastTimestamp: -1 } },
      // Project result to nicer format
      {
        $project: {
          _id: 0,
          wa_id: "$_id",
          name: 1,
          lastMessage: 1,
          lastTimestamp: 1,
        },
      },
    ]);
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Server error" });
  }
}
