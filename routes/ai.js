const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// ✅ FIX — correct import for CommonJS
const pdfParse = require("pdf-parse");


const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 🧠 1️⃣ Resume Upload + AI Resume Analysis (Real Llama)
router.post("/resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.join(__dirname, "..", req.file.path);
    const pdfBuffer = fs.readFileSync(filePath);

    // ✅ Extract text from PDF using pdf-parse
    const pdfData = await pdfParse(pdfBuffer);
    fs.unlinkSync(filePath);

    const resumeText = pdfData.text.trim().slice(0, 3000);
    if (!resumeText) {
      return res.status(400).json({ error: "No readable text in the PDF." });
    }

    // 💬 Llama3 prompt for smart resume analysis
    const prompt = `
You are an AI Resume Reviewer.
Analyze the following resume and write a JSON object like this:
{
  "summary": "2 lines resume overview",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Resume Text:
${resumeText}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
        options: { temperature: 0.6, num_predict: 350 },
      }),
    });

    const data = await response.json();
    console.log("\n🔍 Raw Llama3 Output:\n", data.response, "\n");

    let output = data.response || "";
    let jsonMatch = output.match(/\{[\s\S]*\}/);
    let analysis = null;

    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.warn("⚠️ JSON parse failed, trying cleanup...");
        const cleaned = jsonMatch[0]
          .replace(/'/g, '"')
          .replace(/,\s*}/g, "}")
          .replace(/,\s*\]/g, "]");
        analysis = JSON.parse(cleaned);
      }
    }

    // ✅ Safe fallback (always returns valid data)
    if (!analysis || !analysis.summary) {
      analysis = {
        summary:
          "Your resume looks promising but could use clearer structure and highlights.",
        suggestions: [
          "Add quantifiable results to your project descriptions.",
          "List key skills and technologies more prominently.",
          "Keep bullet points short and results-oriented.",
        ],
      };
    }

    res.json(analysis);
  } catch (err) {
    console.error("❌ Resume analysis failed:", err.message);
    res.status(500).json({
      summary: "No summary available.",
      suggestions: ["Unable to process the resume at this time."],
    });
  }
});

// 💬 2️⃣ Smart Chat (Llama3)
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const prompt = `
You are a friendly AI career assistant.
Reply to the user's message naturally in 2–3 lines, related to resume, DSA, or career.

User: ${message}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
        options: { temperature: 0.7, num_predict: 100 },
      }),
    });

    const data = await response.json();
    const reply =
      data.response?.trim().split("\n").slice(0, 3).join(" ") ||
      "I'm here to help with resume and career guidance.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat failed:", err.message);
    res.status(500).json({
      reply: "Chat service failed. Make sure Ollama is running.",
    });
  }
});

module.exports = router;
