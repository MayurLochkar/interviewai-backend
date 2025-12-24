import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const response = await fetch("https://api.vapi.ai/call/web", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId: process.env.VAPI_ASSISTANT_ID,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "VAPI start failed" });
  }
});

export default router;
