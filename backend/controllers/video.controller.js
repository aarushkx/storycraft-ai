import { exec } from "child_process";
import fs from "fs/promises";

const findImageFile = async () => {
    const extensions = [".png", ".jpg", ".jpeg"];
    for (const ext of extensions) {
        const filePath = `bucket/assets/image${ext}`;
        try {
            await fs.access(filePath);
            return filePath;
        } catch {}
    }
    return null;
};

export const generateVideo = async (req, res) => {
    const audioPath = "bucket/assets/audio.wav";
    const subtitlePath = "bucket/assets/audio.srt";
    const outputPath = "bucket/generated/video.mp4";

    try {
        const imagePath = await findImageFile();
        if (!imagePath) throw new Error("No valid image file found");

        await Promise.all([fs.access(audioPath), fs.access(subtitlePath)]);

        try {
            await fs.access(outputPath);
            await fs.unlink(outputPath);
        } catch {}

        const ffmpegCommand = `ffmpeg -loop 1 -i ${imagePath} -i ${audioPath} -vf "subtitles=${subtitlePath}:force_style='Alignment=5,FontSize=16'" -c:v libx264 -profile:v main -level 3.1 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest ${outputPath}`;

        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error("FFmpeg error:", error.message);
                console.error("stderr:", stderr);
                return res
                    .status(500)
                    .json({ error: "Video generation failed" });
            }

            return res.status(200).json({
                message: "Video generated successfully",
                path: "http://localhost:8000/bucket/generated/video.mp4",
            });
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Failed to generate video" });
    }
};

export const getVideo = async (req, res) => {
    try {
        await fs.access("bucket/generated/video.mp4");
        return res
            .status(200)
            .json({ url: "http://localhost:8000/bucket/generated/video.mp4" });
    } catch (error) {
        console.error("Failed to get video:", error);
        return res.status(500).json({ error: "Failed to get video" });
    }
};
