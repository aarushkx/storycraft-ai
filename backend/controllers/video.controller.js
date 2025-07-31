import { exec } from "child_process";
import fs from "fs/promises";

export const generateVideo = async (req, res) => {
    const imagePath = "bucket/assets/image.png";
    const audioPath = "bucket/assets/audio.wav";
    const subtitlePath = "bucket/assets/audio.srt";
    const outputPath = "bucket/generated/video.mp4";

    try {
        await Promise.all([
            fs.access(imagePath),
            fs.access(audioPath),
            fs.access(subtitlePath),
        ]);

        try {
            await fs.access(outputPath);
            await fs.unlink(outputPath);
        } catch (error) {}

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
        console.error("File check failed or FFmpeg error:", error);
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
