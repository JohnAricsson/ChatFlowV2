import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatWithGemini = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const generatedText = response.text || "No response from Gemini";

    res.status(200).json({
      _id: `ai-${Date.now()}`,
      text: generatedText,
      senderId: "gemini-ai-bot",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GEMINI API ERROR:", error);
    res.status(500).json({
      message: error.message || "Gemini failed to respond",
    });
  }
};
