import fetch from "node-fetch";

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const base64Image = req.file.buffer.toString("base64");

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are a home services assistant for an app called GoFix. Analyze the uploaded image and return: - title: SHORT (max 6 words). - description: 1-2 line helpful explanation of what probably needs fixing. - category: MUST be one of: ["Plumbing", "Electrical", "Cleaning", "Appliance Repair", "Carpentry", "Painting", "Others"]. Format STRICTLY as JSON: {"title": "", "description": "", "category": ""}`,
            },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    // For debugging use code below
    // console.log("🔥 RAW GEMINI RESULT:", JSON.stringify(result, null, 2));

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res
        .status(500)
        .json({ message: "Gemini returned no output", raw: result });
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res
        .status(500)
        .json({ message: "Invalid JSON output", rawText: text });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return res.json(parsed);
  } catch (err) {
    console.error("🔥 Gemini REST Error:", err);
    return res.status(500).json({ message: "AI failed", error: err.message });
  }
};
