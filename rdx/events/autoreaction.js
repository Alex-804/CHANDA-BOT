// ================== AUTO REACTION MESSENGER BOT ==================
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// ====== CONFIG ======
const PAGE_ACCESS_TOKEN = "PASTE_PAGE_TOKEN_HERE";
const VERIFY_TOKEN = "VERIFY_TOKEN_HERE";

// ====== AUTO REACTION DATA (INLINE) ======
const reactions = [
  { keys: ["hi", "hello", "hey"], reply: "Hello 😊" },
  { keys: ["kaise ho", "kya haal"], reply: "Alhamdulillah ❤️" },
  { keys: ["ok", "theek"], reply: "👍" },
  { keys: ["haha", "lol"], reply: "😂😂" },
  { keys: ["love", "pyar"], reply: "😍" },
  { keys: ["bye", "allah hafiz"], reply: "Allah Hafiz 🤍" }
];

const defaultReplies = [
  "Samajh gaya 😊",
  "Achha 👍",
  "Haha 😂",
  "Theek hai 👌"
];

// ====== VERIFY WEBHOOK ======
app.get("/webhook", (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === VERIFY_TOKEN
  ) {
    return res.status(200).send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

// ====== RECEIVE MESSAGE ======
app.post("/webhook", (req, res) => {
  const event = req.body.entry?.[0]?.messaging?.[0];
  if (!event || !event.message || !event.message.text) {
    return res.sendStatus(200);
  }

  const senderId = event.sender.id;
  const userMsg = event.message.text.toLowerCase();

  let reply =
    reactions.find(r => r.keys.some(k => userMsg.includes(k)))?.reply ||
    defaultReplies[Math.floor(Math.random() * defaultReplies.length)];

  sendMessage(senderId, reply);
  res.sendStatus(200);
});

// ====== SEND MESSAGE ======
function sendMessage(senderId, text) {
  axios.post(
    `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
    {
      recipient: { id: senderId },
      message: { text }
    }
  ).catch(err => console.log("Send error:", err.message));
}

// ====== START SERVER ======
app.listen(3000, () => {
  console.log("Auto Reaction Bot Running on port 3000");
});
