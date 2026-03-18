const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.post("/plan", async (req, res) => {
  try {
    // Get data safely
    const destination = req.body?.destination;
    const days = req.body?.days;
    const budget = req.body?.budget;

    // Validation
    if (!destination || !days || !budget) {
      return res.status(400).json({ error: "Missing input data" });
    }

    // Prompt
    const prompt = 
    `Create EXACTLY ${days} days travel itinerary for ${destination} within ₹${budget}.
    
    STRICT RULES:
    - Only generate Day 1 to Day ${days}
    - Do NOT add extra days
    - Do NOT skip any day
    
    Format:
    Day 1:
    Day 2:
    
    Include:
    - Places to visit
    - Local experiences
    - Food to try
    - Accommodation suggestions
    - Transportation options
    - Travel tips

    Keep it simple.
    `;


    // API call to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    // Debug (optional)
    // console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    // Handle API error
    if (data.error) {
      console.log("Gemini API Error:", data.error);
      return res.status(500).json({ error: "Gemini API failed" });
    }

    // Extract response safely
    let plan = "No plan generated";

    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      plan = data.candidates[0].content.parts
        .map((part) => part.text || "")
        .join("");
    }

    // Send response
    res.json({ plan });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;
