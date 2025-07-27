import axios from "axios";

export const chatWithGemini = async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required and must be a string." });
    }

    try {
        const geminiRes = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCINnz-YU3V24BlnJSutJL2kCBN2niylcM",
            {
                contents: [{ parts: [{ text }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        const botText =
            geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from Gemini.";

        return res.status(200).json({ text: botText });
    } catch (err) {
        console.error("Gemini API Error:", err?.response?.data || err.message);
        return res.status(500).json({ error: "Failed to fetch response from Gemini." });
    }
};
