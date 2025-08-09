import { generateWithOllama } from "../services/ollama.js";
import { getStoryPrompt, getImagePrompt } from "../lib/prompts.js";

export const generateStory = async (req, res) => {
    try {
        const { theme } = req.body;
        if (!theme) return res.status(400).json({ error: "Theme is required" });

        const STORY_PROMPT = getStoryPrompt(theme);
        let story = await generateWithOllama(STORY_PROMPT);

        try {
            const parsed = JSON.parse(story);
            if (parsed && typeof parsed === "object" && parsed.story)
                story = parsed.story;
        } catch (e) {}

        story = story
            .trim()
            .replace(/^[{\["']+|[}\]"']+$/g, "")
            .trim();

        return res.json({ story });
    } catch (error) {
        console.error("Failed to generate story:", error);
        return res
            .status(500)
            .json({ error: "Llama failed to generate story" });
    }
};

export const generateImagePrompts = async (req, res) => {
    try {
        const { story } = req.body;
        if (!story) return res.status(400).json({ error: "Story is required" });

        const IMAGE_PROMPT = getImagePrompt(story);
        let response = await generateWithOllama(IMAGE_PROMPT);

        const startIndex = response.indexOf("{");
        const lastIndex = response.lastIndexOf("}");

        if (startIndex === -1 || lastIndex === -1 || startIndex >= lastIndex)
            throw new Error("No valid JSON found in response");

        const jsonString = response.substring(startIndex, lastIndex + 1);

        let prompts;
        try {
            prompts = JSON.parse(jsonString);

            if (
                !prompts ||
                !prompts.imagePrompts ||
                !Array.isArray(prompts.imagePrompts)
            )
                throw new Error("Invalid response structure");
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return res
                .status(500)
                .json({ error: "Invalid response format from AI" });
        }

        return res.json(prompts);
    } catch (error) {
        console.error("Llama failed to generate image prompts:", error);
        return res
            .status(500)
            .json({ error: "Failed to generate image prompts" });
    }
};
