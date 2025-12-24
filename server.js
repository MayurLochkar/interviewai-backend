require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("InterviewAI Backend Running 🚀");
});

// ✅ REAL USE
app.use("/ai/vapi", require("./routes/ai/vapi"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on ${PORT}`)
);
