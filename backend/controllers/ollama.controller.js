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
            if (parsed && typeof parsed === "object" && parsed.story) {
                story = parsed.story;
            }
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

        console.log("Image prompts response:", response);

        const prompts = [];
        const numberedPattern = /\d\./g;
        const matches = [...response.matchAll(numberedPattern)];

        if (matches.length < 3)
            throw new Error("Failed to extract exactly 3 numbered prompts");

        for (let i = 0; i < matches.length; i++) {
            const start = matches[i].index + matches[i][0].length;
            const end =
                i + 1 < matches.length ? matches[i + 1].index : response.length;

            let chunk = response.slice(start, end).trim();
            chunk = chunk.replace(/[\n\r]+/g, " ").trim();

            if (chunk.length > 0) prompts.push(chunk);
            if (prompts.length === 3) break;
        }

        if (prompts.length !== 3)
            throw new Error("Failed to extract exactly 3 valid prompts");

        return res.json({ imagePrompts: prompts });
    } catch (error) {
        console.error("Failed to generate image prompts:", error);
        return res
            .status(500)
            .json({ error: "Llama failed to generate image prompts" });
    }
};
