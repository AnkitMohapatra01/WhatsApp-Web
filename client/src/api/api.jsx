// api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export async function fetchConversations() {
  const res = await axios.get(`${API_BASE}/conversations`);
  console.log(res);
  return res.data;
}

export async function fetchMessages(wa_id) {
  const res = await axios.get(`${API_BASE}/messages/${wa_id}`);
  return res.data;
}

export async function sendMessage(data) {
  const res = await axios.post(`${API_BASE}/messages`, data);
  return res.data;
}