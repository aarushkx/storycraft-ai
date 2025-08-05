"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight, Sparkles, Image } from "lucide-react";
import { toast } from "sonner";
import { BASE_API_URL } from "@/lib/constants";

interface GeneratedImage {
    url: string;
    file: File;
}

const BackgroundPage = () => {
    const [story, setStory] = useState("");
    const [imagePrompts, setImagePrompts] = useState<string[]>([]);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(
        []
    );
    const [selectedImage, setSelectedImage] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const placeholders = Array(3).fill(null);

    useEffect(() => {
        setStory(localStorage.getItem("STORY") || "");
    }, []);

    const generateImagePrompts = async () => {
        if (!story.trim()) return;

        setIsGenerating(true);
        try {
            const response = await fetch(
                `${BASE_API_URL}/ollama/generate-image-prompts`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ story }),
                }
            );

            if (!response.ok)
                throw new Error("Failed to generate image prompts");

            const data = await response.json();
            setImagePrompts(data.imagePrompts || []);
        } catch (error) {
            toast.error("Failed to generate image prompts. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const generateImages = async () => {
        if (imagePrompts.length === 0) return;

        setIsGenerating(true);
        try {
            const images = await Promise.all(
                imagePrompts.map(async (prompt, index) => {
                    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
                        prompt
                    )}?nologo=true`;

                    const response = await fetch(url);
                    if (!response.ok)
                        throw new Error(
                            "Failed to fetch image from pollinations.ai"
                        );

                    const blob = await response.blob();
                    const name = `image_${index + 1}.jpg`;

                    const file = new File([blob], name, { type: blob.type });
                    const objectUrl = URL.createObjectURL(file);

                    return { url: objectUrl, file };
                })
            );
            setGeneratedImages(images);
        } catch (error) {
            toast.error("Failed to generate images. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (imagePrompts.length > 0) generateImages();
    }, [imagePrompts]);

    const handleSubmit = async () => {
        if (!selectedImage) return;

        setIsSubmitting(true);
        try {
            const selected = generatedImages.find(
                (img) => img.url === selectedImage
            );
            if (!selected) throw new Error("Selected image not found");

            const formData = new FormData();
            formData.append("image", selected.file);

            const response = await fetch(`${BASE_API_URL}/image/select`, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) throw new Error("Failed to select image");

            setSubmissionSuccess(true);
        } catch (error) {
            toast.error("Failed to select image. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
    };

    return (
        <div className="min-h-screen">
            <h1 className="text-2xl font-semibold mt-24 px-6">
                Choose Your Background
            </h1>

            <div className="px-6 py-2 pb-20 md:pb-8 space-y-4">
                <div className="flex justify-start mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generateImagePrompts}
                        disabled={isGenerating || !story.trim()}
                    >
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4 mr-1" />
                        )}
                        {isGenerating
                            ? "Generating..."
                            : "Generate Background Options"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {generatedImages.length > 0 && !isGenerating
                        ? generatedImages.map(({ url }, index) => (
                              <Card
                                  key={index}
                                  className={`cursor-pointer transition-colors hover:bg-muted/80 p-2 shadow-none ${
                                      selectedImage === url ? "bg-muted/80" : ""
                                  }`}
                                  onClick={() => handleImageClick(url)}
                              >
                                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted/20">
                                      <img
                                          src={url}
                                          alt={`Generated image ${index + 1}`}
                                          className="w-full h-full object-cover"
                                      />
                                  </div>
                                  <p className="text-center text-sm text-muted-foreground mt-2">
                                      {imagePrompts[index]}
                                  </p>
                              </Card>
                          ))
                        : placeholders.map((_, index) => (
                              <Card
                                  key={index}
                                  className={`p-2 shadow-none ${
                                      isGenerating ? "animate-pulse" : ""
                                  }`}
                              >
                                  <div
                                      className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                                          isGenerating
                                              ? "bg-muted animate-pulse"
                                              : "bg-muted/50"
                                      }`}
                                  >
                                      {isGenerating ? (
                                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                      ) : (
                                          <div className="text-muted-foreground text-center">
                                              <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg mx-auto mb-2"></div>
                                              <p className="text-sm">
                                                  Background Image
                                              </p>
                                          </div>
                                      )}
                                  </div>
                                  <div
                                      className={`text-center mt-2 ${
                                          isGenerating ? "animate-pulse" : ""
                                      }`}
                                  >
                                      {isGenerating ? (
                                          <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                                      ) : (
                                          <p className="text-sm text-muted-foreground">
                                              Generate images to see prompts
                                          </p>
                                      )}
                                  </div>
                              </Card>
                          ))}
                </div>

                <div className="flex justify-end gap-4 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!selectedImage || isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Image className="w-4 h-4 mr-1" />
                        )}
                        {isSubmitting ? "Submitting..." : "Submit Image"}
                    </Button>

                    <Button size="sm" disabled={!submissionSuccess}>
                        Next <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BackgroundPage;
