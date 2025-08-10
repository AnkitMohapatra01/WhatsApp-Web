import express from "express";
import { getMessagesByWaId, saveMessage } from "../controllers/messageControllers.js";

const router = express.Router();

router.get("/:wa_id", getMessagesByWaId);

router.post("/", saveMessage);

export default router;
