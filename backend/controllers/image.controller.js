import path from "path";

export const selectImage = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: "Image is required" });

        const imagePath = path.resolve("bucket", "assets", req.file.filename);

        return res.status(200).json({
            message: "Image selected successfully",
            imagePath,
        });
    } catch (error) {
        console.error("Failed to select image:", error);
        return res.status(500).json({ error: "Failed to select image" });
    }
};
