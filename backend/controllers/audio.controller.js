import fs from "fs/promises";

export const generateAudio = async (req, res) => {
    try {
        const { story, voice } = req.body;
        if (!story) return res.status(400).json({ error: "Story is required" });

        const response = await fetch("http://localhost:8001/generate-audio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ story, voice }),
        });
        if (!response.ok) throw new Error("Python API request failed");

        return res
            .status(200)
            .json({ message: "Audio generated successfully" });
    } catch (error) {
        console.error("Failed to generate audio:", error.message);
        return res.status(500).json({ error: "Failed to generate audio" });
    }
};

export const generateSubtitle = async (req, res) => {
    try {
        const response = await fetch(
            "http://localhost:8001/generate-subtitle",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: "audio.wav" }),
            }
        );
        if (!response.ok) throw new Error("Python API request failed");

        return res
            .status(200)
            .json({ message: "Subtitle generated successfully" });
    } catch (error) {
        console.error("Failed to generate subtitle:", error);
        return res.status(500).json({ error: "Failed to generate subtitle" });
    }
};

export const getAudio = async (req, res) => {
    try {
        await fs.access("bucket/assets/audio.wav");
        return res
            .status(200)
            .json({ url: "http://localhost:8000/bucket/assets/audio.wav" });
    } catch (error) {
        console.error("Failed to get audio:", error);
        return res.status(500).json({ error: "Failed to get audio" });
    }
};

export const getSupportedVoices = async (req, res) => {
    try {
        const voices = {
            female: ["af_heart", "af_aoede", "af_nicole"],
            male: ["am_adam", "am_echo", "am_onyx"],
        };
        return res.status(200).json({ voices });
    } catch (error) {
        console.error("Failed to get supported voices:", error);
        return res
            .status(500)
            .json({ error: "Failed to get supported voices" });
    }
};
