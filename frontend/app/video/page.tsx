"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Video, Play } from "lucide-react";
import { toast } from "sonner";
import { BASE_API_URL } from "@/lib/constants";

const VideoPage = () => {
    const [videoUrl, setVideoUrl] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGeneratedVideo, setHasGeneratedVideo] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const generateSubtitles = async () => {
        const response = await fetch(
            `${BASE_API_URL}/audio/generate-subtitle`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.ok) throw new Error("Failed to generate subtitles");
    };

    const generateVideo = async () => {
        const response = await fetch(`${BASE_API_URL}/video/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to generate video");
    };

    const getVideo = async () => {
        const response = await fetch(`${BASE_API_URL}/video/`);

        if (!response.ok) throw new Error("Failed to get video");

        const data = await response.json();
        setVideoUrl(data.url);
    };

    const handleGenerateVideo = async () => {
        setIsGenerating(true);
        try {
            await generateSubtitles();
            await generateVideo();
            await getVideo();

            setHasGeneratedVideo(true);
            toast.success("Your video is ready!");
        } catch (error) {
            toast.error("Failed to generate video. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (!videoUrl) return;

        setIsDownloading(true);
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `generated-video-${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Video downloaded successfully!");
        } catch (error) {
            toast.error("Failed to download video. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-semibold mt-24 px-6">
                Generate Your Video
            </h1>

            <div className="px-6 py-4 pb-20 md:pb-8 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-2xl mx-auto">
                    {hasGeneratedVideo && videoUrl && !isGenerating ? (
                        <>
                            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                                <video
                                    controls
                                    className="w-full h-full"
                                    preload="metadata"
                                >
                                    <source src={videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </>
                    ) : (
                        // Placeholder
                        <div
                            className={`${isGenerating ? "animate-pulse" : ""}`}
                        >
                            <div
                                className={`w-full aspect-video rounded-lg flex items-center justify-center ${
                                    isGenerating
                                        ? "bg-muted animate-pulse"
                                        : "bg-muted/50"
                                }`}
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                ) : (
                                    <div className="text-muted-foreground text-center">
                                        <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                            <Play className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm">
                                            Generated Video
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons Section */}
                <div className="flex justify-center gap-4 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateVideo}
                        className="cursor-pointer"
                        disabled={isGenerating || !!videoUrl}
                    >
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Video className="w-4 h-4 mr-1" />
                        )}
                        {isGenerating ? "Generating..." : "Generate Video"}
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleDownload}
                        className="cursor-pointer"
                        disabled={!videoUrl || isDownloading}
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-1" />
                        )}
                        {isDownloading ? "Downloading..." : "Download"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VideoPage;
