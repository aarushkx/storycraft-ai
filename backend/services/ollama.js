const OLLAMA_BASE_URL = "http://localhost:11434";
const MODEL = "llama2";

export const generateWithOllama = async (prompt) => {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: MODEL,
            prompt,
            stream: false,
        }),
    });

    if (!res.ok) throw new Error("Ollama request failed");

    const data = await res.json();
    return data.response;
};
