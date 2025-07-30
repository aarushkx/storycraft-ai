import { generateWithOllama } from "../services/ollama.js";

export const getLlamaResponse = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const output = await generateWithOllama(prompt);
        res.json({ output });
    } catch (error) {
        console.error("Llama error:", error);
        res.status(500).json({ error: "Ollama failed to generate response" });
    }
};
